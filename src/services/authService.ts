import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import {
  clienteEmailFromDocument,
  isEmail,
  normalizeDocument,
} from "../lib/document";
import { signToken } from "../lib/jwt";
import { AppError } from "../middleware/errorHandler";

function authResponse(user: {
  id: string;
  nome: string;
  email: string;
  role: string;
  documento: string | null;
  cliente?: { id: string; cpf: string } | null;
}) {
  const document =
    user.documento ?? user.cliente?.cpf ?? normalizeDocument(user.email);

  const token = signToken({
    sub: user.id,
    document,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      document,
      clienteId: user.cliente?.id ?? null,
    },
  };
}

async function findUserForLogin(identifier: string) {
  const trimmed = identifier.trim();

  if (isEmail(trimmed)) {
    return prisma.user.findUnique({
      where: { email: trimmed.toLowerCase() },
      include: { cliente: { select: { id: true, cpf: true } } },
    });
  }

  const documento = normalizeDocument(trimmed);
  if (!documento) return null;

  const byDocumento = await prisma.user.findUnique({
    where: { documento },
    include: { cliente: { select: { id: true, cpf: true } } },
  });
  if (byDocumento) return byDocumento;

  const cliente = await prisma.cliente.findFirst({
    where: { cpf: documento },
    include: {
      user: { include: { cliente: { select: { id: true, cpf: true } } } },
    },
  });

  if (cliente?.user) return cliente.user;

  return null;
}

export const authService = {
  async login(document: string, password: string) {
    const user = await findUserForLogin(document);
    if (!user) {
      throw new AppError(401, "CPF/CNPJ ou senha inválidos.");
    }

    const valid = await bcrypt.compare(password, user.senha);
    if (!valid) {
      throw new AppError(401, "CPF/CNPJ ou senha inválidos.");
    }

    return authResponse(user);
  },

  async register(document: string, password: string) {
    const documento = normalizeDocument(document.trim());
    if (documento.length !== 11 && documento.length !== 14) {
      throw new AppError(400, "Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.");
    }

    const existingUser = await prisma.user.findUnique({ where: { documento } });
    if (existingUser) {
      throw new AppError(409, "Já existe uma conta com este CPF/CNPJ.");
    }

    const existingCliente = await prisma.cliente.findUnique({ where: { cpf: documento } });
    if (existingCliente) {
      throw new AppError(409, "Já existe uma conta com este CPF/CNPJ.");
    }

    const senha = await bcrypt.hash(password, 10);
    const email = clienteEmailFromDocument(documento);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          nome: "Cliente",
          email,
          documento,
          senha,
          role: "CLIENTE",
        },
      });

      await tx.cliente.create({
        data: {
          userId: createdUser.id,
          nome: "Cliente",
          email,
          cpf: documento,
        },
      });

      return tx.user.findUniqueOrThrow({
        where: { id: createdUser.id },
        include: { cliente: { select: { id: true, cpf: true } } },
      });
    });

    return authResponse(user);
  },

  async forgotPassword(identifier: string) {
    const trimmed = identifier.trim();
    if (!trimmed) {
      throw new AppError(400, "Informe CPF, CNPJ ou e-mail.");
    }

    const user = await findUserForLogin(trimmed);
    if (!user) {
      return { message: "Se existir uma conta com esses dados, você receberá instruções por e-mail." };
    }

    return { message: "Se existir uma conta com esses dados, você receberá instruções por e-mail." };
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        documento: true,
        cliente: { select: { id: true, cpf: true, nome: true, telefone: true, endereco: true } },
      },
    });

    if (!user) throw new AppError(404, "Usuário não encontrado");

    const document = user.documento ?? user.cliente?.cpf ?? "";

    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      document,
      cliente: user.cliente,
    };
  },

  async getPedidosForUser(userId: string) {
    const cliente = await prisma.cliente.findFirst({
      where: { userId },
    });

    if (!cliente) {
      throw new AppError(404, "Perfil de cliente não encontrado.");
    }

    const pedidos = await prisma.pedido.findMany({
      where: { clienteId: cliente.id },
      include: {
        mecanico: { select: { id: true, nome: true, especialidade: true } },
        avaliacoes: { select: { nota: true, comentario: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return pedidos.map((p) => ({
      id: p.id,
      descricao: p.descricao,
      status: p.status,
      valor: Number(p.valor),
      createdAt: p.createdAt,
      mecanico: p.mecanico,
      avaliacoes: p.avaliacoes,
    }));
  },
};

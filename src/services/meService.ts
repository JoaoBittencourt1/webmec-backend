import prisma from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { SessionUser } from "../lib/auth";
import { UpdateMeInput } from "../types";

function decodeBase64Image(dataUrl: string): Buffer {
  const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
  return Buffer.from(base64, "base64");
}

function encodeBase64Image(buffer: Buffer): string {
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

export const meService = {
  async getProfile(user: SessionUser) {
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        cliente: true,
        mecanico: true,
      },
    });

    if (!fullUser) throw new AppError(404, "Usuário não encontrado");

    const profile = fullUser.cliente ?? fullUser.mecanico;
    const hasFoto = profile ? !!profile.fotoPerfil : false;

    return {
      id: fullUser.id,
      name: fullUser.name,
      email: fullUser.email,
      role: fullUser.role,
      image: fullUser.image,
      profile: profile
        ? {
            id: profile.id,
            nome: profile.nome,
            email: profile.email,
            telefone: profile.telefone,
            ...(fullUser.cliente && {
              cpf: fullUser.cliente.cpf,
              endereco: fullUser.cliente.endereco,
              descricao: fullUser.cliente.descricao,
            }),
            ...(fullUser.mecanico && {
              cnpj: fullUser.mecanico.cnpj,
              endereco: fullUser.mecanico.endereco,
              especialidade: fullUser.mecanico.especialidade,
              descricao: fullUser.mecanico.descricao,
            }),
            hasFoto,
          }
        : null,
    };
  },

  async updateProfile(user: SessionUser, data: UpdateMeInput) {
    if (data.nome) {
      await prisma.user.update({ where: { id: user.id }, data: { name: data.nome } });
    }

    if (user.role === "CLIENTE") {
      const cliente = await prisma.cliente.findUnique({ where: { userId: user.id } });
      if (!cliente) throw new AppError(404, "Perfil de cliente não encontrado");
      return prisma.cliente.update({
        where: { id: cliente.id },
        data: {
          ...(data.nome && { nome: data.nome }),
          ...(data.telefone && { telefone: data.telefone }),
          ...(data.endereco && { endereco: data.endereco }),
          ...(data.descricao !== undefined && { descricao: data.descricao }),
        },
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          cpf: true,
          endereco: true,
          descricao: true,
        },
      });
    }

    if (user.role === "MECANICO") {
      const mecanico = await prisma.mecanico.findUnique({ where: { userId: user.id } });
      if (!mecanico) throw new AppError(404, "Perfil de mecânico não encontrado");
      return prisma.mecanico.update({
        where: { id: mecanico.id },
        data: {
          ...(data.nome && { nome: data.nome }),
          ...(data.telefone && { telefone: data.telefone }),
          ...(data.endereco && { endereco: data.endereco }),
          ...(data.descricao !== undefined && { descricao: data.descricao }),
        },
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          cnpj: true,
          endereco: true,
          especialidade: true,
          descricao: true,
        },
      });
    }

    throw new AppError(400, "Role não suportada para atualização de perfil");
  },

  async updateFoto(user: SessionUser, fotoBase64: string) {
    const buffer = decodeBase64Image(fotoBase64);

    if (user.role === "CLIENTE") {
      const cliente = await prisma.cliente.findUnique({ where: { userId: user.id } });
      if (!cliente) throw new AppError(404, "Perfil de cliente não encontrado");
      await prisma.cliente.update({ where: { id: cliente.id }, data: { fotoPerfil: new Uint8Array(buffer) } });
    } else if (user.role === "MECANICO") {
      const mecanico = await prisma.mecanico.findUnique({ where: { userId: user.id } });
      if (!mecanico) throw new AppError(404, "Perfil de mecânico não encontrado");
      await prisma.mecanico.update({ where: { id: mecanico.id }, data: { fotoPerfil: new Uint8Array(buffer) } });
    } else {
      throw new AppError(400, "Role não suportada para foto de perfil");
    }

    return { ok: true };
  },

  async getFoto(user: SessionUser) {
    let buffer: Buffer | null = null;

    if (user.role === "CLIENTE") {
      const cliente = await prisma.cliente.findUnique({
        where: { userId: user.id },
        select: { fotoPerfil: true },
      });
      buffer = cliente?.fotoPerfil ? Buffer.from(cliente.fotoPerfil) : null;
    } else if (user.role === "MECANICO") {
      const mecanico = await prisma.mecanico.findUnique({
        where: { userId: user.id },
        select: { fotoPerfil: true },
      });
      buffer = mecanico?.fotoPerfil ? Buffer.from(mecanico.fotoPerfil) : null;
    }

    if (!buffer) throw new AppError(404, "Foto não encontrada");
    return { fotoBase64: encodeBase64Image(buffer) };
  },
};

import prisma from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { CreateMecanicoInput, UpdateMecanicoInput } from "../types";
import { SessionUser } from "../lib/auth";

export const mecanicoService = {
  async findAll() {
    return prisma.mecanico.findMany({
      include: { user: { select: { id: true, email: true, role: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  async searchByEndereco(endereco: string, user?: Pick<SessionUser, "id" | "role">) {
    const mecanicos = await prisma.mecanico.findMany({
      where: {
        endereco: { contains: endereco, mode: "insensitive" },
      },
      select: {
        id: true,
        nome: true,
        descricao: true,
        endereco: true,
        especialidade: true,
        telefone: true,
      },
      orderBy: { nome: "asc" },
    });

    if (!user || user.role !== "CLIENTE") {
      return mecanicos.map((m) => ({ ...m, isFavorito: false }));
    }

    const cliente = await prisma.cliente.findUnique({ where: { userId: user.id } });
    if (!cliente) {
      return mecanicos.map((m) => ({ ...m, isFavorito: false }));
    }

    const favoritos = await prisma.favorito.findMany({
      where: { clienteId: cliente.id, mecanicoId: { in: mecanicos.map((m) => m.id) } },
      select: { mecanicoId: true },
    });
    const favoritoIds = new Set(favoritos.map((f) => f.mecanicoId));

    return mecanicos.map((m) => ({ ...m, isFavorito: favoritoIds.has(m.id) }));
  },

  async findById(id: string) {
    const mecanico = await prisma.mecanico.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, role: true } },
        pedidos: true,
        avaliacoes: true,
      },
    });
    if (!mecanico) throw new AppError(404, "Mecânico não encontrado");
    return mecanico;
  },

  async create(data: CreateMecanicoInput) {
    return prisma.mecanico.create({ data });
  },

  async update(id: string, data: UpdateMecanicoInput) {
    await mecanicoService.findById(id);
    return prisma.mecanico.update({ where: { id }, data });
  },

  async remove(id: string) {
    await mecanicoService.findById(id);
    await prisma.mecanico.delete({ where: { id } });
  },
};

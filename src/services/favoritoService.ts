import prisma from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { SessionUser } from "../lib/auth";

export const favoritoService = {
  async list(user: SessionUser) {
    const cliente = await prisma.cliente.findUnique({ where: { userId: user.id } });
    if (!cliente) throw new AppError(404, "Perfil de cliente não encontrado");

    const favoritos = await prisma.favorito.findMany({
      where: { clienteId: cliente.id },
      include: {
        mecanico: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            endereco: true,
            especialidade: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return favoritos.map((f) => ({
      id: f.id,
      mecanico: f.mecanico,
      createdAt: f.createdAt,
    }));
  },

  async add(user: SessionUser, mecanicoId: string) {
    const cliente = await prisma.cliente.findUnique({ where: { userId: user.id } });
    if (!cliente) throw new AppError(404, "Perfil de cliente não encontrado");

    const mecanico = await prisma.mecanico.findUnique({ where: { id: mecanicoId } });
    if (!mecanico) throw new AppError(404, "Mecânico não encontrado");

    const existing = await prisma.favorito.findUnique({
      where: { clienteId_mecanicoId: { clienteId: cliente.id, mecanicoId } },
    });
    if (existing) return existing;

    return prisma.favorito.create({
      data: { clienteId: cliente.id, mecanicoId },
      include: {
        mecanico: { select: { id: true, nome: true, descricao: true, endereco: true } },
      },
    });
  },

  async remove(user: SessionUser, mecanicoId: string) {
    const cliente = await prisma.cliente.findUnique({ where: { userId: user.id } });
    if (!cliente) throw new AppError(404, "Perfil de cliente não encontrado");

    const favorito = await prisma.favorito.findUnique({
      where: { clienteId_mecanicoId: { clienteId: cliente.id, mecanicoId } },
    });
    if (!favorito) throw new AppError(404, "Favorito não encontrado");

    await prisma.favorito.delete({ where: { id: favorito.id } });
  },
};

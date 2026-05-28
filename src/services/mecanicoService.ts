import prisma from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { CreateMecanicoInput, UpdateMecanicoInput } from "../types";

export const mecanicoService = {
  async findAll() {
    return prisma.mecanico.findMany({
      include: { user: { select: { id: true, email: true, role: true } } },
      orderBy: { createdAt: "desc" },
    });
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

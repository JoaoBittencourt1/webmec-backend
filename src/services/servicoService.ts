import prisma from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { CreateServicoInput, UpdateServicoInput } from "../types";

export const servicoService = {
  async findAll() {
    return prisma.servico.findMany({
      orderBy: { nome: "asc" },
    });
  },

  async findById(id: string) {
    const servico = await prisma.servico.findUnique({ where: { id } });
    if (!servico) throw new AppError(404, "Serviço não encontrado");
    return servico;
  },

  async create(data: CreateServicoInput) {
    return prisma.servico.create({ data });
  },

  async update(id: string, data: UpdateServicoInput) {
    await servicoService.findById(id);
    return prisma.servico.update({ where: { id }, data });
  },

  async remove(id: string) {
    await servicoService.findById(id);
    await prisma.servico.delete({ where: { id } });
  },
};

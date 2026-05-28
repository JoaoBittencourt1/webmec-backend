import prisma from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { CreateAvaliacaoInput, UpdateAvaliacaoInput } from "../types";

export const avaliacaoService = {
  async findAll() {
    return prisma.avaliacao.findMany({
      include: {
        pedido: { select: { id: true, descricao: true, status: true } },
        cliente: { select: { id: true, nome: true } },
        mecanico: { select: { id: true, nome: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id: string) {
    const avaliacao = await prisma.avaliacao.findUnique({
      where: { id },
      include: {
        pedido: true,
        cliente: true,
        mecanico: true,
      },
    });
    if (!avaliacao) throw new AppError(404, "Avaliação não encontrada");
    return avaliacao;
  },

  async create(data: CreateAvaliacaoInput) {
    return prisma.avaliacao.create({
      data,
      include: {
        pedido: { select: { id: true, descricao: true } },
        cliente: { select: { id: true, nome: true } },
        mecanico: { select: { id: true, nome: true } },
      },
    });
  },

  async update(id: string, data: UpdateAvaliacaoInput) {
    await avaliacaoService.findById(id);
    return prisma.avaliacao.update({
      where: { id },
      data,
      include: {
        pedido: { select: { id: true, descricao: true } },
        cliente: { select: { id: true, nome: true } },
        mecanico: { select: { id: true, nome: true } },
      },
    });
  },

  async remove(id: string) {
    await avaliacaoService.findById(id);
    await prisma.avaliacao.delete({ where: { id } });
  },
};

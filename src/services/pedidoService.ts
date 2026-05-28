import prisma from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { CreatePedidoInput, UpdatePedidoInput } from "../types";

export const pedidoService = {
  async findAll() {
    return prisma.pedido.findMany({
      include: {
        cliente: { select: { id: true, nome: true, email: true } },
        mecanico: { select: { id: true, nome: true, especialidade: true } },
        avaliacoes: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id: string) {
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        cliente: true,
        mecanico: true,
        avaliacoes: true,
      },
    });
    if (!pedido) throw new AppError(404, "Pedido não encontrado");
    return pedido;
  },

  async create(data: CreatePedidoInput) {
    return prisma.pedido.create({
      data,
      include: {
        cliente: { select: { id: true, nome: true } },
        mecanico: { select: { id: true, nome: true } },
      },
    });
  },

  async update(id: string, data: UpdatePedidoInput) {
    await pedidoService.findById(id);
    return prisma.pedido.update({
      where: { id },
      data,
      include: {
        cliente: { select: { id: true, nome: true } },
        mecanico: { select: { id: true, nome: true } },
      },
    });
  },

  async remove(id: string) {
    await pedidoService.findById(id);
    await prisma.pedido.delete({ where: { id } });
  },
};

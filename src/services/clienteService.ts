import prisma from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { CreateClienteInput, UpdateClienteInput } from "../types";

export const clienteService = {
  async findAll() {
    return prisma.cliente.findMany({
      include: { user: { select: { id: true, email: true, role: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id: string) {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, role: true } },
        pedidos: true,
        avaliacoes: true,
      },
    });
    if (!cliente) throw new AppError(404, "Cliente não encontrado");
    return cliente;
  },

  async create(data: CreateClienteInput) {
    return prisma.cliente.create({ data });
  },

  async update(id: string, data: UpdateClienteInput) {
    await clienteService.findById(id);
    return prisma.cliente.update({ where: { id }, data });
  },

  async remove(id: string) {
    await clienteService.findById(id);
    await prisma.cliente.delete({ where: { id } });
  },
};

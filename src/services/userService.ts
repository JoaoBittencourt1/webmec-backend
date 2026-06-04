import prisma from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { CreateUserInput, UpdateUserInput } from "../types";

export const userService = {
  async findAll() {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });
    if (!user) throw new AppError(404, "Usuário não encontrado");
    return user;
  },

  async create(data: CreateUserInput) {
    return prisma.user.create({
      data,
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });
  },

  async update(id: string, data: UpdateUserInput) {
    await userService.findById(id);
    return prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });
  },

  async remove(id: string) {
    await userService.findById(id);
    await prisma.user.delete({ where: { id } });
  },
};

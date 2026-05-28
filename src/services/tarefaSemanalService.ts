import prisma from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { CreateTarefaSemanalInput, UpdateTarefaSemanalInput } from "../types";

export const tarefaSemanalService = {
  async findAll() {
    return prisma.tarefaSemanal.findMany({
      include: {
        mecanico: { select: { id: true, nome: true, especialidade: true } },
      },
      orderBy: [{ diaSemana: "asc" }, { prioridade: "desc" }],
    });
  },

  async findById(id: string) {
    const tarefa = await prisma.tarefaSemanal.findUnique({
      where: { id },
      include: { mecanico: true },
    });
    if (!tarefa) throw new AppError(404, "Tarefa semanal não encontrada");
    return tarefa;
  },

  async create(data: CreateTarefaSemanalInput) {
    return prisma.tarefaSemanal.create({
      data,
      include: {
        mecanico: { select: { id: true, nome: true } },
      },
    });
  },

  async update(id: string, data: UpdateTarefaSemanalInput) {
    await tarefaSemanalService.findById(id);
    return prisma.tarefaSemanal.update({
      where: { id },
      data,
      include: {
        mecanico: { select: { id: true, nome: true } },
      },
    });
  },

  async remove(id: string) {
    await tarefaSemanalService.findById(id);
    await prisma.tarefaSemanal.delete({ where: { id } });
  },
};

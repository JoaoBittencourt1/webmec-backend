import prisma from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { SessionUser } from "../lib/auth";
import { CreateAgendamentoInput, UpdateAgendamentoInput } from "../types";

async function getMecanicoId(user: SessionUser): Promise<string> {
  const mecanico = await prisma.mecanico.findUnique({ where: { userId: user.id } });
  if (!mecanico) throw new AppError(404, "Perfil de mecânico não encontrado");
  return mecanico.id;
}

export const agendamentoService = {
  async list(user: SessionUser) {
    const mecanicoId = await getMecanicoId(user);
    return prisma.agendamento.findMany({
      where: { mecanicoId },
      orderBy: { dataInicio: "asc" },
    });
  },

  async create(user: SessionUser, data: CreateAgendamentoInput) {
    const mecanicoId = await getMecanicoId(user);
    return prisma.agendamento.create({
      data: {
        mecanicoId,
        titulo: data.titulo,
        descricao: data.descricao,
        dataInicio: new Date(data.dataInicio),
        dataFim: new Date(data.dataFim),
      },
    });
  },

  async update(user: SessionUser, id: string, data: UpdateAgendamentoInput) {
    const mecanicoId = await getMecanicoId(user);
    const agendamento = await prisma.agendamento.findFirst({ where: { id, mecanicoId } });
    if (!agendamento) throw new AppError(404, "Agendamento não encontrado");

    return prisma.agendamento.update({
      where: { id },
      data: {
        ...(data.titulo && { titulo: data.titulo }),
        ...(data.descricao !== undefined && { descricao: data.descricao }),
        ...(data.dataInicio && { dataInicio: new Date(data.dataInicio) }),
        ...(data.dataFim && { dataFim: new Date(data.dataFim) }),
      },
    });
  },

  async remove(user: SessionUser, id: string) {
    const mecanicoId = await getMecanicoId(user);
    const agendamento = await prisma.agendamento.findFirst({ where: { id, mecanicoId } });
    if (!agendamento) throw new AppError(404, "Agendamento não encontrado");
    await prisma.agendamento.delete({ where: { id } });
  },
};

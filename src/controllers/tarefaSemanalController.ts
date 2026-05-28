import { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { tarefaSemanalService } from "../services/tarefaSemanalService";
import { createTarefaSemanalSchema, updateTarefaSemanalSchema, idParamSchema } from "../schemas";

export const tarefaSemanalController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const tarefas = await tarefaSemanalService.findAll();
    res.json(tarefas);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const tarefa = await tarefaSemanalService.findById(id);
    res.json(tarefa);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = createTarefaSemanalSchema.parse(req.body);
    const tarefa = await tarefaSemanalService.create(data);
    res.status(201).json(tarefa);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = updateTarefaSemanalSchema.parse(req.body);
    const tarefa = await tarefaSemanalService.update(id, data);
    res.json(tarefa);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    await tarefaSemanalService.remove(id);
    res.status(204).send();
  }),
};

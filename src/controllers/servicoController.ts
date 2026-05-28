import { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { servicoService } from "../services/servicoService";
import { createServicoSchema, updateServicoSchema, idParamSchema } from "../schemas";

export const servicoController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const servicos = await servicoService.findAll();
    res.json(servicos);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const servico = await servicoService.findById(id);
    res.json(servico);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = createServicoSchema.parse(req.body);
    const servico = await servicoService.create(data);
    res.status(201).json(servico);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = updateServicoSchema.parse(req.body);
    const servico = await servicoService.update(id, data);
    res.json(servico);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    await servicoService.remove(id);
    res.status(204).send();
  }),
};

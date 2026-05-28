import { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { avaliacaoService } from "../services/avaliacaoService";
import { createAvaliacaoSchema, updateAvaliacaoSchema, idParamSchema } from "../schemas";

export const avaliacaoController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const avaliacoes = await avaliacaoService.findAll();
    res.json(avaliacoes);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const avaliacao = await avaliacaoService.findById(id);
    res.json(avaliacao);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = createAvaliacaoSchema.parse(req.body);
    const avaliacao = await avaliacaoService.create(data);
    res.status(201).json(avaliacao);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = updateAvaliacaoSchema.parse(req.body);
    const avaliacao = await avaliacaoService.update(id, data);
    res.json(avaliacao);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    await avaliacaoService.remove(id);
    res.status(204).send();
  }),
};

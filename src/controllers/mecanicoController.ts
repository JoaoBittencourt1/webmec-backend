import { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { mecanicoService } from "../services/mecanicoService";
import { createMecanicoSchema, updateMecanicoSchema, idParamSchema, searchMecanicosQuerySchema } from "../schemas";

export const mecanicoController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    if (req.query.endereco) {
      const { endereco } = searchMecanicosQuerySchema.parse({ endereco: req.query.endereco });
      const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
      const user = session?.user as { id: string; role: string } | undefined;
      const mecanicos = await mecanicoService.searchByEndereco(endereco, user);
      res.json(mecanicos);
      return;
    }

    const mecanicos = await mecanicoService.findAll();
    res.json(mecanicos);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const mecanico = await mecanicoService.findById(id);
    res.json(mecanico);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = createMecanicoSchema.parse(req.body);
    const mecanico = await mecanicoService.create(data);
    res.status(201).json(mecanico);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = updateMecanicoSchema.parse(req.body);
    const mecanico = await mecanicoService.update(id, data);
    res.json(mecanico);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    await mecanicoService.remove(id);
    res.status(204).send();
  }),
};

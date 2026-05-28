import { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { clienteService } from "../services/clienteService";
import { createClienteSchema, updateClienteSchema, idParamSchema } from "../schemas";

export const clienteController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const clientes = await clienteService.findAll();
    res.json(clientes);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const cliente = await clienteService.findById(id);
    res.json(cliente);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = createClienteSchema.parse(req.body);
    const cliente = await clienteService.create(data);
    res.status(201).json(cliente);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = updateClienteSchema.parse(req.body);
    const cliente = await clienteService.update(id, data);
    res.json(cliente);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    await clienteService.remove(id);
    res.status(204).send();
  }),
};

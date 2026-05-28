import { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { pedidoService } from "../services/pedidoService";
import { createPedidoSchema, updatePedidoSchema, idParamSchema } from "../schemas";

export const pedidoController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const pedidos = await pedidoService.findAll();
    res.json(pedidos);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const pedido = await pedidoService.findById(id);
    res.json(pedido);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = createPedidoSchema.parse(req.body);
    const pedido = await pedidoService.create(data);
    res.status(201).json(pedido);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = updatePedidoSchema.parse(req.body);
    const pedido = await pedidoService.update(id, data);
    res.json(pedido);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    await pedidoService.remove(id);
    res.status(204).send();
  }),
};

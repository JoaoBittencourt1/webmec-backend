import { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { userService } from "../services/userService";
import { createUserSchema, updateUserSchema, idParamSchema } from "../schemas";

export const userController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const users = await userService.findAll();
    res.json(users);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const user = await userService.findById(id);
    res.json(user);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = createUserSchema.parse(req.body);
    const user = await userService.create(data);
    res.status(201).json(user);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = updateUserSchema.parse(req.body);
    const user = await userService.update(id, data);
    res.json(user);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    await userService.remove(id);
    res.status(204).send();
  }),
};

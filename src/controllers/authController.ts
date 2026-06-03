import { Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/authMiddleware";
import { authService } from "../services/authService";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
} from "../schemas";

export const authController = {
  login: asyncHandler(async (req, res: Response) => {
    const { document, password } = loginSchema.parse(req.body);
    const result = await authService.login(document, password);
    res.json(result);
  }),

  register: asyncHandler(async (req, res: Response) => {
    const { document, password } = registerSchema.parse(req.body);
    const result = await authService.register(document, password);
    res.status(201).json(result);
  }),

  forgotPassword: asyncHandler(async (req, res: Response) => {
    const { identifier } = forgotPasswordSchema.parse(req.body);
    const result = await authService.forgotPassword(identifier);
    res.json(result);
  }),

  me: asyncHandler(async (req: AuthRequest, res: Response) => {
    const profile = await authService.me(req.userId!);
    res.json(profile);
  }),

  myPedidos: asyncHandler(async (req: AuthRequest, res: Response) => {
    const pedidos = await authService.getPedidosForUser(req.userId!);
    res.json(pedidos);
  }),
};

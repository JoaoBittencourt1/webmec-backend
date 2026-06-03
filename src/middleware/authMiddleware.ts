import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";
import { AppError } from "./errorHandler";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
  userDocument?: string;
}

export function authMiddleware(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new AppError(401, "Token de autenticação ausente."));
  }

  try {
    const token = header.slice(7);
    const payload = verifyToken(token);
    req.userId = payload.sub;
    req.userRole = payload.role;
    req.userDocument = payload.document;
    next();
  } catch {
    next(new AppError(401, "Token inválido ou expirado."));
  }
}

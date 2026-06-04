import { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import prisma from "../lib/prisma";
import { asyncHandler } from "../middleware/errorHandler";
import { AppError } from "../middleware/errorHandler";
import { registerSchema } from "../schemas";

export const registerController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const data = registerSchema.parse(req.body);

    const signUpResult = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.nome,
        role: data.role,
      },
      headers: fromNodeHeaders(req.headers),
      returnHeaders: true,
    });

    const user = signUpResult.response?.user ?? (signUpResult as { user?: { id: string } }).user;
    if (!user?.id) {
      throw new AppError(400, "Não foi possível criar a conta");
    }

    if (data.role === "CLIENTE") {
      await prisma.cliente.create({
        data: {
          userId: user.id,
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
          cpf: data.cpf,
          endereco: data.endereco,
        },
      });
    } else {
      await prisma.mecanico.create({
        data: {
          userId: user.id,
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
          cnpj: data.cnpj,
          endereco: data.endereco,
          descricao: data.descricao,
          especialidade: data.especialidade ?? "Geral",
        },
      });
    }

    if ("headers" in signUpResult && signUpResult.headers) {
      signUpResult.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
    }

    res.status(201).json(signUpResult.response ?? signUpResult);
  }),
};

import { z } from "zod";

export const createUserSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  senha: z.string().min(6),
  role: z.enum(["ADMIN", "CLIENTE", "MECANICO"]).optional(),
});

export const updateUserSchema = createUserSchema.partial().omit({ senha: true }).extend({
  senha: z.string().min(6).optional(),
});

export const createClienteSchema = z.object({
  userId: z.string().uuid().optional(),
  nome: z.string().min(2),
  email: z.string().email(),
  telefone: z.string().min(8).optional(),
  cpf: z.string().min(11),
  endereco: z.string().min(5).optional(),
});

export const updateClienteSchema = createClienteSchema.partial();

export const createMecanicoSchema = z.object({
  userId: z.string().uuid().optional(),
  nome: z.string().min(2),
  email: z.string().email(),
  telefone: z.string().min(8),
  especialidade: z.string().min(2),
});

export const updateMecanicoSchema = createMecanicoSchema.partial();

export const createPedidoSchema = z.object({
  clienteId: z.string().uuid(),
  mecanicoId: z.string().uuid(),
  descricao: z.string().min(5),
  status: z.enum(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDO", "CANCELADO"]).optional(),
  valor: z.number().positive(),
});

export const updatePedidoSchema = createPedidoSchema.partial();

export const createAvaliacaoSchema = z.object({
  pedidoId: z.string().uuid(),
  clienteId: z.string().uuid(),
  mecanicoId: z.string().uuid(),
  nota: z.number().int().min(1).max(5),
  comentario: z.string().optional(),
});

export const updateAvaliacaoSchema = createAvaliacaoSchema.partial();

export const idParamSchema = z.object({
  id: z.string().uuid(),
});

export const loginSchema = z.object({
  document: z.string().min(1),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  document: z.string().min(1),
  password: z.string().min(6),
});

export const forgotPasswordSchema = z.object({
  identifier: z.string().min(1),
});

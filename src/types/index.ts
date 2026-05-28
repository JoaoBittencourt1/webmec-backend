import { z } from "zod";
import {
  createUserSchema,
  updateUserSchema,
  createClienteSchema,
  updateClienteSchema,
  createMecanicoSchema,
  updateMecanicoSchema,
  createPedidoSchema,
  updatePedidoSchema,
  createAvaliacaoSchema,
  updateAvaliacaoSchema,
  createServicoSchema,
  updateServicoSchema,
  createTarefaSemanalSchema,
  updateTarefaSemanalSchema,
} from "../schemas";

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateClienteInput = z.infer<typeof createClienteSchema>;
export type UpdateClienteInput = z.infer<typeof updateClienteSchema>;
export type CreateMecanicoInput = z.infer<typeof createMecanicoSchema>;
export type UpdateMecanicoInput = z.infer<typeof updateMecanicoSchema>;
export type CreatePedidoInput = z.infer<typeof createPedidoSchema>;
export type UpdatePedidoInput = z.infer<typeof updatePedidoSchema>;
export type CreateAvaliacaoInput = z.infer<typeof createAvaliacaoSchema>;
export type UpdateAvaliacaoInput = z.infer<typeof updateAvaliacaoSchema>;
export type CreateServicoInput = z.infer<typeof createServicoSchema>;
export type UpdateServicoInput = z.infer<typeof updateServicoSchema>;
export type CreateTarefaSemanalInput = z.infer<typeof createTarefaSemanalSchema>;
export type UpdateTarefaSemanalInput = z.infer<typeof updateTarefaSemanalSchema>;

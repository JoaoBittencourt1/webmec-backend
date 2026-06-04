import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["ADMIN", "CLIENTE", "MECANICO"]).optional(),
});

export const updateUserSchema = createUserSchema.partial();

export const createClienteSchema = z.object({
  userId: z.string().uuid().optional(),
  nome: z.string().min(2),
  email: z.string().email(),
  telefone: z.string().min(8),
  cpf: z.string().min(11),
  endereco: z.string().min(5),
  descricao: z.string().optional(),
});

export const updateClienteSchema = createClienteSchema.partial();

export const createMecanicoSchema = z.object({
  userId: z.string().uuid().optional(),
  nome: z.string().min(2),
  email: z.string().email(),
  telefone: z.string().min(8),
  cnpj: z.string().min(14),
  endereco: z.string().min(5),
  especialidade: z.string().min(2),
  descricao: z.string().optional(),
});

export const updateMecanicoSchema = createMecanicoSchema.partial();

export const registerSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("CLIENTE"),
    nome: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    cpf: z.string().min(11),
    telefone: z.string().min(8),
    endereco: z.string().min(5),
  }),
  z.object({
    role: z.literal("MECANICO"),
    nome: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    cnpj: z.string().min(14),
    telefone: z.string().min(8),
    endereco: z.string().min(5),
    descricao: z.string().min(2),
    especialidade: z.string().min(2).optional(),
  }),
]);

export const updateMeSchema = z.object({
  nome: z.string().min(2).optional(),
  descricao: z.string().optional(),
  endereco: z.string().min(5).optional(),
  telefone: z.string().min(8).optional(),
});

export const fotoPerfilSchema = z.object({
  fotoBase64: z
    .string()
    .min(1)
    .max(3_000_000)
    .refine((v) => v.startsWith("data:image/"), "Formato de imagem inválido"),
});

export const searchMecanicosQuerySchema = z.object({
  endereco: z.string().min(1),
});

export const createAgendamentoSchema = z.object({
  titulo: z.string().min(2),
  descricao: z.string().optional(),
  dataInicio: z.string().datetime(),
  dataFim: z.string().datetime(),
});

export const updateAgendamentoSchema = createAgendamentoSchema.partial();

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

export const createServicoSchema = z.object({
  nome: z.string().min(2),
  descricao: z.string().min(5),
  preco: z.number().positive(),
  duracaoMinutos: z.number().int().positive(),
  ativo: z.boolean().optional(),
});

export const updateServicoSchema = createServicoSchema.partial();

export const createTarefaSemanalSchema = z.object({
  titulo: z.string().min(2),
  descricao: z.string().min(5),
  diaSemana: z.enum(["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO", "DOMINGO"]),
  mecanicoId: z.string().uuid(),
  concluida: z.boolean().optional(),
  prioridade: z.enum(["BAIXA", "MEDIA", "ALTA"]).optional(),
});

export const updateTarefaSemanalSchema = createTarefaSemanalSchema.partial();

export const idParamSchema = z.object({
  id: z.string().uuid(),
});

export const mecanicoIdParamSchema = z.object({
  mecanicoId: z.string().uuid(),
});

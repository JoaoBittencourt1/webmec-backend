import { Request, Response } from "express";
import { meService } from "../services/meService";
import { favoritoService } from "../services/favoritoService";
import { agendamentoService } from "../services/agendamentoService";
import { asyncHandler } from "../middleware/errorHandler";
import {
  updateMeSchema,
  fotoPerfilSchema,
  createAgendamentoSchema,
  updateAgendamentoSchema,
  idParamSchema,
  mecanicoIdParamSchema,
} from "../schemas";

export const meController = {
  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const profile = await meService.getProfile(req.user!);
    res.json(profile);
  }),

  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const data = updateMeSchema.parse(req.body);
    const profile = await meService.updateProfile(req.user!, data);
    res.json(profile);
  }),

  updateFoto: asyncHandler(async (req: Request, res: Response) => {
    const { fotoBase64 } = fotoPerfilSchema.parse(req.body);
    const result = await meService.updateFoto(req.user!, fotoBase64);
    res.json(result);
  }),

  getFoto: asyncHandler(async (req: Request, res: Response) => {
    const foto = await meService.getFoto(req.user!);
    res.json(foto);
  }),

  listFavoritos: asyncHandler(async (req: Request, res: Response) => {
    const favoritos = await favoritoService.list(req.user!);
    res.json(favoritos);
  }),

  addFavorito: asyncHandler(async (req: Request, res: Response) => {
    const { mecanicoId } = mecanicoIdParamSchema.parse(req.params);
    const favorito = await favoritoService.add(req.user!, mecanicoId);
    res.status(201).json(favorito);
  }),

  removeFavorito: asyncHandler(async (req: Request, res: Response) => {
    const { mecanicoId } = mecanicoIdParamSchema.parse(req.params);
    await favoritoService.remove(req.user!, mecanicoId);
    res.status(204).send();
  }),

  listAgendamentos: asyncHandler(async (req: Request, res: Response) => {
    const agendamentos = await agendamentoService.list(req.user!);
    res.json(agendamentos);
  }),

  createAgendamento: asyncHandler(async (req: Request, res: Response) => {
    const data = createAgendamentoSchema.parse(req.body);
    const agendamento = await agendamentoService.create(req.user!, data);
    res.status(201).json(agendamento);
  }),

  updateAgendamento: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    const data = updateAgendamentoSchema.parse(req.body);
    const agendamento = await agendamentoService.update(req.user!, id, data);
    res.json(agendamento);
  }),

  removeAgendamento: asyncHandler(async (req: Request, res: Response) => {
    const { id } = idParamSchema.parse(req.params);
    await agendamentoService.remove(req.user!, id);
    res.status(204).send();
  }),
};

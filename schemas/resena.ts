import { z } from "zod";
import { uuidSchema } from "./_shared";

export const createResenaSchema = z.object({
  idusuario: uuidSchema,
  idcurso: uuidSchema,
  calificacion: z.number().int().min(1).max(5),
  comentario: z.string().max(2_000).optional(),
  aprobado: z.boolean().optional(),
});

export const updateResenaSchema = z.object({
  calificacion: z.number().int().min(1).max(5).optional(),
  comentario: z.string().max(2_000).optional(),
  aprobado: z.boolean().optional(),
});

export type CreateResenaInput = z.infer<typeof createResenaSchema>;
export type UpdateResenaInput = z.infer<typeof updateResenaSchema>;

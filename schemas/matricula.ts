import { z } from "zod";
import { uuidSchema, isoDateSchema, monedaSchema } from "./_shared";

const ESTADOS_MATRICULA = [
  "activa",
  "completada",
  "cancelada",
  "expirada",
] as const;

export const createMatriculaSchema = z.object({
  idusuario: uuidSchema,
  idcurso: uuidSchema,
  precioPagadoCentavos: z.number().int().nonnegative().optional(),
  moneda: monedaSchema.optional(),
  progreso: z.number().min(0).max(100).optional(),
  completado: z.boolean().optional(),
  fechaCompletado: isoDateSchema.optional(),
  certificadoUrl: z.string().url().max(2_000).optional(),
  estado: z.enum(ESTADOS_MATRICULA).optional(),
});

export const updateMatriculaSchema = z.object({
  precioPagadoCentavos: z.number().int().nonnegative().optional(),
  moneda: monedaSchema.optional(),
  progreso: z.number().min(0).max(100).optional(),
  completado: z.boolean().optional(),
  fechaCompletado: isoDateSchema.optional(),
  certificadoUrl: z.string().url().max(2_000).optional(),
  estado: z.enum(ESTADOS_MATRICULA).optional(),
});

export type CreateMatriculaInput = z.infer<typeof createMatriculaSchema>;
export type UpdateMatriculaInput = z.infer<typeof updateMatriculaSchema>;

import { z } from "zod";
import { slugSchema, uuidSchema } from "./_shared";

const TIPOS_LECCION = ["video", "texto", "quiz", "proyecto"] as const;

export const createLeccionSchema = z.object({
  idcurso: uuidSchema,
  titulo: z.string().max(200).optional(),
  descripcion: z.string().max(2_000).optional(),
  slug: slugSchema.optional(),
  orden: z.number().int().nonnegative().optional(),
  duracionSegundos: z.number().int().nonnegative().optional(),
  videoUrl: z.string().url().max(2_000).optional(),
  contenidoMarkdown: z.string().max(100_000).optional(),
  tipo: z.enum(TIPOS_LECCION).optional(),
  publicado: z.boolean().optional(),
  esPreview: z.boolean().optional(),
});

export const updateLeccionSchema = z.object({
  titulo: z.string().max(200).optional(),
  descripcion: z.string().max(2_000).optional(),
  slug: slugSchema.optional(),
  orden: z.number().int().nonnegative().optional(),
  duracionSegundos: z.number().int().nonnegative().optional(),
  videoUrl: z.string().url().max(2_000).optional(),
  contenidoMarkdown: z.string().max(100_000).optional(),
  tipo: z.enum(TIPOS_LECCION).optional(),
  publicado: z.boolean().optional(),
  esPreview: z.boolean().optional(),
});

export type CreateLeccionInput = z.infer<typeof createLeccionSchema>;
export type UpdateLeccionInput = z.infer<typeof updateLeccionSchema>;

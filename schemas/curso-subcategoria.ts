import { z } from "zod";
import { slugSchema, uuidSchema } from "./_shared";

export const createCursoSubcategoriaSchema = z.object({
  nombre: z.string().max(120).optional(),
  slug: slugSchema.optional(),
  descripcion: z.string().max(500).optional(),
  cursoCategoriaId: uuidSchema,
  orden: z.number().int().nonnegative().optional(),
});

export const updateCursoSubcategoriaSchema = z.object({
  nombre: z.string().max(120).optional(),
  slug: slugSchema.optional(),
  descripcion: z.string().max(500).optional(),
  orden: z.number().int().nonnegative().optional(),
});

export type CreateCursoSubcategoriaInput = z.infer<typeof createCursoSubcategoriaSchema>;
export type UpdateCursoSubcategoriaInput = z.infer<typeof updateCursoSubcategoriaSchema>;

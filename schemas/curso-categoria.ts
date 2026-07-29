import { z } from "zod";
import { slugSchema } from "./_shared";

export const createCursoCategoriaSchema = z.object({
  nombre: z.string().max(120).optional(),
  slug: slugSchema.optional(),
  descripcion: z.string().max(500).optional(),
  iconoUrl: z.string().url().max(2_000).optional(),
  orden: z.number().int().nonnegative().optional(),
});

export const updateCursoCategoriaSchema = createCursoCategoriaSchema.partial();

export type CreateCursoCategoriaInput = z.infer<typeof createCursoCategoriaSchema>;
export type UpdateCursoCategoriaInput = z.infer<typeof updateCursoCategoriaSchema>;

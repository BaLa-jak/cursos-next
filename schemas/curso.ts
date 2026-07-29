import { z } from "zod";
import { slugSchema, uuidSchema, monedaSchema } from "./_shared";

export const NIVELES = ["principiante", "intermedio", "avanzado"] as const;

const idiomaSchema = z
  .string()
  .regex(/^[a-z]{2,3}(-[A-Z]{2})?$/, "código BCP-47 (es, es-MX, en…)");

export const createCursoSchema = z.object({
  slug: slugSchema.optional(),
  titulo: z.string().max(200).optional(),
  descripcion: z.string().max(10_000).optional(),
  descripcionCorta: z.string().max(280).optional(),
  imagenPortadaUrl: z.string().url().max(2_000).optional(),
  precioCentavos: z.number().int().nonnegative().optional(),
  precioActualCentavos: z.number().int().nonnegative().optional(),
  moneda: monedaSchema.optional(),
  publicado: z.boolean().optional(),
  calificacion: z.number().min(0).max(5).optional(),
  numeroResenas: z.number().int().nonnegative().optional(),
  numeroEstudiantes: z.number().int().nonnegative().optional(),
  duracionMinutos: z.number().int().nonnegative().optional(),
  nivel: z.enum(NIVELES).optional(),
  idioma: idiomaSchema.optional(),
  maestroId: uuidSchema.optional(),
  cursoSubcategoriaId: uuidSchema.optional(),
});

export const updateCursoSchema = createCursoSchema.partial();

export type CreateCursoInput = z.infer<typeof createCursoSchema>;
export type UpdateCursoInput = z.infer<typeof updateCursoSchema>;

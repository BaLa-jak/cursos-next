import { z } from "zod";
import { emailSchema, isoDateSchema } from "./_shared";

export const createMaestroSchema = z.object({
  nombre: z.string().max(120).optional(),
  apellido: z.string().max(120).optional(),
  email: emailSchema.optional(),
  emailVerificado: z.boolean().optional(),
  passwordHash: z.string().max(255).optional(),
  proveedorOAuth: z.string().max(40).optional(),
  proveedorOAuthId: z.string().max(255).optional(),
  avatarUrl: z.string().url().max(2_000).optional(),
  biografia: z.string().max(2_000).optional(),
  especialidad: z.string().max(200).optional(),
  verificado: z.boolean().optional(),
  estado: z.enum(["activo", "pendiente", "suspendido"]).optional(),
  ultimoLogin: isoDateSchema.optional(),
});

export const updateMaestroSchema = createMaestroSchema.partial();

export type CreateMaestroInput = z.infer<typeof createMaestroSchema>;
export type UpdateMaestroInput = z.infer<typeof updateMaestroSchema>;

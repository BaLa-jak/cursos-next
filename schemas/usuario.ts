import { z } from "zod";
import { emailSchema, uuidSchema, isoDateSchema } from "./_shared";

export const createUsuarioSchema = z.object({
  nombre: z.string().max(120).optional(),
  apellido: z.string().max(120).optional(),
  email: emailSchema.optional(),
  emailVerificado: z.boolean().optional(),
  passwordHash: z.string().max(255).optional(),
  proveedorOAuth: z.string().max(40).optional(),
  proveedorOAuthId: z.string().max(255).optional(),
  avatarUrl: z.string().url().max(2_000).optional(),
  biografia: z.string().max(2_000).optional(),
  metodoPagoDefaultId: uuidSchema.optional(),
  ultimoLogin: isoDateSchema.optional(),
});

export const updateUsuarioSchema = createUsuarioSchema.partial();

export type CreateUsuarioInput = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioInput = z.infer<typeof updateUsuarioSchema>;

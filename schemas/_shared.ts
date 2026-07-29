import { z } from "zod";

export const emailSchema = z
  .string()
  .email("no parece un email válido")
  .max(320);

export const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9-]+$/, "solo minúsculas, dígitos y guiones");

export const uuidSchema = z.string().uuid();

export const isoDateSchema = z.string().datetime({ offset: true });

export const MONEDAS = ["MXN", "USD", "EUR"] as const;
export const monedaSchema = z.enum(MONEDAS);

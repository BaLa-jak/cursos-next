import { z } from "zod";
import { uuidSchema } from "./_shared";

const TIPOS_METODO_PAGO = ["tarjeta", "paypal", "transferencia"] as const;
const PASARELAS = ["stripe", "paypal", "mercadopago", "manual"] as const;
const MARCAS_TARJETA = [
  "visa",
  "mastercard",
  "amex",
  "carnet",
  "oxxo",
] as const;

const mesSchema = z
  .number()
  .int()
  .min(1, "mes entre 1 y 12")
  .max(12, "mes entre 1 y 12");

const anioSchema = z
  .number()
  .int()
  .min(2_000, "año de expiración no es realista");

export const createMetodoPagoSchema = z.object({
  idusuario: uuidSchema,
  tipo: z.enum(TIPOS_METODO_PAGO),
  pasarela: z.enum(PASARELAS),
  pasarelaMetodoId: z.string().min(1).max(255),
  ultimos4: z.string().regex(/^\d{4}$/, "4 dígitos").optional(),
  marca: z.enum(MARCAS_TARJETA).optional(),
  expiraMes: mesSchema.optional(),
  expiraAnio: anioSchema.optional(),
  alias: z.string().max(80).optional(),
  esDefault: z.boolean().optional(),
});

export const updateMetodoPagoSchema = z.object({
  alias: z.string().max(80).optional(),
  esDefault: z.boolean().optional(),
  expiraMes: mesSchema.optional(),
  expiraAnio: anioSchema.optional(),
});

export type CreateMetodoPagoInput = z.infer<typeof createMetodoPagoSchema>;
export type UpdateMetodoPagoInput = z.infer<typeof updateMetodoPagoSchema>;

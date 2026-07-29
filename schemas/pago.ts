import { z } from "zod";
import { uuidSchema, monedaSchema } from "./_shared";

const ESTADOS_PAGO = ["pendiente", "completado", "fallido", "reembolsado"] as const;
const TIPOS_PAGO = ["tarjeta", "paypal", "transferencia", "oxxo"] as const;
const PASARELAS = ["stripe", "paypal", "mercadopago", "manual"] as const;

export const createPagoSchema = z.object({
  idusuario: uuidSchema,
  idcurso: uuidSchema,
  idmatricula: uuidSchema.optional(),
  montoCentavos: z.number().int().nonnegative(),
  moneda: monedaSchema.optional(),
  estado: z.enum(ESTADOS_PAGO).optional(),
  pasarela: z.enum(PASARELAS),
  pasarelaPagoId: z.string().max(255).optional(),
  tipo: z.enum(TIPOS_PAGO),
});

export const updatePagoSchema = z.object({
  estado: z.enum(ESTADOS_PAGO).optional(),
  pasarelaPagoId: z.string().max(255).optional(),
  idmatricula: uuidSchema.optional(),
});

export type CreatePagoInput = z.infer<typeof createPagoSchema>;
export type UpdatePagoInput = z.infer<typeof updatePagoSchema>;

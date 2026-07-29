import { crudEndpoints } from "@/lib/api/crud";
import { pago } from "@/db/schema";
import { createPagoSchema, updatePagoSchema } from "@/schemas/pago";

export const { GET, POST } = crudEndpoints({
  table: pago,
  resourceName: "Pago",
  createSchema: createPagoSchema,
  updateSchema: updatePagoSchema,
});

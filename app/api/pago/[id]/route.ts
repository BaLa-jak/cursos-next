import { crudItemEndpoints } from "@/lib/api/crud";
import { pago } from "@/db/schema";
import { createPagoSchema, updatePagoSchema } from "@/schemas/pago";

export const { GET, PATCH, DELETE } = crudItemEndpoints({
  table: pago,
  resourceName: "Pago",
  createSchema: createPagoSchema,
  updateSchema: updatePagoSchema,
});

import { crudEndpoints } from "@/lib/api/crud";
import { metodoPago } from "@/db/schema";
import {
  createMetodoPagoSchema,
  updateMetodoPagoSchema,
} from "@/schemas/metodo-pago";

export const { GET, POST } = crudEndpoints({
  table: metodoPago,
  resourceName: "MetodoPago",
  createSchema: createMetodoPagoSchema,
  updateSchema: updateMetodoPagoSchema,
});

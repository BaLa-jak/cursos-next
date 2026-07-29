import { crudEndpoints } from "@/lib/api/crud";
import { maestro } from "@/db/schema";
import {
  createMaestroSchema,
  updateMaestroSchema,
} from "@/schemas/maestro";

export const { GET, POST } = crudEndpoints({
  table: maestro,
  resourceName: "Maestro",
  createSchema: createMaestroSchema,
  updateSchema: updateMaestroSchema,
});

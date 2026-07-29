import { crudItemEndpoints } from "@/lib/api/crud";
import { maestro } from "@/db/schema";
import {
  createMaestroSchema,
  updateMaestroSchema,
} from "@/schemas/maestro";

export const { GET, PATCH, DELETE } = crudItemEndpoints({
  table: maestro,
  resourceName: "Maestro",
  createSchema: createMaestroSchema,
  updateSchema: updateMaestroSchema,
});

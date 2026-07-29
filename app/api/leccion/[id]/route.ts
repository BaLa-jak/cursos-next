import { crudItemEndpoints } from "@/lib/api/crud";
import { leccion } from "@/db/schema";
import { createLeccionSchema, updateLeccionSchema } from "@/schemas/leccion";

export const { GET, PATCH, DELETE } = crudItemEndpoints({
  table: leccion,
  resourceName: "Leccion",
  createSchema: createLeccionSchema,
  updateSchema: updateLeccionSchema,
});

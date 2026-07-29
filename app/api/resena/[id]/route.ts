import { crudItemEndpoints } from "@/lib/api/crud";
import { resena } from "@/db/schema";
import { createResenaSchema, updateResenaSchema } from "@/schemas/resena";

export const { GET, PATCH, DELETE } = crudItemEndpoints({
  table: resena,
  resourceName: "Resena",
  createSchema: createResenaSchema,
  updateSchema: updateResenaSchema,
});

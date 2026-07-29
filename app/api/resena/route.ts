import { crudEndpoints } from "@/lib/api/crud";
import { resena } from "@/db/schema";
import { createResenaSchema, updateResenaSchema } from "@/schemas/resena";

export const { GET, POST } = crudEndpoints({
  table: resena,
  resourceName: "Resena",
  createSchema: createResenaSchema,
  updateSchema: updateResenaSchema,
});

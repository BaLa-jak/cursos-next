import { crudItemEndpoints } from "@/lib/api/crud";
import { curso } from "@/db/schema";
import { createCursoSchema, updateCursoSchema } from "@/schemas/curso";

export const { GET, PATCH, DELETE } = crudItemEndpoints({
  table: curso,
  resourceName: "Curso",
  createSchema: createCursoSchema,
  updateSchema: updateCursoSchema,
});

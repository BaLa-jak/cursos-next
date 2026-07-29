import { eq } from "drizzle-orm";
import { crudEndpoints } from "@/lib/api/crud";
import { curso } from "@/db/schema";
import { createCursoSchema, updateCursoSchema } from "@/schemas/curso";

export const { GET, POST } = crudEndpoints({
  table: curso,
  resourceName: "Curso",
  createSchema: createCursoSchema,
  updateSchema: updateCursoSchema,
  baseFilter: eq(curso.publicado, true),
});

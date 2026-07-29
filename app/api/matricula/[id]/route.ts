import { crudItemEndpoints } from "@/lib/api/crud";
import { matricula } from "@/db/schema";
import {
  createMatriculaSchema,
  updateMatriculaSchema,
} from "@/schemas/matricula";

export const { GET, PATCH, DELETE } = crudItemEndpoints({
  table: matricula,
  resourceName: "Matricula",
  createSchema: createMatriculaSchema,
  updateSchema: updateMatriculaSchema,
});

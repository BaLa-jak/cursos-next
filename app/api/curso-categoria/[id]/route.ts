import { crudItemEndpoints } from "@/lib/api/crud";
import { cursoCategoria } from "@/db/schema";
import {
  createCursoCategoriaSchema,
  updateCursoCategoriaSchema,
} from "@/schemas/curso-categoria";

export const { GET, PATCH, DELETE } = crudItemEndpoints({
  table: cursoCategoria,
  resourceName: "CursoCategoria",
  createSchema: createCursoCategoriaSchema,
  updateSchema: updateCursoCategoriaSchema,
});

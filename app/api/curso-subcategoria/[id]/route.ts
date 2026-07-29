import { crudItemEndpoints } from "@/lib/api/crud";
import { cursoSubcategoria } from "@/db/schema";
import {
  createCursoSubcategoriaSchema,
  updateCursoSubcategoriaSchema,
} from "@/schemas/curso-subcategoria";

export const { GET, PATCH, DELETE } = crudItemEndpoints({
  table: cursoSubcategoria,
  resourceName: "CursoSubcategoria",
  createSchema: createCursoSubcategoriaSchema,
  updateSchema: updateCursoSubcategoriaSchema,
});

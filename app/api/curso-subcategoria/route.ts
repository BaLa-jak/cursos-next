import { sql } from "drizzle-orm";
import { crudEndpoints } from "@/lib/api/crud";
import { cursoSubcategoria } from "@/db/schema";
import {
  createCursoSubcategoriaSchema,
  updateCursoSubcategoriaSchema,
} from "@/schemas/curso-subcategoria";

export const { GET, POST } = crudEndpoints({
  table: cursoSubcategoria,
  resourceName: "CursoSubcategoria",
  createSchema: createCursoSubcategoriaSchema,
  updateSchema: updateCursoSubcategoriaSchema,
  orderBy: sql`${cursoSubcategoria.orden} asc`,
});

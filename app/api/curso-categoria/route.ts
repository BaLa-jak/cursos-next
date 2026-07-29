import { sql } from "drizzle-orm";
import { crudEndpoints } from "@/lib/api/crud";
import { cursoCategoria } from "@/db/schema";
import {
  createCursoCategoriaSchema,
  updateCursoCategoriaSchema,
} from "@/schemas/curso-categoria";

export const { GET, POST } = crudEndpoints({
  table: cursoCategoria,
  resourceName: "CursoCategoria",
  createSchema: createCursoCategoriaSchema,
  updateSchema: updateCursoCategoriaSchema,
  orderBy: sql`${cursoCategoria.orden} asc`,
});

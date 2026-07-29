import { crudItemEndpoints } from "@/lib/api/crud";
import { usuario } from "@/db/schema";
import {
  createUsuarioSchema,
  updateUsuarioSchema,
} from "@/schemas/usuario";

export const { GET, PATCH, DELETE } = crudItemEndpoints({
  table: usuario,
  resourceName: "Usuario",
  createSchema: createUsuarioSchema,
  updateSchema: updateUsuarioSchema,
});

import { crudEndpoints } from "@/lib/api/crud";
import { usuario } from "@/db/schema";
import {
  createUsuarioSchema,
  updateUsuarioSchema,
} from "@/schemas/usuario";

export const { GET, POST } = crudEndpoints({
  table: usuario,
  resourceName: "Usuario",
  createSchema: createUsuarioSchema,
  updateSchema: updateUsuarioSchema,
});

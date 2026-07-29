import {
  ModeloBase,
  type ModelColumnsType,
} from "./ModeloBase.model";
import type { Curso } from "./Curso.model";

/**
 * Modelo para la tabla `Maestro` — instructor / autor de cursos.
 *
 * Entidad separada de `Usuario` a propósito: un maestro puede tener
 * cuenta sin haber comprado nunca un curso, y un usuario puede comprar
 * cursos sin haber publicado nada. La relación `cursos` se hidrata
 * opcionalmente según cómo la consulte el cliente.
 */
export class Maestro extends ModeloBase {
  nombre?: string;
  apellido?: string;
  email?: string;
  emailVerificado?: boolean;
  passwordHash?: string;
  proveedorOAuth?: string;
  proveedorOAuthId?: string;
  avatarUrl?: string;
  biografia?: string;
  especialidad?: string;
  verificado?: boolean;
  estado?: "activo" | "pendiente" | "suspendido";
  ultimoLogin?: Date;

  cursos?: Curso[];

  static CLASS_NAME = "Maestro";
  static BASE_ROUTE = "/ed-admin/maestro";

  static COLUMNS: ModelColumnsType<Maestro>[] = [
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "apellido", header: "Apellido" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "especialidad", header: "Especialidad" },
    { accessorKey: "estado", header: "Estado" },
  ];

  static fromJson(data: Partial<Maestro>) {
    return new Maestro(data);
  }

  static fromJsonList(data: Partial<Maestro>[]) {
    return data.map((_data) => new Maestro(_data));
  }

  constructor(data: Partial<Maestro> = {}) {
    super();
    Object.assign(this, data);
  }
}

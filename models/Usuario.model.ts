import {
  ModeloBase,
  type ModelColumnsType,
} from "./ModeloBase.model";
import type { Resena } from "./Resena.model";
import type { Matricula } from "./Matricula.model";
import type { MetodoPago } from "./MetodoPago.model";
import type { Pago } from "./Pago.model";

/**
 * Modelo para la tabla `Usuario` — estudiantes / compradores.
 *
 * FKs y columnas propias de la tabla:
 * - `metodoPagoDefaultId` vive en el esquema pero no se declara aquí: el
 *   cliente lo representa como la relación `metodoPagoDefault?: MetodoPago`,
 *   ya hidratada por la API o `undefined` mientras no haya default.
 * - `passwordHash`, `proveedorOAuth*` se mantienen en el modelo aunque
 *   normalmente no se exponen al frontend — el backend los filtra antes
 *   de serializar.
 */
export class Usuario extends ModeloBase {
  nombre?: string;
  apellido?: string;
  email?: string;
  emailVerificado?: boolean;
  passwordHash?: string;
  proveedorOAuth?: string;
  proveedorOAuthId?: string;
  avatarUrl?: string;
  biografia?: string;
  ultimoLogin?: Date;

  resenas?: Resena[];
  matriculas?: Matricula[];
  metodosPago?: MetodoPago[];
  pagos?: Pago[];
  metodoPagoDefault?: MetodoPago;

  static CLASS_NAME = "Usuario";
  static BASE_ROUTE = "/ed-admin/usuario";

  static COLUMNS: ModelColumnsType<Usuario>[] = [
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "apellido", header: "Apellido" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "ultimoLogin", header: "Último login" },
  ];

  static fromJson(data: Partial<Usuario>) {
    return new Usuario(data);
  }

  static fromJsonList(data: Partial<Usuario>[]) {
    return data.map((_data) => new Usuario(_data));
  }

  constructor(data: Partial<Usuario> = {}) {
    super();
    Object.assign(this, data);
  }
}

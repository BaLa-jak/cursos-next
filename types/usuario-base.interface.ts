import type { IModeloBase } from "./ModeloBase.model";

export interface IUsuarioBase extends IModeloBase {
  correo?: string;
  clave?: string;
  nombre?: string;
  apellidos?: string;
  estatus?: number;
  telefono?: string;
  alias?: string;
  foto?: string;
  rol?: string;

  //#region Solo Usuario Sesion
  token?: string;
  refreshToken?: string;
  //#endregion
}

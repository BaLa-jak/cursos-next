import {
  ModeloBase,
  type ModelColumnsType,
} from "./ModeloBase.model";
import type { Usuario } from "./Usuario.model";

/**
 * Modelo para la tabla `MetodoPago` — métodos de pago guardados del
 * usuario (tarjeta tokenizada, PayPal, etc.).
 *
 * CRÍTICO: nunca se almacena el PAN aquí — solo `pasarelaMetodoId`, que
 * es un token opaco que vive en Stripe/PayPal/etc. Los últimos 4
 * dígitos y la marca son solo para mostrar en la UI.
 *
 * `esDefault` está protegido por un índice parcial
 * (`metodo_pago_default_unico_por_usuario`) que garantiza un único
 * método default activo por usuario.
 */
export class MetodoPago extends ModeloBase {
  tipo?: "tarjeta" | "paypal" | "transferencia";
  pasarela?: "stripe" | "paypal" | "mercadopago" | "manual";
  pasarelaMetodoId?: string;
  ultimos4?: string;
  marca?: "visa" | "mastercard" | "amex" | "carnet" | "oxxo";
  expiraMes?: number;
  expiraAnio?: number;
  alias?: string;
  esDefault?: boolean;

  usuario?: Usuario;

  static CLASS_NAME = "Método de pago";
  static BASE_ROUTE = "/ed-admin/metodo-pago";

  static COLUMNS: ModelColumnsType<MetodoPago>[] = [
    { accessorKey: "tipo", header: "Tipo" },
    { accessorKey: "pasarela", header: "Pasarela" },
    { accessorKey: "marca", header: "Marca" },
    { accessorKey: "ultimos4", header: "Últimos 4" },
    { accessorKey: "esDefault", header: "Default" },
  ];

  static fromJson(data: Partial<MetodoPago>) {
    return new MetodoPago(data);
  }

  static fromJsonList(data: Partial<MetodoPago>[]) {
    return data.map((_data) => new MetodoPago(_data));
  }

  constructor(data: Partial<MetodoPago> = {}) {
    super();
    Object.assign(this, data);
  }
}

import {
  ModeloBase,
  type ModelColumnsType,
} from "./ModeloBase.model";
import type { Usuario } from "./Usuario.model";
import type { Curso } from "./Curso.model";
import type { Matricula } from "./Matricula.model";

/**
 * Modelo para la tabla `Pago` — evento contable de cobro.
 *
 * Se crea UNO por cada transacción (incluso fallida o reembolsada) —
 * es el libro contable. `idmatricula` se rellena cuando el pago
 * corresponde a una matrícula nueva; queda `undefined` para pagos
 * que no la generen (renovaciones,礼品…). `montoCentavos` está
 * restringido a >= 0 por la CHECK constraint en la tabla.
 */
export class Pago extends ModeloBase {
  montoCentavos?: number;
  moneda?: string;
  estado?: "pendiente" | "completado" | "fallido" | "reembolsado";
  pasarela?: "stripe" | "paypal" | "mercadopago" | "manual";
  pasarelaPagoId?: string;
  tipo?: "tarjeta" | "paypal" | "transferencia" | "oxxo";

  usuario?: Usuario;
  curso?: Curso;
  matricula?: Matricula;

  static CLASS_NAME = "Pago";
  static BASE_ROUTE = "/ed-admin/pago";

  static COLUMNS: ModelColumnsType<Pago>[] = [
    { accessorKey: "montoCentavos", header: "Monto" },
    { accessorKey: "estado", header: "Estado" },
    { accessorKey: "pasarela", header: "Pasarela" },
    { accessorKey: "tipo", header: "Tipo" },
  ];

  static fromJson(data: Partial<Pago>) {
    return new Pago(data);
  }

  static fromJsonList(data: Partial<Pago>[]) {
    return data.map((_data) => new Pago(_data));
  }

  constructor(data: Partial<Pago> = {}) {
    super();
    Object.assign(this, data);
  }
}

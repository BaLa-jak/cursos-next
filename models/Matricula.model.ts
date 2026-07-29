import {
  ModeloBase,
  type ModelColumnsType,
} from "./ModeloBase.model";
import type { Usuario } from "./Usuario.model";
import type { Curso } from "./Curso.model";
import type { Pago } from "./Pago.model";

/**
 * Modelo para la tabla `Matricula` — une un `Usuario` con un `Curso`.
 *
 * `precioPagadoCentavos` se denormaliza a propósito: si el `Curso`
 * cambia de precio mañana, la matrícula vieja preserva el histórico
 * del cobro original. La UI usa este campo, NUNCA el precio actual
 * del curso, para mostrar "Pagaste $X el día Y".
 */
export class Matricula extends ModeloBase {
  precioPagadoCentavos?: number;
  moneda?: string;
  progreso?: number;
  completado?: boolean;
  fechaCompletado?: Date;
  certificadoUrl?: string;
  estado?: "activa" | "completada" | "cancelada" | "expirada";

  usuario?: Usuario;
  curso?: Curso;
  pagos?: Pago[];

  static CLASS_NAME = "Matrícula";
  static BASE_ROUTE = "/ed-admin/matricula";

  static COLUMNS: ModelColumnsType<Matricula>[] = [
    { accessorKey: "estado", header: "Estado" },
    { accessorKey: "progreso", header: "Progreso" },
    { accessorKey: "completado", header: "Completado" },
    { accessorKey: "precioPagadoCentavos", header: "Precio pagado" },
  ];

  static fromJson(data: Partial<Matricula>) {
    return new Matricula(data);
  }

  static fromJsonList(data: Partial<Matricula>[]) {
    return data.map((_data) => new Matricula(_data));
  }

  constructor(data: Partial<Matricula> = {}) {
    super();
    Object.assign(this, data);
  }
}

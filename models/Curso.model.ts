import {
  ModeloBase,
  type ModelColumnsType,
} from "./ModeloBase.model";
import type { Maestro } from "./Maestro.model";
import type { CursoSubcategoria } from "./CursoSubcategoria.model";
import type { Resena } from "./Resena.model";
import type { Matricula } from "./Matricula.model";
import type { Leccion } from "./Leccion.model";
import type { Pago } from "./Pago.model";

/**
 * Modelo para la tabla `Curso` — el producto central de la plataforma.
 *
 * Campos denormalizados (`calificacion`, `numeroResenas`,
 * `numeroEstudiantes`) se mantienen actualizados por triggers de
 * Postgres, así que llegan listos para mostrar sin agregar contadores
 * a cada query de catálogo.
 *
 * `precioCentavos` y `precioActualCentavos` son `integer` (centavos)
 * para evitar floats — la UI aplica el formateo con `Intl.NumberFormat`.
 */
export class Curso extends ModeloBase {
  slug?: string;
  titulo?: string;
  descripcion?: string;
  descripcionCorta?: string;
  imagenPortadaUrl?: string;
  precioCentavos?: number;
  precioActualCentavos?: number;
  moneda?: string;
  publicado?: boolean;
  calificacion?: number;
  numeroResenas?: number;
  numeroEstudiantes?: number;
  duracionMinutos?: number;
  nivel?: "principiante" | "intermedio" | "avanzado";
  idioma?: string;

  maestro?: Maestro;
  subcategoria?: CursoSubcategoria;
  resenas?: Resena[];
  matriculas?: Matricula[];
  lecciones?: Leccion[];
  pagos?: Pago[];

  static CLASS_NAME = "Curso";
  static BASE_ROUTE = "/ed-admin/curso";

  static COLUMNS: ModelColumnsType<Curso>[] = [
    { accessorKey: "titulo", header: "Título" },
    { accessorKey: "slug", header: "Slug" },
    { accessorKey: "publicado", header: "Publicado" },
    { accessorKey: "precioCentavos", header: "Precio" },
    { accessorKey: "nivel", header: "Nivel" },
    { accessorKey: "calificacion", header: "Calificación" },
  ];

  static fromJson(data: Partial<Curso>) {
    return new Curso(data);
  }

  static fromJsonList(data: Partial<Curso>[]) {
    return data.map((_data) => new Curso(_data));
  }

  constructor(data: Partial<Curso> = {}) {
    super();
    Object.assign(this, data);
  }
}

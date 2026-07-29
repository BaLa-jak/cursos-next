import {
  ModeloBase,
  type ModelColumnsType,
} from "./ModeloBase.model";
import type { Curso } from "./Curso.model";

/**
 * Modelo para la tabla `Leccion` — contenido dentro de un `Curso`.
 *
 * `orden` se mantiene único por curso (índice `leccion_curso_orden_unico`)
 * para que la UI pueda iterar sin un `ORDER BY` inconsistente, y
 * `esPreview` permite mostrar la primera lección sin matrícula — el
 * truco clásico de Udemy para captar estudiantes.
 */
export class Leccion extends ModeloBase {
  titulo?: string;
  descripcion?: string;
  slug?: string;
  orden?: number;
  duracionSegundos?: number;
  videoUrl?: string;
  contenidoMarkdown?: string;
  tipo?: "video" | "texto" | "quiz" | "proyecto";
  publicado?: boolean;
  esPreview?: boolean;

  curso?: Curso;

  static CLASS_NAME = "Lección";
  static BASE_ROUTE = "/ed-admin/leccion";

  static COLUMNS: ModelColumnsType<Leccion>[] = [
    { accessorKey: "titulo", header: "Título" },
    { accessorKey: "orden", header: "Orden" },
    { accessorKey: "tipo", header: "Tipo" },
    { accessorKey: "publicado", header: "Publicado" },
    { accessorKey: "esPreview", header: "Preview" },
  ];

  static fromJson(data: Partial<Leccion>) {
    return new Leccion(data);
  }

  static fromJsonList(data: Partial<Leccion>[]) {
    return data.map((_data) => new Leccion(_data));
  }

  constructor(data: Partial<Leccion> = {}) {
    super();
    Object.assign(this, data);
  }
}

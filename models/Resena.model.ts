import {
  ModeloBase,
  type ModelColumnsType,
} from "./ModeloBase.model";
import type { Usuario } from "./Usuario.model";
import type { Curso } from "./Curso.model";

/**
 * Modelo para la tabla `Resena` — reseña que un `Usuario` deja en un
 * `Curso`. El índice parcial `resena_usuario_curso_unico` garantiza
 * una sola reseña activa por (usuario, curso).
 *
 * `aprobado` es el flag de moderación editorial: `false` significa que
 * NO se cuenta en el promedio ni se muestra en la UI pública, pero la
 * fila existe para auditoría.
 */
export class Resena extends ModeloBase {
  calificacion?: number;
  comentario?: string;
  aprobado?: boolean;

  usuario?: Usuario;
  curso?: Curso;

  static CLASS_NAME = "Reseña";
  static BASE_ROUTE = "/ed-admin/resena";

  static COLUMNS: ModelColumnsType<Resena>[] = [
    { accessorKey: "calificacion", header: "Calificación" },
    { accessorKey: "aprobado", header: "Aprobada" },
    { accessorKey: "comentario", header: "Comentario" },
  ];

  static fromJson(data: Partial<Resena>) {
    return new Resena(data);
  }

  static fromJsonList(data: Partial<Resena>[]) {
    return data.map((_data) => new Resena(_data));
  }

  constructor(data: Partial<Resena> = {}) {
    super();
    Object.assign(this, data);
  }
}

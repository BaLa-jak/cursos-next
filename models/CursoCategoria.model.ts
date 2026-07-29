import {
  ModeloBase,
  type ModelColumnsType,
} from "./ModeloBase.model";
import type { CursoSubcategoria } from "./CursoSubcategoria.model";

/**
 * Modelo para la tabla `CursoCategoria` — categoría de primer nivel.
 *
 * Mantenemos el prefijo `Curso` en el nombre de la tabla para evitar
 * choques con futuras categorías de otros espacios (instructores,
 * posts, etc.) que puedan necesitar su propia clasificación.
 */
export class CursoCategoria extends ModeloBase {
  nombre?: string;
  slug?: string;
  descripcion?: string;
  iconoUrl?: string;
  orden?: number;

  subcategorias?: CursoSubcategoria[];

  static CLASS_NAME = "Categoría de curso";
  static BASE_ROUTE = "/ed-admin/curso-categoria";

  static COLUMNS: ModelColumnsType<CursoCategoria>[] = [
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "slug", header: "Slug" },
    { accessorKey: "orden", header: "Orden" },
    { accessorKey: "descripcion", header: "Descripción" },
  ];

  static fromJson(data: Partial<CursoCategoria>) {
    return new CursoCategoria(data);
  }

  static fromJsonList(data: Partial<CursoCategoria>[]) {
    return data.map((_data) => new CursoCategoria(_data));
  }

  constructor(data: Partial<CursoCategoria> = {}) {
    super();
    Object.assign(this, data);
  }
}

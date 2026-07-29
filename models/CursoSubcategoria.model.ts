import {
  ModeloBase,
  type ModelColumnsType,
} from "./ModeloBase.model";
import type { CursoCategoria } from "./CursoCategoria.model";
import type { Curso } from "./Curso.model";

/**
 * Modelo para la tabla `CursoSubcategoria` — segundo nivel de
 * clasificación, dependiente siempre de una `CursoCategoria` padre.
 */
export class CursoSubcategoria extends ModeloBase {
  nombre?: string;
  slug?: string;
  descripcion?: string;
  orden?: number;

  categoria?: CursoCategoria;
  cursos?: Curso[];

  static CLASS_NAME = "Subcategoría de curso";
  static BASE_ROUTE = "/ed-admin/curso-subcategoria";

  static COLUMNS: ModelColumnsType<CursoSubcategoria>[] = [
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "slug", header: "Slug" },
    { accessorKey: "orden", header: "Orden" },
    { accessorKey: "descripcion", header: "Descripción" },
  ];

  static fromJson(data: Partial<CursoSubcategoria>) {
    return new CursoSubcategoria(data);
  }

  static fromJsonList(data: Partial<CursoSubcategoria>[]) {
    return data.map((_data) => new CursoSubcategoria(_data));
  }

  constructor(data: Partial<CursoSubcategoria> = {}) {
    super();
    Object.assign(this, data);
  }
}

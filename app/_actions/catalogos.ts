"use server";

import type {
  CatalogoParams,
  CatalogoResultado,
} from "@/types/paginacion";
import {
  listarCategorias,
  listarCursos,
  listarMaestros,
  type CatalogoRecurso,
} from "@/lib/dal/catalogos";

export async function fetchCatalogo<T = unknown>(
  recurso: CatalogoRecurso,
  params: CatalogoParams = {},
): Promise<CatalogoResultado<T>> {
  switch (recurso) {
    case "curso":
      return listarCursos(params) as Promise<CatalogoResultado<T>>;
    case "maestro":
      return listarMaestros(params) as Promise<CatalogoResultado<T>>;
    case "curso-categoria":
      return listarCategorias(params) as Promise<CatalogoResultado<T>>;
    default: {
      const _exhaustive: never = recurso;
      throw new Error(`Recurso de catálogo no soportado: ${String(_exhaustive)}`);
    }
  }
}
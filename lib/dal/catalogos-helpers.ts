export const LIMITE_POR_DEFECTO = 20;
export const LIMITE_MAXIMO = 100;

export type TPaginacion = {
  pagina: number;
  limite: number;
  total: number;
  totalPaginas: number;
};

export type CatalogoParams = {
  pagina?: number;
  limite?: number;
  ordenar?: string;
  busqueda?: string;
  categoriaId?: string;
  maestroId?: string;
  publicado?: boolean;
};

export type CatalogoResultado<T> = {
  resultado: T[];
  paginacion: TPaginacion;
};

export function toOffset(pagina: number, limite: number): number {
  if (!Number.isFinite(pagina) || !Number.isFinite(limite)) return 0;
  const p = Math.max(1, Math.floor(pagina));
  const l = Math.max(1, Math.floor(limite));
  return (p - 1) * l;
}

export function normalizarPaginacion(
  p: CatalogoParams,
): { pagina: number; limite: number } {
  const pagina =
    Number.isFinite(p.pagina) && (p.pagina as number) >= 1
      ? Math.floor(p.pagina as number)
      : 1;
  const rawLimite =
    Number.isFinite(p.limite) && (p.limite as number) >= 1
      ? Math.floor(p.limite as number)
      : LIMITE_POR_DEFECTO;
  const limite = Math.min(LIMITE_MAXIMO, rawLimite);
  return { pagina, limite };
}

export function totalPaginas(total: number, limite: number): number {
  if (!Number.isFinite(total) || total <= 0) return 1;
  if (!Number.isFinite(limite) || limite <= 0) return 1;
  return Math.max(1, Math.ceil(total / limite));
}

export function armarPaginacion(
  params: CatalogoParams,
  total: number,
): TPaginacion {
  const { pagina, limite } = normalizarPaginacion(params);
  return { pagina, limite, total, totalPaginas: totalPaginas(total, limite) };
}

export type DireccionOrden = "asc" | "desc";
export type OrdenSpec<C extends string> = { columna: C; direccion: DireccionOrden };

export type CursoColumnaOrden = "titulo" | "creado" | "precioCentavos" | "calificacion";

export function parseCursoOrdenar(
  ordenar: string | undefined,
): OrdenSpec<CursoColumnaOrden> | null {
  switch (ordenar) {
    case "titulo-asc":       return { columna: "titulo", direccion: "asc" };
    case "titulo-desc":      return { columna: "titulo", direccion: "desc" };
    case "creado-asc":       return { columna: "creado", direccion: "asc" };
    case "creado-desc":      return { columna: "creado", direccion: "desc" };
    case "precio-asc":       return { columna: "precioCentavos", direccion: "asc" };
    case "precio-desc":      return { columna: "precioCentavos", direccion: "desc" };
    case "calificacion-desc": return { columna: "calificacion", direccion: "desc" };
    case "nombre-asc":       return { columna: "titulo", direccion: "asc" };
    case "nombre-desc":      return { columna: "titulo", direccion: "desc" };
    default:                 return null;
  }
}

export type MaestroColumnaOrden = "nombre" | "creado";

export function parseMaestroOrdenar(
  ordenar: string | undefined,
): OrdenSpec<MaestroColumnaOrden> | null {
  switch (ordenar) {
    case "nombre-asc":   return { columna: "nombre", direccion: "asc" };
    case "nombre-desc":  return { columna: "nombre", direccion: "desc" };
    case "creado-asc":   return { columna: "creado", direccion: "asc" };
    case "creado-desc":  return { columna: "creado", direccion: "desc" };
    default:             return null;
  }
}

export type CategoriaColumnaOrden = "nombre" | "orden";

export function parseCategoriaOrdenar(
  ordenar: string | undefined,
): OrdenSpec<CategoriaColumnaOrden> | null {
  switch (ordenar) {
    case "nombre-asc":   return { columna: "nombre", direccion: "asc" };
    case "nombre-desc":  return { columna: "nombre", direccion: "desc" };
    case "orden-asc":    return { columna: "orden", direccion: "asc" };
    case "orden-desc":   return { columna: "orden", direccion: "desc" };
    default:             return null;
  }
}
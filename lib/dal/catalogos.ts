import "server-only";
import { cache } from "react";
import { and, asc, count, desc, eq, ilike, isNull, type SQL } from "drizzle-orm";
import { db } from "@/db";
import {
  curso,
  cursoCategoria,
  maestro,
  type Curso,
  type CursoCategoria,
  type Maestro,
} from "@/db/schema";
import type {
  CatalogoParams,
  CatalogoResultado,
} from "@/types/paginacion";
import {
  armarPaginacion,
  normalizarPaginacion,
  parseCategoriaOrdenar,
  parseCursoOrdenar,
  parseMaestroOrdenar,
  toOffset,
} from "./catalogos-helpers";

export type CatalogoRecurso = "curso" | "maestro" | "curso-categoria";

function orderByCurso(spec: ReturnType<typeof parseCursoOrdenar>): SQL | undefined {
  if (!spec) return undefined;
  switch (spec.columna) {
    case "titulo":          return spec.direccion === "asc" ? asc(curso.titulo) : desc(curso.titulo);
    case "creado":          return spec.direccion === "asc" ? asc(curso.creado) : desc(curso.creado);
    case "precioCentavos":  return spec.direccion === "asc" ? asc(curso.precioCentavos) : desc(curso.precioCentavos);
    case "calificacion":    return spec.direccion === "asc" ? asc(curso.calificacion) : desc(curso.calificacion);
  }
}

function orderByMaestro(spec: ReturnType<typeof parseMaestroOrdenar>): SQL | undefined {
  if (!spec) return undefined;
  switch (spec.columna) {
    case "nombre":  return spec.direccion === "asc" ? asc(maestro.nombre) : desc(maestro.nombre);
    case "creado":  return spec.direccion === "asc" ? asc(maestro.creado) : desc(maestro.creado);
  }
}

function orderByCategoria(spec: ReturnType<typeof parseCategoriaOrdenar>): SQL | undefined {
  if (!spec) return undefined;
  switch (spec.columna) {
    case "nombre": return spec.direccion === "asc" ? asc(cursoCategoria.nombre) : desc(cursoCategoria.nombre);
    case "orden":  return spec.direccion === "asc" ? asc(cursoCategoria.orden) : desc(cursoCategoria.orden);
  }
}

function whereCursoActivo(p: CatalogoParams): SQL {
  return and(
    isNull(curso.eliminado),
    typeof p.publicado === "boolean"
      ? eq(curso.publicado, p.publicado)
      : eq(curso.publicado, true),
    p.maestroId ? eq(curso.maestroId, p.maestroId) : undefined,
    p.busqueda ? ilike(curso.titulo, `%${p.busqueda}%`) : undefined,
  )!;
}

function whereMaestroActivo(p: CatalogoParams): SQL {
  return and(
    isNull(maestro.eliminado),
    p.busqueda ? ilike(maestro.nombre, `%${p.busqueda}%`) : undefined,
  )!;
}

function whereCategoriaActiva(p: CatalogoParams): SQL {
  return and(
    isNull(cursoCategoria.eliminado),
    p.busqueda
      ? ilike(cursoCategoria.nombre, `%${p.busqueda}%`)
      : undefined,
  )!;
}

async function _listarCursos(
  p: CatalogoParams,
): Promise<CatalogoResultado<Curso>> {
  const { pagina, limite } = normalizarPaginacion(p);
  const where = whereCursoActivo(p);
  const orderBy = orderByCurso(parseCursoOrdenar(p.ordenar)) ?? desc(curso.creado);

  const [{ total }] = await db
    .select({ total: count() })
    .from(curso)
    .where(where);

  const filas = await db
    .select()
    .from(curso)
    .where(where)
    .orderBy(orderBy)
    .limit(limite)
    .offset(toOffset(pagina, limite));

  return { resultado: filas, paginacion: armarPaginacion(p, total) };
}

export const listarCursos = cache(_listarCursos);

async function _listarMaestros(
  p: CatalogoParams,
): Promise<CatalogoResultado<Maestro>> {
  const { pagina, limite } = normalizarPaginacion(p);
  const where = whereMaestroActivo(p);
  const orderBy = orderByMaestro(parseMaestroOrdenar(p.ordenar)) ?? desc(maestro.creado);

  const [{ total }] = await db
    .select({ total: count() })
    .from(maestro)
    .where(where);

  const filas = await db
    .select()
    .from(maestro)
    .where(where)
    .orderBy(orderBy)
    .limit(limite)
    .offset(toOffset(pagina, limite));

  return { resultado: filas, paginacion: armarPaginacion(p, total) };
}

export const listarMaestros = cache(_listarMaestros);

async function _listarCategorias(
  p: CatalogoParams,
): Promise<CatalogoResultado<CursoCategoria>> {
  const { pagina, limite } = normalizarPaginacion(p);
  const where = whereCategoriaActiva(p);
  const orderBy = orderByCategoria(parseCategoriaOrdenar(p.ordenar)) ?? asc(cursoCategoria.orden);

  const [{ total }] = await db
    .select({ total: count() })
    .from(cursoCategoria)
    .where(where);

  const filas = await db
    .select()
    .from(cursoCategoria)
    .where(where)
    .orderBy(orderBy)
    .limit(limite)
    .offset(toOffset(pagina, limite));

  return { resultado: filas, paginacion: armarPaginacion(p, total) };
}

export const listarCategorias = cache(_listarCategorias);
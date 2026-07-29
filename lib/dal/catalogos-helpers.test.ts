import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  LIMITE_MAXIMO,
  LIMITE_POR_DEFECTO,
  armarPaginacion,
  normalizarPaginacion,
  parseCategoriaOrdenar,
  parseCursoOrdenar,
  parseMaestroOrdenar,
  toOffset,
  totalPaginas,
} from "./catalogos-helpers";

describe("toOffset", () => {
  it("devuelve 0 para la primera página", () => {
    assert.equal(toOffset(1, 20), 0);
  });

  it("salta el offset correcto en páginas siguientes", () => {
    assert.equal(toOffset(2, 20), 20);
    assert.equal(toOffset(3, 20), 40);
    assert.equal(toOffset(5, 10), 40);
  });

  it("clampea páginas inválidas a offset 0", () => {
    assert.equal(toOffset(0, 20), 0);
    assert.equal(toOffset(-1, 20), 0);
  });

  it("devuelve 0 si los argumentos no son números", () => {
    assert.equal(toOffset(Number.NaN, 20), 0);
    assert.equal(toOffset(1, Number.NaN), 0);
    assert.equal(toOffset(Number.POSITIVE_INFINITY, 20), 0);
  });
});

describe("normalizarPaginacion", () => {
  it("aplica defaults cuando los params están vacíos", () => {
    const { pagina, limite } = normalizarPaginacion({});
    assert.equal(pagina, 1);
    assert.equal(limite, LIMITE_POR_DEFECTO);
  });

  it("rechaza páginas no válidas (< 1, NaN, undefined)", () => {
    assert.equal(normalizarPaginacion({ pagina: 0 }).pagina, 1);
    assert.equal(normalizarPaginacion({ pagina: -3 }).pagina, 1);
    assert.equal(normalizarPaginacion({ pagina: Number.NaN }).pagina, 1);
    assert.equal(normalizarPaginacion({ pagina: undefined }).pagina, 1);
  });

  it("respeta páginas válidas", () => {
    assert.equal(normalizarPaginacion({ pagina: 5 }).pagina, 5);
    assert.equal(normalizarPaginacion({ pagina: 3.7 }).pagina, 3);
  });

  it("clampa límites por encima del máximo", () => {
    assert.equal(normalizarPaginacion({ limite: 500 }).limite, LIMITE_MAXIMO);
    assert.equal(normalizarPaginacion({ limite: 101 }).limite, LIMITE_MAXIMO);
  });

  it("rechaza límites ≤ 0 y NaN", () => {
    assert.equal(normalizarPaginacion({ limite: 0 }).limite, LIMITE_POR_DEFECTO);
    assert.equal(normalizarPaginacion({ limite: -5 }).limite, LIMITE_POR_DEFECTO);
    assert.equal(normalizarPaginacion({ limite: Number.NaN }).limite, LIMITE_POR_DEFECTO);
  });

  it("redondea límites válidos hacia abajo", () => {
    assert.equal(normalizarPaginacion({ limite: 7.4 }).limite, 7);
    assert.equal(normalizarPaginacion({ limite: 25 }).limite, 25);
  });
});

describe("totalPaginas", () => {
  it("devuelve 1 si total es 0 (evita 'Página 1 de 0')", () => {
    assert.equal(totalPaginas(0, 20), 1);
  });

  it("devuelve 1 si total es negativo o NaN", () => {
    assert.equal(totalPaginas(-5, 20), 1);
    assert.equal(totalPaginas(Number.NaN, 20), 1);
  });

  it("redondea hacia arriba", () => {
    assert.equal(totalPaginas(1, 20), 1);
    assert.equal(totalPaginas(20, 20), 1);
    assert.equal(totalPaginas(21, 20), 2);
    assert.equal(totalPaginas(45, 20), 3);
    assert.equal(totalPaginas(100, 20), 5);
  });
});

describe("armarPaginacion", () => {
  it("compone pagina + limite + total en el shape esperado por la UI", () => {
    const result = armarPaginacion({ pagina: 2, limite: 10 }, 25);
    assert.deepEqual(result, { pagina: 2, limite: 10, total: 25, totalPaginas: 3 });
  });

  it("normaliza params inválidos antes de devolver", () => {
    const result = armarPaginacion({ pagina: -1, limite: 999 }, 0);
    assert.deepEqual(result, { pagina: 1, limite: LIMITE_MAXIMO, total: 0, totalPaginas: 1 });
  });
});

describe("parseCursoOrdenar", () => {
  it("reconoce los valores canónicos", () => {
    assert.deepEqual(parseCursoOrdenar("titulo-asc"), { columna: "titulo", direccion: "asc" });
    assert.deepEqual(parseCursoOrdenar("creado-desc"), { columna: "creado", direccion: "desc" });
    assert.deepEqual(parseCursoOrdenar("precio-asc"), { columna: "precioCentavos", direccion: "asc" });
    assert.deepEqual(parseCursoOrdenar("calificacion-desc"), { columna: "calificacion", direccion: "desc" });
  });

  it("mapea el alias legacy 'nombre-*' a la columna titulo", () => {
    assert.deepEqual(parseCursoOrdenar("nombre-asc"), { columna: "titulo", direccion: "asc" });
    assert.deepEqual(parseCursoOrdenar("nombre-desc"), { columna: "titulo", direccion: "desc" });
  });

  it("devuelve null para valores no reconocidos o vacíos", () => {
    assert.equal(parseCursoOrdenar("foo-bar"), null);
    assert.equal(parseCursoOrdenar(undefined), null);
    assert.equal(parseCursoOrdenar(""), null);
  });
});

describe("parseMaestroOrdenar", () => {
  it("reconoce nombre-* y creado-*", () => {
    assert.deepEqual(parseMaestroOrdenar("nombre-asc"), { columna: "nombre", direccion: "asc" });
    assert.deepEqual(parseMaestroOrdenar("creado-desc"), { columna: "creado", direccion: "desc" });
  });

  it("rechaza valores desconocidos", () => {
    assert.equal(parseMaestroOrdenar("foo"), null);
    assert.equal(parseMaestroOrdenar(undefined), null);
  });
});

describe("parseCategoriaOrdenar", () => {
  it("reconoce nombre-* y orden-*", () => {
    assert.deepEqual(parseCategoriaOrdenar("nombre-asc"), { columna: "nombre", direccion: "asc" });
    assert.deepEqual(parseCategoriaOrdenar("orden-desc"), { columna: "orden", direccion: "desc" });
  });

  it("rechaza valores desconocidos", () => {
    assert.equal(parseCategoriaOrdenar("foo"), null);
    assert.equal(parseCategoriaOrdenar(undefined), null);
  });
});
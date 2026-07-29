import { and, desc, eq, isNull, type SQL } from "drizzle-orm";
import type { AnyPgTable, PgColumn } from "drizzle-orm/pg-core";
import type { ZodType } from "zod";
import { db } from "@/db";
import {
  jsonCreated,
  jsonError,
  jsonNoContent,
  jsonOk,
  pgErrorToStatus,
} from "./errors";
import { parseJson, parseId, parsePagination } from "./parse";

interface TableShape {
  id: PgColumn;
  eliminado: PgColumn;
  creado: PgColumn;
}

type CrudConfig<TCreate, TUpdate> = {
  table: AnyPgTable;
  resourceName: string;
  createSchema: ZodType<TCreate>;
  updateSchema: ZodType<TUpdate>;
  orderBy?: SQL;
  baseFilter?: SQL;
};

export function crudEndpoints<TCreate, TUpdate>(
  config: CrudConfig<TCreate, TUpdate>,
) {
  const { table, resourceName, createSchema, orderBy, baseFilter } = config;
  const t = table as unknown as TableShape;

  return {
    async GET(request: Request) {
      const url = new URL(request.url);
      const { limit, offset } = parsePagination(url);
      const where = baseFilter
        ? and(isNull(t.eliminado), baseFilter)
        : isNull(t.eliminado);

      try {
        const rows = await db
          .select()
          .from(table)
          .where(where)
          .orderBy(orderBy ?? desc(t.creado))
          .limit(limit)
          .offset(offset);

        return jsonOk({ data: rows, pagination: { limit, offset } });
      } catch (err) {
        return pgErrorToStatus(err);
      }
    },

    async POST(request: Request) {
      const parsed = await parseJson(request, createSchema);
      if (!parsed.ok) return parsed.response;

      try {
        const [row] = await db
          .insert(table)
          .values(parsed.data as Record<string, unknown>)
          .returning();

        if (!row) return jsonError(500, `No se pudo crear ${resourceName}`);
        return jsonCreated(row);
      } catch (err) {
        return pgErrorToStatus(err);
      }
    },
  };
}

export function crudItemEndpoints<TCreate, TUpdate>(
  config: CrudConfig<TCreate, TUpdate>,
) {
  const { table, resourceName, updateSchema } = config;
  const t = table as unknown as TableShape;

  const activeById = (id: string) => and(eq(t.id, id), isNull(t.eliminado));

  return {
    async GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
      const parsed = await parseId(ctx.params);
      if (!parsed.ok) return parsed.response;

      try {
        const [row] = await db
          .select()
          .from(table)
          .where(activeById(parsed.id))
          .limit(1);

        if (!row) return jsonError(404, `${resourceName} no encontrado`);
        return jsonOk(row);
      } catch (err) {
        return pgErrorToStatus(err);
      }
    },

    async PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
      const parsedId = await parseId(ctx.params);
      if (!parsedId.ok) return parsedId.response;

      const parsedBody = await parseJson(request, updateSchema);
      if (!parsedBody.ok) return parsedBody.response;

      try {
        const [row] = await db
          .update(table)
          .set(parsedBody.data as Record<string, unknown>)
          .where(activeById(parsedId.id))
          .returning();

        if (!row) return jsonError(404, `${resourceName} no encontrado`);
        return jsonOk(row);
      } catch (err) {
        return pgErrorToStatus(err);
      }
    },

    async DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
      const parsed = await parseId(ctx.params);
      if (!parsed.ok) return parsed.response;

      try {
        const result = await db
          .update(table)
          .set({ eliminado: new Date() } as Record<string, unknown>)
          .where(activeById(parsed.id))
          .returning({ id: t.id });

        if (result.length === 0) {
          return jsonError(404, `${resourceName} no encontrado`);
        }
        return jsonNoContent();
      } catch (err) {
        return pgErrorToStatus(err);
      }
    },
  };
}


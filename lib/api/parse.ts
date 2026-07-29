import type { ZodType } from "zod";
import { jsonError } from "./errors";

export async function parseJson<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<{ ok: true; data: T } | { ok: false; response: Response }> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return {
      ok: false,
      response: jsonError(400, "JSON inválido o body vacío"),
    };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      response: jsonError(400, "Datos inválidos", parsed.error.issues),
    };
  }

  return { ok: true, data: parsed.data };
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function parseId(
  params: Promise<{ id: string }>,
): Promise<{ ok: true; id: string } | { ok: false; response: Response }> {
  const { id } = await params;
  if (!UUID_REGEX.test(id)) {
    return { ok: false, response: jsonError(400, "ID con formato inválido") };
  }
  return { ok: true, id };
}

export function parsePagination(url: URL): { limit: number; offset: number } {
  const rawLimit = Number(url.searchParams.get("limit") ?? 20);
  const rawOffset = Number(url.searchParams.get("offset") ?? 0);
  return {
    limit: Math.min(100, Math.max(1, isFinite(rawLimit) ? rawLimit : 20)),
    offset: Math.max(0, isFinite(rawOffset) ? rawOffset : 0),
  };
}

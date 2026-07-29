export function jsonOk<T>(data: T, init: ResponseInit = {}): Response {
  return Response.json(data, { status: 200, ...init });
}

export function jsonCreated<T>(data: T): Response {
  return Response.json(data, { status: 201 });
}

export function jsonNoContent(): Response {
  return new Response(null, { status: 204 });
}

export function jsonError(
  status: number,
  message: string,
  details?: unknown,
): Response {
  return Response.json(
    {
      error: {
        code: errorCode(status),
        message,
        ...(details !== undefined ? { details } : {}),
      },
    },
    { status },
  );
}

const PG_CODES: Record<string, { status: number; message: string }> = {
  "23505": { status: 409, message: "Ya existe un registro con esos valores" },
  "23503": { status: 409, message: "Referencia inválida a un registro relacionado" },
  "23502": { status: 400, message: "Falta un campo obligatorio" },
  "23514": { status: 400, message: "Un campo no cumple la restricción de valor" },
  "22P02": { status: 400, message: "Identificador con formato inválido" },
};

export function pgErrorToStatus(error: unknown): Response {
  if (error && typeof error === "object" && "cause" in error) {
    const cause = (error as { cause: unknown }).cause;
    if (
      cause &&
      typeof cause === "object" &&
      "code" in cause &&
      typeof (cause as { code: unknown }).code === "string"
    ) {
      const mapped = PG_CODES[(cause as { code: string }).code];
      if (mapped) {
        return jsonError(mapped.status, mapped.message, {
          pgCode: (cause as { code: string }).code,
        });
      }
    }
  }
  return jsonError(500, "Error interno del servidor");
}

function errorCode(status: number): string {
  if (status >= 500) return "INTERNAL_ERROR";
  if (status === 404) return "NOT_FOUND";
  if (status === 409) return "CONFLICT";
  if (status === 400) return "BAD_REQUEST";
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  return "ERROR";
}

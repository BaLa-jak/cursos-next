"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-2xl flex-col items-start gap-4 p-8">
      <h1 className="text-2xl font-bold">Algo salió mal</h1>
      <p className="text-muted-foreground">
        No pudimos cargar esta sección. Vuelve a intentarlo.
      </p>

      {error.digest && (
        <p className="text-xs text-muted-foreground">Referencia: {error.digest}</p>
      )}

      <div className="mt-2 flex gap-4">
        <button
          onClick={() => unstable_retry()}
          className="rounded border px-3 py-1.5 text-sm"
        >
          Reintentar
        </button>
        <Link href="/" transitionTypes={["nav-forward"]} className="self-center text-sm underline">
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}

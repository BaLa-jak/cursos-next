"use client"; // Los error boundaries SIEMPRE son Client Components

import { useEffect } from "react";
import Link from "next/link";

// Atrapa las excepciones no controladas de este segmento y sus hijos.
// El layout sigue vivo: solo se reemplaza el contenido que reventó.
//
// Para un fallback más fino, pon otro error.tsx dentro del segmento: así un
// fallo en /cursos no tumba toda la app.
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  // Next 16.2: antes era `reset`. unstable_retry vuelve a pedir los datos;
  // reset solo re-renderiza con lo que ya había.
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Aquí va el reporte a Sentry o similar cuando lo conectes.
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-2xl flex-col items-start gap-4 p-8">
      <h1 className="text-2xl font-bold">Algo salió mal</h1>
      <p className="text-gray-500">
        No pudimos cargar esta sección. Vuelve a intentarlo.
      </p>

      {/*
        En producción, error.message llega vacío a propósito: Next lo oculta
        para no filtrar detalles internos (rutas, queries) al navegador. Solo
        queda el digest, que sirve para cruzarlo con los logs del servidor.
        No lo reemplaces imprimiendo el error completo.
      */}
      {error.digest && (
        <p className="text-xs text-gray-400">Referencia: {error.digest}</p>
      )}

      <div className="mt-2 flex gap-4">
        <button
          onClick={() => unstable_retry()}
          className="rounded border px-3 py-1.5 text-sm"
        >
          Reintentar
        </button>
        <Link href="/" className="self-center text-sm underline">
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}

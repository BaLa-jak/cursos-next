"use client";

// Último recurso: solo entra cuando revienta el propio root layout, algo que
// app/error.tsx no puede atrapar porque vive dentro de ese layout.
//
// Reemplaza al root layout, así que declara su propio <html> y <body>. Por lo
// mismo no hereda globals.css: los estilos van inline o no se aplican.
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="es">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          maxWidth: "42rem",
          margin: "0 auto",
        }}
      >
        <h1>La aplicación no pudo cargar</h1>
        <p>Estamos al tanto del problema. Intenta de nuevo en un momento.</p>
        {error.digest && (
          <p style={{ fontSize: "0.75rem", color: "#888" }}>
            Referencia: {error.digest}
          </p>
        )}
        <button onClick={() => unstable_retry()}>Reintentar</button>
      </body>
    </html>
  );
}

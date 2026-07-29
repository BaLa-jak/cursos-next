import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cursos",
  description:
    "Catálogo completo de Cursos-next. Filtra por categoría, nivel y duración para encontrar tu próxima formación.",
};

export default function CursosPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col items-start gap-3 px-5 py-10 sm:px-8 sm:py-14">
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        Catálogo
      </p>
      <h1 className="text-balance text-3xl font-heading font-semibold tracking-tight text-foreground sm:text-4xl">
        Cursos
      </h1>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base">
        Renderizado en el servidor. Desactiva JavaScript y sigue viéndose.
      </p>

      <Link
        href="/cursos/via-api"
        transitionTypes={["nav-forward"]}
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline sm:mt-8 sm:text-base"
      >
        Ver la misma lista pedida desde el cliente
        <span aria-hidden="true">→</span>
      </Link>
    </main>
  );
}

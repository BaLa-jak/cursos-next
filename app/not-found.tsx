import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-start gap-4 p-8">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="text-2xl font-bold">Esta página no existe</h1>
      <p className="text-muted-foreground">
        Puede que el enlace esté mal escrito o que el contenido se haya movido.
      </p>
      <Link href="/" transitionTypes={["nav-back"]} className="mt-2 underline">
        Volver al inicio
      </Link>
    </main>
  );
}

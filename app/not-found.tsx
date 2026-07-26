import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-start gap-4 p-8">
      <p className="text-sm font-medium text-gray-500">404</p>
      <h1 className="text-2xl font-bold">Esta página no existe</h1>
      <p className="text-gray-500">
        Puede que el enlace esté mal escrito o que el contenido se haya movido.
      </p>
      <Link href="/" className="mt-2 underline">
        Volver al inicio
      </Link>
    </main>
  );
}

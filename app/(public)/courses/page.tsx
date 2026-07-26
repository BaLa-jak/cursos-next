import Link from "next/link";
export const dynamic = "force-dynamic";

export default async function CursosPage() {

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">Cursos</h1>
      <p className="mt-1 text-sm text-gray-500">
        Renderizado en el servidor. Desactiva JavaScript y sigue viéndose.
      </p>


      <Link href="/cursos/via-api" className="mt-8 inline-block underline">
        Ver la misma lista pedida desde el cliente →
      </Link>
    </main>
  );
}

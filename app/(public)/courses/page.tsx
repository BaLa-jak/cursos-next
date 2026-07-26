import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { coursesTable } from "@/db/schema";
export const dynamic = "force-dynamic";

export default async function CursosPage() {
  const courses = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.published, true));

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">Cursos</h1>
      <p className="mt-1 text-sm text-gray-500">
        Renderizado en el servidor. Desactiva JavaScript y sigue viéndose.
      </p>

      {courses.length === 0 ? (
        <p className="mt-8 text-gray-500">
          Nada todavía. Crea uno con POST /api/courses y ponlo en published.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {courses.map((course) => (
            <li key={course.id} className="rounded border p-4">
              <h2 className="font-medium">{course.title}</h2>
              <p className="text-sm text-gray-500">{course.description}</p>
              <p className="mt-2 text-sm">
                {(course.priceCents / 100).toLocaleString("es-MX", {
                  style: "currency",
                  currency: "MXN",
                })}
              </p>
            </li>
          ))}
        </ul>
      )}

      <Link href="/cursos/via-api" className="mt-8 inline-block underline">
        Ver la misma lista pedida desde el cliente →
      </Link>
    </main>
  );
}

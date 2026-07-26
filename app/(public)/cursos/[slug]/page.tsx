import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { coursesTable } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function CursoPage({
  params,
}: {
  // Next 16: params es una Promise, hay que await-earla.
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [course] = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.slug, slug));

  // notFound() corta el render y muestra el not-found.tsx más cercano
  // con status 404. No devuelve nada: lo que sigue no se ejecuta.
  if (!course || !course.published) notFound();

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <p className="mt-2 text-gray-500">{course.description}</p>
      <p className="mt-4">
        {(course.priceCents / 100).toLocaleString("es-MX", {
          style: "currency",
          currency: "MXN",
        })}
      </p>
    </main>
  );
}

// import { eq } from "drizzle-orm";
// import { db } from "@/db";
// import { coursesTable } from "@/db/schema";
// import { createCourseSchema } from "@/schemas/course";

// export async function GET() {
//   const courses = await db
//     .select()
//     .from(coursesTable)
//     .where(eq(coursesTable.published, true));

//   return Response.json(courses);
// }

// export async function POST(request: Request) {
//   let body: unknown;
//   try {
//     body = await request.json();
//   } catch {
//     return Response.json({ error: "JSON inválido" }, { status: 400 });
//   }

//   const parsed = createCourseSchema.safeParse(body);
//   if (!parsed.success) {
//     return Response.json({ errors: parsed.error.issues }, { status: 400 });
//   }

//   try {
//     const [course] = await db
//       .insert(coursesTable)
//       .values(parsed.data)
//       .returning();

//     return Response.json(course, { status: 201 });
//   } catch (error) {
//     const pgError = error instanceof Error ? error.cause : undefined;
//     if (
//       pgError &&
//       typeof pgError === "object" &&
//       "code" in pgError &&
//       pgError.code === "23505"
//     ) {
//       return Response.json({ error: "El slug ya existe" }, { status: 409 });
//     }
//     throw error;
//   }
// }

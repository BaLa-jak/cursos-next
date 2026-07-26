import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// export const coursesTable = pgTable("courses", {
//   id: uuid().primaryKey().defaultRandom(),
//   // El slug va en la URL (/cursos/[slug]), por eso único.
//   slug: varchar({ length: 255 }).notNull().unique(),
//   title: varchar({ length: 255 }).notNull(),
//   description: text(),
//   // Dinero siempre en enteros. Un float pierde centavos al sumar.
//   priceCents: integer().notNull().default(0),
//   published: boolean().notNull().default(false),
//   createdAt: timestamp().notNull().defaultNow(),
// });

// // El tipo sale del schema. No lo dupliques a mano en types/.
// export type Course = typeof coursesTable.$inferSelect;

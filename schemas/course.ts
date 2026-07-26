import { z } from "zod";

export const createCourseSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9-]+$/, "solo minúsculas, números y guiones"),
  title: z.string().min(3).max(255),
  description: z.string().max(2000).optional(),
  priceCents: z.number().int().min(0),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

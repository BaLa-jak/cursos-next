import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

/**
 * Generates /sitemap.xml at build time.
 *
 * Only canonical, indexable routes are listed:
 *  - Homepage — `priority: 1.0`, updates daily.
 *  - Course catalog (`/courses`) and category index — high priority.
 *  - Sign-in/sign-up pages — listed so brand-search users can find them,
 *    but with a low priority so they don't outrank content.
 *
 * To extend this with course detail pages once they exist, fetch the course
 * slugs from the DB and map them to `URL`s with `lastModified` from the
 * updatedAt column. Keep the sitemap under 50,000 URLs per Google's limits.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/courses`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/category`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/signin`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}

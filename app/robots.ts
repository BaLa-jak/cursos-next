import type { MetadataRoute } from "next";

// Resolve once at module load: robots is statically generated (no
// request-time data), so env reads here are fine and zero-cost per request.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

/**
 * Generates /robots.txt at build time.
 *
 * Allow everything by default, block the typical private zones (API routes,
 * admin, internal accounts). The sitemap URL is always absolute so crawlers
 * can find it from a fresh crawl.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/private/", "/checkout"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

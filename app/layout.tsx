import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter, Noto_Serif } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";
import { CarritoRoot } from "@/components/carrito";

// ─── Site URL ────────────────────────────────────────────────────────────────
// Override in production via NEXT_PUBLIC_SITE_URL. Falls back to localhost
// in dev so metadataBase never throws and OG/Twitter URLs stay well-formed.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

const notoSerifHeading = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ─── Viewport ────────────────────────────────────────────────────────────────
// In Next.js 16 this is a separate, top-level export. Putting it in
// `metadata` triggers a deprecation warning.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// ─── Default metadata ────────────────────────────────────────────────────────
// Pages inherit `default` when they don't set their own title, and any page
// that does set a string title gets the template applied ("X · Cursos-next").
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cursos-next · Cursos prácticos en español para personas curiosas",
    template: "%s · Cursos-next",
  },
  description:
    "Editorial de cursos en español escritos por profesionales en activo. Cada programa se construye alrededor de proyectos reales, nunca de diapositivas, y pasa por un editor antes de salir al mundo.",
  applicationName: "Cursos-next",
  authors: [{ name: "Cursos-next" }],
  creator: "Cursos-next",
  publisher: "Cursos-next",
  category: "education",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "/",
    siteName: "Cursos-next",
    title: "Cursos-next · Cursos prácticos en español para personas curiosas",
    description:
      "Cursos escritos por profesionales en activo y construidos alrededor de proyectos reales. Aprende a tu ritmo, en español.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cursos-next · Cursos prácticos en español",
    description:
      "Programas escritos por profesionales en activo, con proyectos reales y revisión editorial. En español.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

// ─── Structured data ─────────────────────────────────────────────────────────
// JSON-LD for the publisher (Organization) and the site itself (WebSite).
// Rendered as <script type="application/ld+json"> inside <body>; both Google
// and Bing parse JSON-LD in body just fine.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cursos-next",
  url: SITE_URL,
  // `logo` omitted intentionally — add it once /logo.svg exists so the
  // knowledge panel can show a real image.
  sameAs: [
    // "https://twitter.com/cursos-next",
    // "https://www.linkedin.com/company/cursos-next",
    // "https://github.com/cursos-next",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: ["es-MX", "es-ES"],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Cursos-next",
  url: SITE_URL,
  inLanguage: "es-MX",
  // A potentialAction enables the Sitelinks Search Box in Google SERPs.
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/courses?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-MX"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
        notoSerifHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <CarritoRoot>
          <Navbar />
          {/* PageTransition envuelve SOLO {children} — navbar y footer son
              siblings dentro de CarritoRoot, así que quedan fuera de los
              snapshots de la View Transitions API y se mantienen estables
              como ancla visual durante toda la animación. */}
          <PageTransition>{children}</PageTransition>
          <Footer />
        </CarritoRoot>
        <Toaster />

        {/* Structured data — see consts above. dangerouslySetInnerHTML is
            safe here because the payloads are statically built from typed
            constants, never from user input. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </body>
    </html>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type TrendingCourse = {
  rank: string;
  cat: string;
  title: string;
  sub: string;
  author: string;
  time: string;
  level: string;
  price: string;
  trend: string;
  rating: string;
  enrolled: string;
};

const trendingCourses: TrendingCourse[] = [
  {
    rank: "01",
    cat: "Ingeniería",
    title: "Next.js 16: cache components en producción",
    sub: "PPR, use cache, cacheLife y boundaries. La nueva frontera del rendering, explicada sin ceremonias.",
    author: "Carmen Ríos",
    time: "18 h",
    level: "Avanzado",
    price: "$2,899",
    trend: "+312 esta semana",
    rating: "4.9",
    enrolled: "1,204",
  },
  {
    rank: "02",
    cat: "Datos",
    title: "Postgres para backends en producción",
    sub: "Conexiones, índices parciales, particionado. Lo que tu ORM no te cuenta.",
    author: "Lucía Marín",
    time: "13 h",
    level: "Intermedio",
    price: "$2,199",
    trend: "+287 esta semana",
    rating: "4.8",
    enrolled: "982",
  },
  {
    rank: "03",
    cat: "Diseño",
    title: "Sistemas de diseño multi-brand",
    sub: "Tokens semánticos, theming, white-label. La arquitectura antes que la pantalla.",
    author: "Daniel Ortega",
    time: "11 h",
    level: "Avanzado",
    price: "$2,499",
    trend: "+241 esta semana",
    rating: "4.9",
    enrolled: "756",
  },
  {
    rank: "04",
    cat: "Producto",
    title: "Growth sin teatro",
    sub: "Experimentación honesta, north star metrics y loops que no se rompen al primer rediseño.",
    author: "Andrés Vidal",
    time: "8 h",
    level: "Principiante",
    price: "$1,599",
    trend: "+198 esta semana",
    rating: "4.7",
    enrolled: "1,547",
  },
  {
    rank: "05",
    cat: "Ingeniería",
    title: "Web performance sin teatro",
    sub: "Core Web Vitals, profiling en producción, regresiones que sí importan.",
    author: "Pablo Cárdenas",
    time: "10 h",
    level: "Intermedio",
    price: "$1,899",
    trend: "+176 esta semana",
    rating: "4.8",
    enrolled: "643",
  },
  {
    rank: "06",
    cat: "Diseño",
    title: "Accesibilidad práctica, WCAG 2.2",
    sub: "Foco, teclado, semántica, contraste. Tests automatizados más auditoría manual.",
    author: "Elena Soto",
    time: "9 h",
    level: "Principiante",
    price: "$1,699",
    trend: "+154 esta semana",
    rating: "4.9",
    enrolled: "891",
  },
];

export function TrendingCourses() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const reveals = containerRef.current?.querySelectorAll<HTMLElement>(
          ".rise, .rise-s"
        );
        if (!reveals || reveals.length === 0) return;
        gsap.fromTo(
          reveals,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "expo.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  // Safety net: if GSAP never runs (JS error, plugin missing) the CSS
  // keeps .rise/.rise-s at opacity 0 forever. Force them visible so the
  // section stays readable. Matches the same pattern used in HomeLanding.
  useEffect(() => {
    const fallback = setTimeout(() => {
      const allReveals = containerRef.current?.querySelectorAll<HTMLElement>(
        ".rise, .rise-s"
      );
      allReveals?.forEach((el) => {
        if (getComputedStyle(el).opacity === "0") {
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      });
    }, 3000);
    return () => clearTimeout(fallback);
  }, []);

  return (
    <section
      ref={containerRef}
      aria-labelledby="trending-heading"
      className="border-t border-border px-6 py-20"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-wrap items-end justify-between gap-8 mb-12">
          <div className="space-y-4 max-w-[640px]">
            <div className="rise flex items-center gap-2 font-mono text-[11px] text-muted-foreground tracking-tight">
              <span className="pulse inline-block w-1.5 h-1.5 rounded-full bg-sky" />
              <span className="text-sky">En tendencia</span>
              <span className="opacity-50">·</span>
              <span>Actualizado cada hora</span>
            </div>
            <h2
              id="trending-heading"
              className="rise-s display text-[clamp(2rem,4.5vw,4.25rem)] leading-[1.05] text-foreground"
            >
              Lo que la comunidad está{" "}
              <span className="display-it text-sky">devorando</span> ahora mismo.
            </h2>
          </div>
          <Link
            href="/courses"
            transitionTypes={["nav-forward"]}
            className="under inline-flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap"
          >
            Ver el catálogo completo
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
            >
              <path
                d="M3 11L11 3M11 3H5M11 3V9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </Link>
        </div>

        <div className="rise-s grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {trendingCourses.map((c) => (
            <Link
              key={c.rank}
              href="/courses"
              transitionTypes={["nav-forward"]}
              className="cell py-7 px-7 flex flex-col justify-between min-h-[340px] bg-background"
            >
              {/* Top: trend + rank */}
              <div className="flex items-center justify-between font-mono text-[11px] tracking-tight">
                <span className="text-sky">{c.trend}</span>
                <span className="text-sky font-medium">N.º {c.rank}</span>
              </div>

              {/* Middle: cat + title + sub */}
              <div className="mt-6">
                <div className="font-mono text-[11px] text-muted-foreground tracking-tight">
                  {c.cat}
                </div>
                <h3 className="display text-[clamp(1.35rem,1.85vw,1.7rem)] mt-2 leading-[1.05] text-foreground max-w-[26ch]">
                  {c.title}
                </h3>
                <p className="text-[13px] leading-[1.5] text-muted-foreground max-w-[34ch] mt-3">
                  {c.sub}
                </p>
              </div>

              {/* Bottom: meta + price */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="text-[12px] text-muted-foreground">
                  {c.author} · {c.time} · {c.level}
                </div>
                {/* Stack en móvil — rating + enrolled + precio con
                    whitespace-nowrap no caben side-by-side en ≈242px de
                    ancho interno. En `sm:` vuelven a fila justificada. */}
                <div className="flex flex-col gap-2 mt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <span className="font-mono text-[10px] text-muted-foreground/70 tracking-tight whitespace-nowrap">
                    <span className="text-sky">★ {c.rating}</span>
                    <span> · {c.enrolled} estudiantes</span>
                  </span>
                  <span className="display text-[1.1rem] text-foreground whitespace-nowrap">
                    {c.price}{" "}
                    <span className="text-[0.6em] text-muted-foreground">
                      MXN
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrendingCourses;

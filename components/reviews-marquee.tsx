"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type Review = {
  text: string;
  author: string;
  role: string;
};

const reviewsTop: Review[] = [
  {
    text: "El curso de TypeScript me cambió la forma de escribir código. Los tipos condicionales y la inferencia ya no son un misterio.",
    author: "María Ferrer",
    role: "Frontend senior en Glovo",
  },
  {
    text: "Postgres para producto debería ser obligatorio para cualquier PM técnico. Entendí los índices y los CTEs en una tarde.",
    author: "Daniel Ortega",
    role: "Head of product en Cabify",
  },
  {
    text: "El cohorte de Diseño de Sistemas me dio el framework que necesitaba para escalar nuestro design system a cinco marcas.",
    author: "Lucía Marín",
    role: "Design lead en Wallapop",
  },
  {
    text: "Lancé mi SaaS con Next.js en seis semanas. El editor del programa te lleva de la mano desde el primer borrador.",
    author: "Andrés Vidal",
    role: "Founder en TravelgateX",
  },
  {
    text: "Discovery sin teatro me enseñó a hacer entrevistas que realmente enseñan. Mi tasa de insights útiles se triplicó.",
    author: "Carmen Ríos",
    role: "Product manager en Factorial",
  },
  {
    text: "La mentoría uno a uno es lo que marca la diferencia. No es otro curso más, es un acompañamiento real de profesionales en activo.",
    author: "Pablo Vega",
    role: "CTO en Typeform",
  },
];

const reviewsBottom: Review[] = [
  {
    text: "Vine por TypeScript y me quedé por la comunidad. El cohorte te obliga a terminar lo que empiezas.",
    author: "Elena Sánchez",
    role: "Backend senior en Glovo",
  },
  {
    text: "Pasé de no saber nada de Postgres a optimizar queries de producción en tres semanas. Los ejercicios con tests son clave.",
    author: "Javier Torres",
    role: "Engineering manager en Cabify",
  },
  {
    text: "Aprendí a construir design systems que sobreviven al contacto con desarrolladores. El módulo de tokens me ahorró meses.",
    author: "Sofía Delgado",
    role: "UX researcher en Wallapop",
  },
  {
    text: "El curso de Next.js en producción cubre todo lo que ningún tutorial te enseña: auth, pagos, multi-tenant, despliegue.",
    author: "Miguel Ángel Ruiz",
    role: "DevOps lead en TravelgateX",
  },
  {
    text: "Storytelling con datos me hizo mejor ingeniera. Ahora mis reportes los lee hasta el equipo de ventas.",
    author: "Isabel Moreno",
    role: "Data engineer en Factorial",
  },
  {
    text: "El manual editorial es una clase magistral de pedagogía por sí solo. Vale la pena el curso solo por eso.",
    author: "Carlos Mendoza",
    role: "Tech lead en Typeform",
  },
];

const EDGE_MASK =
  "mask-[linear-gradient(to_right,transparent_0,black_120px,black_calc(100%_-_120px),transparent_100%)]";

export function ReviewsMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const topTrackRef = useRef<HTMLDivElement>(null);
  const bottomTrackRef = useRef<HTMLDivElement>(null);
  const topTweenRef = useRef<gsap.core.Tween | null>(null);
  const bottomTweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (topTrackRef.current) {
          topTweenRef.current = gsap.fromTo(
            topTrackRef.current,
            { xPercent: -50 },
            { xPercent: 0, duration: 45, ease: "none", repeat: -1 }
          );
        }

        if (bottomTrackRef.current) {
          bottomTweenRef.current = gsap.fromTo(
            bottomTrackRef.current,
            { xPercent: 0 },
            { xPercent: -50, duration: 38, ease: "none", repeat: -1 }
          );
        }
      });
    },
    { scope: containerRef }
  );

  useEffect(() => {
    const topEl = topTrackRef.current;
    const bottomEl = bottomTrackRef.current;
    if (!topEl || !bottomEl) return;

    const onEnterTop = () => topTweenRef.current?.pause();
    const onLeaveTop = () => topTweenRef.current?.resume();
    const onEnterBottom = () => bottomTweenRef.current?.pause();
    const onLeaveBottom = () => bottomTweenRef.current?.resume();

    topEl.addEventListener("mouseenter", onEnterTop);
    topEl.addEventListener("mouseleave", onLeaveTop);
    bottomEl.addEventListener("mouseenter", onEnterBottom);
    bottomEl.addEventListener("mouseleave", onLeaveBottom);

    return () => {
      topEl.removeEventListener("mouseenter", onEnterTop);
      topEl.removeEventListener("mouseleave", onLeaveTop);
      bottomEl.removeEventListener("mouseenter", onEnterBottom);
      bottomEl.removeEventListener("mouseleave", onLeaveBottom);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      aria-labelledby="reviews-heading"
      className="border-t border-border py-20 overflow-hidden"
    >
      <div className="mx-auto max-w-[1320px] px-6 mb-12">
        <h2
          id="reviews-heading"
          className="rise-s display text-[clamp(2rem,4.5vw,4.25rem)] max-w-[20ch] text-foreground"
        >
          Lo que dicen nuestros alumnos
        </h2>
      </div>

      {}
      <div className={`overflow-hidden ${EDGE_MASK}`}>
        <div ref={topTrackRef} className="flex w-max gap-6 py-4">
          {[...reviewsTop, ...reviewsTop].map((r, i) => (
            <ReviewCard key={i} {...r} />
          ))}
        </div>
      </div>

      {}
      <div className={`overflow-hidden ${EDGE_MASK} mt-6`}>
        <div ref={bottomTrackRef} className="flex w-max gap-6 py-4">
          {[...reviewsBottom, ...reviewsBottom].map((r, i) => (
            <ReviewCard key={i} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ text, author, role }: Review) {
  return (
    <article className="shrink-0 w-[380px] p-7 bg-background border border-border flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <svg
          className="text-sky shrink-0"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
        </svg>
        <span
          className="text-sky text-sm tracking-tight"
          aria-label="Valoración 5 sobre 5"
        >
          ★★★★★
        </span>
      </div>
      <p className="text-foreground leading-relaxed text-[15px] grow">“{text}”</p>
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <div className="size-9 rounded-full bg-sky text-sky-ink grid place-items-center font-heading text-sm shrink-0">
          {author.charAt(0)}
        </div>
        <div>
          <div className="text-sm text-foreground font-medium">{author}</div>
          <div className="text-xs text-muted-foreground">{role}</div>
        </div>
      </div>
    </article>
  );
}
"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { ReviewsMarquee } from "@/components/reviews-marquee";

gsap.registerPlugin(ScrollTrigger);

const tickerItems = [
  "TypeScript avanzado",
  "Postgres para producto",
  "Diseño de sistemas",
  "Discovery sin teatro",
  "Next.js en producción",
  "Estrategia de pricing",
  "Color y tipografía",
  "Web performance",
  "Accesibilidad práctica",
  "Liderazgo remoto",
  "Storytelling con datos",
  "Arquitectura hexagonal",
];

const featured = {
  n: "05",
  cat: "Ingeniería",
  title: "Lanza un SaaS con Next.js",
  sub: "Auth, pagos, multi-tenant, despliegue. Sin plantillas mágicas, con tests desde el día uno.",
  author: "Carmen Ríos",
  cohort: "Cohorte 03: abre el 15 de marzo",
  time: "22 h",
  level: "Intermedio",
  price: "$3,199",
};

const courses = [
  {
    n: "01",
    cat: "Ingeniería",
    title: "TypeScript avanzado, sin la mystique",
    sub: "Tipos condicionales, plantillas recursivas, inferencia práctica.",
    author: "María Ferrer",
    time: "14 h",
    level: "Intermedio",
    price: "$1,899",
  },
  {
    n: "02",
    cat: "Diseño",
    title: "Sistemas visuales que escalan",
    sub: "Tokens, theming, multi-brand. La arquitectura antes que la pantalla.",
    author: "Daniel Ortega",
    time: "9 h",
    level: "Avanzado",
    price: "$2,499",
  },
  {
    n: "03",
    cat: "Datos",
    title: "Postgres para gente de producto",
    sub: "Índices, window functions, CTEs. SQL que tu equipo puede mantener.",
    author: "Lucía Marín",
    time: "11 h",
    level: "Intermedio",
    price: "$2,099",
  },
  {
    n: "04",
    cat: "Producto",
    title: "Discovery sin teatro",
    sub: "Entrevistas, jobs to be done, prototipos de baja fidelidad que sí enseñan.",
    author: "Andrés Vidal",
    time: "7 h",
    level: "Principiante",
    price: "$1,499",
  },
];

const steps = [
  {
    n: "1",
    title: "Elige",
    desc: "Explora el catálogo o contesta ocho preguntas; te recomendamos tres puntos de entrada honestos.",
  },
  {
    n: "2",
    title: "Estudia",
    desc: "Lecciones cortas, ejercicios con tests, proyectos en repositorios públicos desde el primer día.",
  },
  {
    n: "3",
    title: "Aplica",
    desc: "Recibe feedback de un mentor real y construye un portfolio verificable, no una colección de diplomas.",
  },
  {
    n: "4",
    title: "Comparte",
    desc: "Publica tu proyecto, recibe una insignia enlazable y conéctate con gente que está en lo mismo.",
  },
];

const instructorStats = [
  { n: "80 %", l: "Para el instructor" },
  { n: "$0 MXN", l: "Coste de entrada" },
  { n: "6 sem", l: "De idea a cohorte" },
];

const ARROW_PATH = "M3 13L13 3M13 3H6M13 3V10";

let cachedDateString = "";

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
};

function getClientDateSnapshot(): string {
  if (!cachedDateString) {
    cachedDateString = new Date()
      .toLocaleDateString("es-ES", DATE_FORMAT_OPTIONS)
      .replace(/^./, (c) => c.toUpperCase());
  }
  return cachedDateString;
}

function getServerDateSnapshot(): string {
  return "";
}

export function HomeLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeTweenRef = useRef<gsap.core.Tween | null>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  const dateString = useSyncExternalStore(
    () => () => {},
    getClientDateSnapshot,
    getServerDateSnapshot,
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const sections = gsap.utils.toArray<HTMLElement>(
          "section",
          containerRef.current
        );

        sections.forEach((section) => {
          const reveals = section.querySelectorAll<HTMLElement>(".rise, .rise-s");
          if (reveals.length === 0) return;
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
                trigger: section,
                start: "top 95%",
                once: true,
              },
            }
          );
        });

        if (counterRef.current) {
          const counter = { value: 0 };
          gsap.to(counter, {
            value: 262000,
            duration: 2.2,
            ease: "expo.out",
            scrollTrigger: {
              trigger: counterRef.current,
              start: "top 90%",
              once: true,
            },
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = Math.round(counter.value)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
            },
          });
        }

        if (marqueeRef.current) {
          marqueeTweenRef.current = gsap.to(marqueeRef.current, {
            xPercent: -50,
            duration: 42,
            ease: "none",
            repeat: -1,
          });
        }

        gsap.utils.toArray<HTMLElement>(".pulse").forEach((el) => {
          gsap.to(el, {
            scale: 0.7,
            opacity: 0.35,
            duration: 0.7,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });
      });
    },
    { scope: containerRef }
  );

  useEffect(() => {
    const timer = setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    const el = marqueeRef.current;
    const tween = marqueeTweenRef.current;
    if (!el || !tween) return;
    const onEnter = () => tween.pause();
    const onLeave = () => tween.resume();
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <noscript>
        <style>{`.rise, .rise-s { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>
      <div ref={containerRef} className="bg-background text-foreground flex-1 flex flex-col">
        {}
        <div className="border-b border-border flex items-center gap-4 overflow-hidden font-mono h-[34px] px-6 text-muted-foreground text-xs">
          <span className="flex items-center gap-2 shrink-0">
            <span className="pulse inline-block w-1.5 h-1.5 rounded-full bg-sky" />
            {}
            <span className="hidden sm:inline">En directo</span>
          </span>
          <span className="hidden sm:inline shrink-0 opacity-40">·</span>
          <span className="hidden sm:inline shrink-0">{dateString}</span>
          <span className="hidden sm:inline shrink-0 opacity-40">·</span>
          <div
            className="flex-1 min-w-0 overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0, black 32px, black calc(100% - 32px), transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0, black 32px, black calc(100% - 32px), transparent 100%)",
            }}
          >
            <div ref={marqueeRef} className="flex w-max items-center gap-6">
              {[...tickerItems, ...tickerItems].map((t, i) => (
                <span key={i} className="shrink-0 flex items-center gap-6 tracking-tight">
                  <span>{t}</span>
                  <span className="text-sky opacity-70">✦</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {}
        <section className="px-6 py-20 md:py-24">
          <div className="mx-auto max-w-[1320px]">
            <div className="rise flex flex-wrap items-center gap-3">
              <span className="inline-block w-8 h-px bg-foreground-2" />
              <span className="text-muted-foreground tracking-tight">16 plazas nuevas esta semana</span>
            </div>

            <h1 className="rise display mt-10 text-[clamp(3rem,9.5vw,8.75rem)] max-w-[16ch] text-foreground">
              Aprende lo que importa, enseñado por quienes{" "}
              <span className="display-it text-sky">ya lo hicieron.</span>
            </h1>

            <div className="rise mt-12 grid gap-12 grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-end">
              <p className="text-[clamp(1.05rem,1.3vw,1.25rem)] leading-[1.55] max-w-[52ch] text-muted-foreground">
                Una editorial de cursos en español para personas curiosas. Cada programa está escrito por profesionales en activo, revisado por un editor y construido alrededor de proyectos reales, no de diapositivas. Sin gurus, sin recetas mágicas, sin cajas de arena cerradas.
              </p>
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/courses"
                    transitionTypes={["nav-forward"]}
                    className="group inline-flex items-center justify-between gap-8 text-sm py-4 px-5 bg-foreground text-background min-w-[260px]"
                  >
                    <span>Explorar el catálogo</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path d={ARROW_PATH} stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                    </svg>
                  </Link>
                  <Link
                    href="#instructores"
                    transitionTypes={["nav-forward"]}
                    className="group inline-flex items-center justify-between gap-8 text-sm py-4 px-5 border border-foreground text-foreground min-w-[260px]"
                  >
                    <span>Convertirme en instructor</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path d={ARROW_PATH} stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                    </svg>
                  </Link>
                </div>
                <p className="font-mono text-xs text-muted-foreground/70 tracking-tight">
                  Sin tarjeta. Acceso a 3 cursos gratis para siempre.
                </p>
              </div>
            </div>

            {}
            <div className="rise mt-20 grid gap-6 grid-cols-1 items-center pt-6 border-t border-border">
              <div className="text-sm text-muted-foreground/70">Estudiado en</div>
              <div className="grid grid-cols-2 md:grid-cols-6 border-y border-border">
                {["Glovo", "Cabify", "Wallapop", "Typeform", "Factorial", "TravelgateX"].map((name, i) => {
                  const showRightBorder = i % 2 === 0;
                  const showBottomBorder = i < 4;
                  return (
                    <span
                      key={name}
                      className={cn(
                        "py-6 text-[15px] text-muted-foreground text-center tracking-tight",
                        showRightBorder && "border-r border-border md:border-r-0",
                        showBottomBorder && "border-b border-border md:border-b-0"
                      )}
                    >
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {}
        <section id="manifiesto" className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-[1320px]">
            <p className="rise-s display text-[clamp(1.85rem,4.2vw,3.85rem)] leading-[1.05] max-w-[24ch] text-foreground">
              No memorices. Resuelve. Cada curso termina con un proyecto en un repositorio público, revisado por un humano, no por un{" "}
              <span className="display-it text-sky">algoritmo de aprobación</span>.
            </p>
            <div className="rise-s mt-12 flex items-center gap-4 flex-wrap">
              <div className="display w-11 h-11 rounded-full bg-sky grid place-items-center text-sky-ink text-sm">
                E
              </div>
              <div>
                <div className="text-sm text-foreground">Equipo editorial</div>
                <div className="font-mono text-[10px] text-muted-foreground/70 tracking-tight">
                  16 personas · 7 países
                </div>
              </div>
              <a href="#" className="under ml-auto text-sm text-muted-foreground">
                Leer el manifiesto completo →
              </a>
            </div>
          </div>
        </section>

        {}
        <section className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-[1320px]">
            <div className="flex flex-wrap items-end justify-between gap-8 mb-12">
              <h2 className="rise-s display text-[clamp(2rem,4.5vw,4.25rem)] max-w-[20ch] text-foreground">
                Lo que se está cocinando este mes
              </h2>
              <Link
                href="/courses"
                transitionTypes={["nav-forward"]}
                className="under inline-flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap"
              >
                Ver los 240 cursos
                <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
                  <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </Link>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-px bg-border border border-border">
              {}
              <Link
                href="/courses"
                transitionTypes={["nav-forward"]}
                className="cell py-10 px-8 flex flex-col justify-between min-h-[440px] relative"
              >
                <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground tracking-tight">
                  <span className="text-sky">★ Destacado</span>
                  <span>N.º {featured.n}</span>
                </div>
                <div className="flex items-start gap-6 mt-8">
                  {}
                  <span className="display text-[clamp(2.75rem,9vw,8rem)] leading-[0.85] text-sky">
                    {featured.n}
                  </span>
                  <div className="pt-1">
                    <div className="font-mono text-[11px] text-muted-foreground tracking-tight">{featured.cat}</div>
                    <h3 className="display text-[clamp(1.5rem,2.2vw,2.25rem)] mt-2 leading-[1.05] text-foreground">
                      {featured.title}
                    </h3>
                  </div>
                </div>
                <p className="text-base leading-[1.5] text-muted-foreground max-w-[44ch] mt-8">
                  {featured.sub}
                </p>
                {}
                <div className="flex flex-col gap-2 mt-8 pt-5 border-t border-border sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="text-[13px] text-muted-foreground">
                    {featured.author} · {featured.time} · {featured.level}
                  </div>
                  <div className="display text-2xl text-foreground">
                    {featured.price} <span className="text-[0.6em] text-muted-foreground">MXN</span>
                  </div>
                </div>
              </Link>

              {}
              <div className="flex flex-col">
                {courses.map((c) => (
                  <Link
                    key={c.n}
                    href="/courses"
                    transitionTypes={["nav-forward"]}
                    className="cell py-7 px-8 flex flex-col justify-between min-h-[180px] border-t border-border md:border-t-px"
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground tracking-tight">
                      <span>{c.cat}</span>
                      <span>N.º {c.n}</span>
                    </div>
                    <h3 className="display text-[clamp(1.15rem,1.6vw,1.5rem)] mt-3 leading-[1.1] text-foreground max-w-[32ch]">
                      {c.title}
                    </h3>
                    {}
                    <div className="flex flex-col gap-2 mt-3 text-[13px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <span>
                        {c.author} · {c.time}
                      </span>
                      <span className="display text-[1.05rem] text-foreground">
                        {c.price} <span className="text-[0.7em] text-muted-foreground">MXN</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rise-s mt-6 flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground/70 tracking-tight">
              <span>Categorías:</span>
              {["Ingeniería", "Diseño", "Datos", "Producto", "Marketing", "Investigación", "Operaciones"].map(
                (c) => (
                  <a key={c} href="#" className="under text-muted-foreground">
                    {c}
                  </a>
                )
              )}
            </div>
          </div>
        </section>

        {}
        <section id="como-funciona" className="border-t border-border px-6 py-20">
          <div className="mx-auto max-w-[1320px]">
            <h2 className="rise-s display text-[clamp(1.85rem,4vw,3.5rem)] leading-[1.05] max-w-[22ch] text-foreground mb-14">
              Cuatro pasos. La mayor parte del trabajo ocurre en tu editor, no en la plataforma.
            </h2>

            <ol className="steps-grid">
              {steps.map((s) => (
                <li key={s.n} className="py-8 px-7 flex flex-col gap-6 min-h-[260px] justify-between">
                  <div className="flex items-center justify-between">
                    <span className="display text-[3.25rem] text-sky leading-[0.9]">
                      {s.n}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground/70 tracking-tight">
                      Paso {s.n} de 4
                    </span>
                  </div>
                  <div>
                    <h3 className="display text-2xl text-foreground mb-2.5">{s.title}</h3>
                    <p className="text-sm leading-[1.55] text-muted-foreground">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {}
        <section id="instructores" className="border-t border-border bg-foreground text-background px-6 py-20">
          <div className="mx-auto max-w-[1320px]">
            <div className="grid gap-14 grid-cols-1 md:grid-cols-[1.05fr_1fr] lg:grid-cols-2 items-start">
              <div>
                <h2 className="rise-s display text-[clamp(2rem,4.5vw,4rem)] text-background leading-[1]">
                  Enseña lo que sabes. Cobra el{" "}
                  <span className="display-it text-sky">80 %</span> de cada matrícula.
                </h2>
                <p className="mt-7 text-[1.05rem] leading-[1.55] text-white/72 max-w-[44ch]">
                  Sin vídeo pre-grabado genérico, sin PDF de doscientas páginas. Un editor te acompaña desde el primer borrador hasta el primer cohorte, y la plataforma se ocupa de pagos, cohortes y soporte.
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link
                    href="/signin"
                    transitionTypes={["nav-forward"]}
                    className="group inline-flex items-center justify-between gap-8 text-sm py-4 px-5 bg-background text-foreground min-w-[240px]"
                  >
                    <span>Empezar a enseñar</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path d={ARROW_PATH} stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                    </svg>
                  </Link>
                  <Link
                    href="#manifiesto"
                    transitionTypes={["nav-forward"]}
                    className="group inline-flex items-center justify-between gap-8 text-sm py-4 px-5 border border-background text-background min-w-[240px]"
                  >
                    <span>Leer el manual editorial</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path d={ARROW_PATH} stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-10">
                <div>
                  <div className="font-mono text-[11px] text-white/50 tracking-tight">
                    Ingreso medio por cohorte
                  </div>
                  <div className="display mt-2 text-[clamp(5rem,12vw,10.5rem)] leading-[0.85] text-background tracking-[-0.04em]">
                    <span ref={counterRef}>0</span>
                    <span className="font-mono text-[0.18em] ml-1.5 text-sky tracking-[0.06em] align-top">
                      MXN
                    </span>
                  </div>
                  <div className="mt-3 text-[13px] text-white/60 max-w-[40ch]">
                    Mediana de los 47 instructores activos durante los últimos doce meses. Sin outliers inflados, sin proyecciones.
                  </div>
                </div>

                <div className="grid grid-cols-1 border border-white/20 sm:grid-cols-3 divide-y divide-white/20 sm:divide-y-0 sm:divide-x">
                  {instructorStats.map((s) => (
                    <div key={s.l} className="py-5 px-4">
                      <div className="display text-[1.85rem] text-background">{s.n}</div>
                      <div className="font-mono text-[10px] text-white/55 tracking-tight mt-2">
                        {s.l}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {}
        <ReviewsMarquee />

        {}
        <section className="border-t border-border px-6 py-28 md:py-40 text-center">
          <div className="mx-auto max-w-[900px]">
            <div className="rise inline-flex items-center gap-3 text-muted-foreground">
              <span className="inline-block w-8 h-px bg-foreground-2" />
              <span className="tracking-tight">Empieza</span>
              <span className="inline-block w-8 h-px bg-foreground-2" />
            </div>
            <h2 className="rise display mt-8 text-[clamp(2.5rem,7.5vw,6.5rem)] leading-[0.95] text-foreground">
              Tu próximo capítulo{" "}
              <span className="display-it text-sky">empieza con un curso</span>.
            </h2>
            <div className="rise mt-12 flex flex-wrap gap-3 justify-center">
              <Link
                href="/signin"
                transitionTypes={["nav-forward"]}
                className="group inline-flex items-center gap-3 text-sm py-4 px-6 bg-foreground text-background"
              >
                <span>Crear cuenta gratis</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path d={ARROW_PATH} stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </Link>
              <Link
                href="/courses"
                transitionTypes={["nav-forward"]}
                className="inline-flex items-center gap-3 text-sm py-4 px-6 border border-foreground text-foreground"
              >
                Solo quiero mirar
              </Link>
            </div>
            <p className="rise mt-7 font-mono text-[11px] text-muted-foreground/70 tracking-tight">
              14 días de prueba · Cancela cuando quieras · Sin letra pequeña
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

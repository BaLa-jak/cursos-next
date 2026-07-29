import { BookOpen, MessagesSquare, ScrollText } from "lucide-react";

const benefits = [
  {
    icon: BookOpen,
    title: "Catálogo completo desde el primer día",
    description:
      "Acceso inmediato a todos los cursos publicados y a los nuevos lanzamientos mientras dure tu membresía.",
  },
  {
    icon: MessagesSquare,
    title: "Comunidad y mentores en activo",
    description:
      "Pregunta, comparte tu progreso y resuelve dudas con profesionales que ya trabajan en lo que enseñan.",
  },
  {
    icon: ScrollText,
    title: "Certificados al terminar cada ruta",
    description:
      "Avala tu aprendizaje con un certificado verificable que puedes añadir a tu perfil o compartir.",
  },
];

export function Showcase() {
  return (
    <aside
      aria-label="Beneficios de crear una cuenta"
      className="relative hidden overflow-hidden bg-muted/40 lg:flex lg:flex-col lg:justify-between"
    >
      {/* Misma marca decorativa que la página de login: mantiene coherencia
          visual entre las dos vistas sin añadir ruido. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 select-none text-[16rem] font-heading leading-none text-foreground/[0.04]"
      >
        ✦
      </div>

      <div className="relative z-10 flex h-full flex-col gap-12 p-10 xl:p-14">
        {/* Encabezado */}
        <div className="flex items-center gap-2.5">
          <span className="inline-flex size-9 items-center justify-center rounded-md bg-foreground text-background">
            <BookOpen className="size-5" aria-hidden />
          </span>
          <span className="text-lg font-heading font-semibold tracking-tight">
            cursos-next
          </span>
        </div>

        {/* Beneficios — elijo lista de 3 frente a un único titular porque en
            una pantalla de registro el usuario necesita razones concretas
            para completar el alta, no solo una promesa. */}
        <div className="mt-auto space-y-8">
          <h1 className="max-w-md text-balance text-2xl font-heading font-semibold leading-tight tracking-tight xl:text-3xl">
            Únete a la plataforma donde se aprende construyendo, no mirando.
          </h1>
          <ul className="space-y-5">
            {benefits.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-foreground">
                  <Icon className="size-4" aria-hidden />
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-snug">{title}</p>
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
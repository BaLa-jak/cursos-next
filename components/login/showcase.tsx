import { GraduationCap } from "lucide-react";

export function Showcase() {
  return (
    <aside
      aria-label="Presentación de la plataforma"
      className="relative hidden overflow-hidden bg-muted/40 lg:flex lg:flex-col lg:justify-between"
    >
      {}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 select-none text-[16rem] font-heading leading-none text-foreground/[0.04]"
      >
        ✦
      </div>

      <div className="relative z-10 flex h-full flex-col gap-12 p-10 xl:p-14">
        {}
        <div className="flex items-center gap-2.5">
          <span className="inline-flex size-9 items-center justify-center rounded-md bg-foreground text-background">
            <GraduationCap className="size-5" aria-hidden />
          </span>
          <span className="text-lg font-heading font-semibold tracking-tight">
            cursos-next
          </span>
        </div>

        {}
        <div className="mt-auto space-y-4">
          <h1 className="max-w-md text-balance text-2xl font-heading font-semibold leading-tight tracking-tight xl:text-3xl">
            Aprende haciendo, con proyectos reales y mentores que ya lo hicieron.
          </h1>
          <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
            Cursos prácticos en ingeniería, diseño, datos y producto. Sin diapositivas, sin gurus, sin cajas de arena cerradas.
          </p>
        </div>
      </div>
    </aside>
  );
}
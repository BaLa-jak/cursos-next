import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  Heart,
  Rocket,
  Send,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type FooterLink = {
  label: string;
  href: string;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

const footerColumns: FooterColumn[] = [
  {
    title: "Producto",
    links: [
      { label: "Todos los cursos", href: "/cursos" },
      { label: "Rutas de aprendizaje", href: "/rutas" },
      { label: "Proyectos prácticos", href: "/proyectos" },
      { label: "Mentorías 1:1", href: "/mentorias" },
      { label: "Certificaciones", href: "/certificaciones" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Tutoriales", href: "/tutoriales" },
      { label: "Documentación", href: "/docs" },
      { label: "Comunidad", href: "/comunidad" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Compañía",
    links: [
      { label: "Sobre nosotros", href: "/sobre-nosotros" },
      { label: "Equipo", href: "/equipo" },
      { label: "Contacto", href: "/contacto" },
      { label: "Empleos", href: "/empleos" },
      { label: "Prensa", href: "/prensa" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacidad", href: "/privacidad" },
      { label: "Términos", href: "/terminos" },
      { label: "Cookies", href: "/cookies" },
      { label: "Licencias", href: "/licencias" },
      { label: "Reembolsos", href: "/reembolsos" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Newsletter section */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GraduationCap className="size-5" aria-hidden />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                cursos-next
              </span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Aprende Next.js con cursos prácticos, proyectos reales y una
              comunidad que te acompaña desde el primer deploy hasta producción.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="size-4 text-primary" aria-hidden />
              <h3 className="text-sm font-semibold">Mantente actualizado</h3>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              Recibe cada semana un nuevo tutorial, recursos seleccionados
              y novedades del ecosistema Next.js. Sin spam, cancela cuando
              quieras.
            </p>
            <form action="#" className="space-y-3">
              <FieldGroup>
                <Field orientation="responsive">
                  <FieldLabel htmlFor="footer-newsletter-email" className="sr-only">
                    Email
                  </FieldLabel>
                  <Input
                    id="footer-newsletter-email"
                    name="email"
                    type="email"
                    required
                    placeholder="tu@email.com"
                    autoComplete="email"
                  />
                  <Button type="submit" className="w-full sm:w-auto">
                    Suscribirme
                    <Send className="size-3.5" aria-hidden />
                  </Button>
                </Field>
              </FieldGroup>
              <FieldDescription>
                Al suscribirte aceptas recibir correos de cursos-next.
              </FieldDescription>
            </form>
          </div>
        </div>

        <Separator className="my-10" />

        {/* Links grid */}
        <nav
          aria-label="Enlaces del footer"
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {footerColumns.map((column) => {
            return (
              <div key={column.title} className="space-y-4">
                <h3 className="text-sm font-semibold tracking-wide">
                  {column.title}
                </h3>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        transitionTypes={["nav-forward"]}
                        className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <span>{link.label}</span>
                        <ArrowRight
                          className="size-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>

        <Separator className="my-8" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted-foreground">
            © {year} cursos-next. Todos los derechos reservados.
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            Hecho con
            <Heart
              className="size-3 fill-destructive text-destructive"
              aria-hidden
            />
            y mucho
            <Rocket className="size-3" aria-hidden />
            para la comunidad.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

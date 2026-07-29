import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

import { SigninForm } from "@/components/signin/signin-form";
import { Showcase } from "@/components/signin/showcase";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description:
    "Regístrate gratis en Cursos-next y empezá una ruta de aprendizaje práctica, con mentores en activo y proyectos reales.",
  robots: { index: true, follow: true },
};

export default function SigninPage() {
  return (
    <main className="grid min-h-[calc(100vh-4rem)] w-full lg:grid-cols-2">
      <Showcase />

      <section className="flex items-center justify-center bg-background px-5 py-10 sm:px-8 sm:py-14 lg:py-20">
        <div className="w-full max-w-sm">
          {}
          <Link
            href="/"
            transitionTypes={["nav-back"]}
            className="mb-8 inline-flex items-center gap-2 lg:hidden"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GraduationCap className="size-4" aria-hidden />
            </span>
            <span className="text-base font-heading font-semibold tracking-tight">
              cursos-next
            </span>
          </Link>

          <SigninForm />
        </div>
      </section>
    </main>
  );
}
import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

import { LoginForm } from "@/components/login/login-form";
import { Showcase } from "@/components/login/showcase";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description:
    "Accedé a tu cuenta de Cursos-next para continuar con tu ruta de aprendizaje.",
};

export default function LoginPage() {
  return (
    <main className="grid min-h-[calc(100vh-4rem)] w-full lg:grid-cols-2">
      <Showcase />

      <section className="flex items-center justify-center bg-background px-5 py-10 sm:px-8 sm:py-14 lg:py-20">
        <div className="w-full max-w-sm">
          {/* Mobile-only brand */}
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

          <LoginForm />
        </div>
      </section>
    </main>
  );
}

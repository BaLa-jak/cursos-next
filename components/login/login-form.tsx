"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon, GithubIcon } from "@/components/login/brand-icons";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending] = useState(false);

  // 👇 Aquí conectas la lógica de autenticación (server action, better-auth, etc.)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const remember = formData.get("remember") === "on";
    console.log({ email, password, remember });
    // TODO: tu lógica de login aquí
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <header className="space-y-2">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <KeyRound className="size-3.5" aria-hidden />
          Iniciar sesión
        </p>
        <h2 className="text-2xl font-heading font-semibold tracking-tight sm:text-3xl">
          Bienvenido de vuelta
        </h2>
        <p className="text-sm text-muted-foreground">
          Ingresa a tu cuenta para continuar con tu ruta de aprendizaje.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="grid grid-cols-2 gap-2.5">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            // TODO: lógica OAuth Google
          >
            <GoogleIcon className="size-4" />
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            // TODO: lógica OAuth GitHub
          >
            <GithubIcon className="size-4" />
            GitHub
          </Button>
        </div>

        <FieldSeparator>
          <span className="bg-background px-2 text-xs uppercase tracking-wider text-muted-foreground">
            o con tu email
          </span>
        </FieldSeparator>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="login-email">Email</FieldLabel>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <Mail className="size-4" aria-hidden />
              </InputGroupAddon>
              <InputGroupInput
                id="login-email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
                required
              />
            </InputGroup>
          </Field>

          <Field>
            <div className="flex items-center justify-between gap-2">
              <FieldLabel htmlFor="login-password">Contraseña</FieldLabel>
              <Link
                href="/forgot-password"
                transitionTypes={["nav-forward"]}
                className="text-xs font-medium text-primary underline-offset-4 hover:underline"
              >
                ¿La olvidaste?
              </Link>
            </div>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <LockKeyhole className="size-4" aria-hidden />
              </InputGroupAddon>
              <InputGroupInput
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                minLength={8}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden />
                  ) : (
                    <Eye className="size-4" aria-hidden />
                  )}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <FieldDescription>Mínimo 8 caracteres.</FieldDescription>
          </Field>

          <div className="flex items-center gap-2">
            <Checkbox id="login-remember" name="remember" />
            <Label
              htmlFor="login-remember"
              className="text-sm font-normal text-muted-foreground"
            >
              Recordarme en este dispositivo
            </Label>
          </div>
        </FieldGroup>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Iniciando sesión…
            </>
          ) : (
            <>
              Iniciar sesión
              <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </Button>
      </form>

      <div className="space-y-4">
        <Separator />
        <p className="text-center text-sm text-muted-foreground">
          ¿Aún no tienes cuenta?{" "}
          <Link
            href="/signin"
            transitionTypes={["nav-forward"]}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Crea una gratis
          </Link>
        </p>
      </div>
    </div>
  );
}

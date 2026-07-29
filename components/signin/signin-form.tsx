"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserPlus,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon, GithubIcon } from "@/components/login/brand-icons";

export function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const terms = formData.get("terms") === "on";

    if (password !== confirmPassword) {
      setConfirmError("Las contraseñas no coinciden.");
      return;
    }
    setConfirmError(null);

    console.log({ name, email, password, terms });
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <header className="space-y-2">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <UserPlus className="size-3.5" aria-hidden />
          Crear cuenta
        </p>
        <h2 className="text-2xl font-heading font-semibold tracking-tight sm:text-3xl">
          Empieza tu ruta hoy
        </h2>
        <p className="text-sm text-muted-foreground">
          Crea una cuenta gratis para guardar tu progreso, comentar dudas y
          acceder a todo el catálogo.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="grid grid-cols-2 gap-2.5">
          <Button
            type="button"
            variant="outline"
            className="w-full"
          >
            <GoogleIcon className="size-4" />
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
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
            <FieldLabel htmlFor="signin-name">Nombre completo</FieldLabel>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <UserRound className="size-4" aria-hidden />
              </InputGroupAddon>
              <InputGroupInput
                id="signin-name"
                name="name"
                type="text"
                placeholder="Ada Lovelace"
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
              />
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="signin-email">Email</FieldLabel>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <Mail className="size-4" aria-hidden />
              </InputGroupAddon>
              <InputGroupInput
                id="signin-email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
                required
              />
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="signin-password">Contraseña</FieldLabel>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <LockKeyhole className="size-4" aria-hidden />
              </InputGroupAddon>
              <InputGroupInput
                id="signin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                minLength={8}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
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

          <Field data-invalid={confirmError ? true : undefined}>
            <FieldLabel htmlFor="signin-confirm">Repite la contraseña</FieldLabel>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <ShieldCheck className="size-4" aria-hidden />
              </InputGroupAddon>
              <InputGroupInput
                id="signin-confirm"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                minLength={8}
                aria-invalid={confirmError ? true : undefined}
                aria-describedby={confirmError ? "signin-confirm-error" : undefined}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  aria-label={
                    showConfirm
                      ? "Ocultar confirmación"
                      : "Mostrar confirmación"
                  }
                  aria-pressed={showConfirm}
                  onClick={() => setShowConfirm((v) => !v)}
                >
                  {showConfirm ? (
                    <EyeOff className="size-4" aria-hidden />
                  ) : (
                    <Eye className="size-4" aria-hidden />
                  )}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            {confirmError ? (
              <FieldError id="signin-confirm-error">{confirmError}</FieldError>
            ) : (
              <FieldDescription>
                Debe coincidir con la contraseña anterior.
              </FieldDescription>
            )}
          </Field>

          <div className="flex items-start gap-2">
            <Checkbox
              id="signin-terms"
              name="terms"
              required
              className="mt-0.5"
            />
            <Label
              htmlFor="signin-terms"
              className="text-sm font-normal leading-snug text-muted-foreground"
            >
              Acepto los{" "}
              <Link
                href="/terms"
                transitionTypes={["nav-forward"]}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Términos
              </Link>{" "}
              y la{" "}
              <Link
                href="/privacy"
                transitionTypes={["nav-forward"]}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Política de privacidad
              </Link>
              .
            </Label>
          </div>
        </FieldGroup>

        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Creando cuenta…
            </>
          ) : (
            <>
              Crear cuenta
              <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </Button>
      </form>

      <div className="space-y-4">
        <Separator />
        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            transitionTypes={["nav-forward"]}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
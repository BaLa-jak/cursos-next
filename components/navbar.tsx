"use client";

import Link from "next/link";
import { GraduationCap, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CarritoTrigger } from "@/components/carrito";
import { cn } from "@/lib/utils";

type NavLink = {
  label: string;
  href: string;
  description?: string;
};

const mainLinks: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Cursos", href: "/courses" },
  { label: "Categorías", href: "/category" },
];

const learningLinks: NavLink[] = [
  {
    label: "Todos los cursos",
    href: "/courses",
    description: "Explora el catálogo completo de cursos disponibles.",
  },
  {
    label: "Categorías",
    href: "/category",
    description: "Filtra por categoría y encuentra tu próxima formación.",
  },
  {
    label: "Mis cursos",
    href: "/dashboard",
    description: "Continúa donde lo dejaste desde tu panel.",
  },
];

function Brand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-base font-heading font-semibold tracking-tight text-foreground"
    >
      <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <GraduationCap className="size-4" aria-hidden="true" />
      </span>
      Cursos
    </Link>
  );
}

function AuthActions({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button variant="ghost" size="sm" render={<Link href="/login" transitionTypes={["nav-forward"]} />}>
        Iniciar sesión
      </Button>
      <Button size="sm" render={<Link href="/signin" transitionTypes={["nav-forward"]} />}>
        Crear cuenta
      </Button>
    </div>
  );
}

function DesktopNav() {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Aprender</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[420px] gap-1 p-2">
              {learningLinks.map((item) => (
                <li key={item.href}>
                  <NavigationMenuLink render={<Link href={item.href} transitionTypes={["nav-forward"]} />}>
                    <div className="font-medium">{item.label}</div>
                    {item.description ? (
                      <p className="text-muted-foreground text-xs">
                        {item.description}
                      </p>
                    ) : null}
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {mainLinks.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              render={<Link href={item.href} transitionTypes={["nav-forward"]} />}
            >
              {item.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Abrir menú"
          />
        }
      >
        <Menu aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Menú</SheetTitle>
          <SheetDescription>
            Navega por las secciones principales de la plataforma.
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-1 flex-col gap-1 px-4">
          {mainLinks.map((item) => (
            <SheetClose
              key={item.href}
              render={
                <Link
                  href={item.href}
                  transitionTypes={["nav-forward"]}
                  className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                />
              }
            >
              {item.label}
            </SheetClose>
          ))}
          <Separator className="my-3" />
          {learningLinks.map((item) => (
            <SheetClose
              key={item.href}
              render={
                <Link
                  href={item.href}
                  transitionTypes={["nav-forward"]}
                  className="flex flex-col gap-0.5 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                />
              }
            >
              <span className="font-medium">{item.label}</span>
              {item.description ? (
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              ) : null}
            </SheetClose>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 border-t p-4">
          <SheetClose
            render={
              <Button
                variant="outline"
                className="w-full"
                render={<Link href="/login" transitionTypes={["nav-forward"]} />}
              />
            }
          >
            Iniciar sesión
          </SheetClose>
          <SheetClose
            render={
              <Button
                className="w-full"
                render={<Link href="/signin" transitionTypes={["nav-forward"]} />}
              />
            }
          >
            Crear cuenta
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Brand />
          <DesktopNav />
        </div>
        <div className="flex items-center gap-2">
          <CarritoTrigger />
          <AuthActions className="hidden md:flex" />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
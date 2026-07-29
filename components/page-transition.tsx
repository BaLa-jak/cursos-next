"use client";

import { ViewTransition } from "react";

/**
 * Wrapper de transición para `{children}` del layout raíz.
 *
 * Estrategia:
 * - `default="page-fade"`  → crossfade suave para TODA navegación
 *   (links sin tag, botón "atrás" del navegador, hash links…)
 * - `nav-forward`          → el contenido sale hacia la izquierda y el
 *   nuevo entra desde la derecha. Es la dirección que reservamos para
 *   enlaces explícitos de avance (navbar, footer, CTAs).
 * - `nav-back`             → simétrico: sale hacia la derecha, entra
 *   desde la izquierda. Reservado para "Volver", migas de pan y enlaces
 *   de regreso explícitos.
 *
 * El navbar y el footer quedan fuera de este wrapper (son siblings de
 * `{children}` en `app/layout.tsx`), así que el navegador no los
 * incluye en los snapshots y se mantienen estables durante toda la
 * animación — son el ancla espacial del usuario.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      default="page-fade"
      enter={{
        "nav-forward": "slide-in-right",
        "nav-back": "slide-in-left",
        default: "page-fade",
      }}
      exit={{
        "nav-forward": "slide-out-left",
        "nav-back": "slide-out-right",
        default: "page-fade",
      }}
    >
      {children}
    </ViewTransition>
  );
}
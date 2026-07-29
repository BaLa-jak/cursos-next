"use client";

import { ViewTransition } from "react";

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

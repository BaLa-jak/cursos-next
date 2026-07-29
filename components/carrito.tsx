"use client";

/**
 * Carrito — slide-out cart drawer used from the navbar.
 *
 * Composed from a single `<CarritoRoot>` mounted in the root layout that
 * owns the cart state (persisted to localStorage) and renders the Sheet.
 * The navbar mounts a `<CarritoTrigger>` to open it from any page.
 *
 * Anywhere in the tree you can call `useCarrito()` to read state or add
 * items, e.g.:
 *
 *   const { addItem } = useCarrito();
 *   <Button onClick={() => addItem({ id, slug, title, priceCents, author })}>
 *     Agregar al carrito
 *   </Button>
 */

import * as React from "react";
import Link from "next/link";
import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CartItem = {
  /** Stable identifier (course id or slug). De-duplicates on add. */
  id: string;
  /** URL slug used to build a link to `/courses/[slug]`. */
  slug: string;
  /** Display title. */
  title: string;
  /** Price stored in cents to avoid float drift. */
  priceCents: number;
  /** Optional course author shown under the title in the list row. */
  author?: string;
  /** Quantity added to the cart. Must be ≥ 1. */
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  /** True once localStorage has been read on the client. */
  isReady: boolean;
  /** True after `addItem` has been called at least once. */
  hasAdded: boolean;
  totalItems: number;
  totalCents: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const CartContext = React.createContext<CartContextValue | null>(null);

const STORAGE_KEY = "cursos-next:cart:v1";

// ─── External store ───────────────────────────────────────────────────────────
//
// State lives in a module-level store so we can use React 18+
// `useSyncExternalStore`. This gives us:
//   • SSR-safe snapshots (server snapshot = `[]`, matches empty client
//     pre-hydration snapshot, so no hydration mismatch).
//   • Lazy localStorage hydration that doesn't require `setState` inside
//     an effect — which is what React's `react-hooks/set-state-in-effect`
//     rule exists to prevent (cascading renders).

type CartStore = {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => CartItem[];
  getServerSnapshot: () => CartItem[];
  hydrate: () => void;
  set: (next: CartItem[]) => void;
};

function readStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartItem);
  } catch {
    return [];
  }
}

function writeStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage may be unavailable (private mode, quota); fail silently.
  }
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.slug === "string" &&
    typeof v.title === "string" &&
    typeof v.priceCents === "number" &&
    Number.isFinite(v.priceCents) &&
    typeof v.qty === "number" &&
    Number.isFinite(v.qty) &&
    v.qty > 0
  );
}

function createCartStore(): CartStore {
  let items: CartItem[] = [];
  let hydrated = false;
  const listeners = new Set<() => void>();

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  function getSnapshot(): CartItem[] {
    return items;
  }

  function getServerSnapshot(): CartItem[] {
    return [];
  }

  function notify() {
    for (const listener of listeners) listener();
  }

  function hydrate() {
    if (hydrated || typeof window === "undefined") return;
    items = readStorage();
    hydrated = true;
    notify();
  }

  function set(next: CartItem[]) {
    items = next;
    // Only persist after hydration, so we don't immediately overwrite
    // storage with the empty initial snapshot.
    if (hydrated) writeStorage(next);
    notify();
  }

  // Sync across tabs. Bound on the client only; harmless if it never runs.
  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key !== STORAGE_KEY) return;
      items = readStorage();
      hydrated = true;
      notify();
    });
  }

  return { subscribe, getSnapshot, getServerSnapshot, hydrate, set };
}

const cartStore = createCartStore();

// ─── Provider ─────────────────────────────────────────────────────────────────

function CarritoProvider({ children }: { children: React.ReactNode }) {
  // useSyncExternalStore is the canonical way to subscribe to state living
  // outside React. Snapshot identity is stable across renders (same array
  // reference until `set()` produces a new one), so React can bail out.
  const items = React.useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );

  // Open/close state and "user has added at least once" flag stay local to
  // the provider since they don't need to survive reloads.
  const [open, setOpen] = React.useState(false);
  const [hasAdded, setHasAdded] = React.useState(false);

  // Lazy hydration from localStorage. Safe to call in an effect: we don't
  // touch React state here — we notify the external store, and React's
  // `useSyncExternalStore` schedules the update through its own path.
  React.useEffect(() => {
    cartStore.hydrate();
  }, []);

  const isReady = items.length > 0 || typeof window !== "undefined";

  const value = React.useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((acc, item) => acc + item.qty, 0);
    const totalCents = items.reduce(
      (acc, item) => acc + item.qty * item.priceCents,
      0,
    );

    return {
      items,
      isReady,
      hasAdded,
      totalItems,
      totalCents,
      open,
      setOpen,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      addItem: (item, qty = 1) => {
        if (qty <= 0) return;
        const existing = items.find((i) => i.id === item.id);
        const next =
          existing
            ? items.map((i) =>
                i.id === item.id ? { ...i, qty: i.qty + qty } : i,
              )
            : [...items, { ...item, qty }];
        cartStore.set(next);
        setHasAdded(true);
        setOpen(true);
      },
      updateQty: (id, qty) => {
        if (qty <= 0) {
          cartStore.set(items.filter((i) => i.id !== id));
          return;
        }
        cartStore.set(
          items.map((i) => (i.id === id ? { ...i, qty } : i)),
        );
      },
      removeItem: (id) => {
        cartStore.set(items.filter((i) => i.id !== id));
      },
      clear: () => cartStore.set([]),
    };
  }, [items, isReady, hasAdded, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCarrito(): CartContextValue {
  const ctx = React.useContext(CartContext);
  if (!ctx) {
    throw new Error("useCarrito debe usarse dentro de un <CarritoRoot>.");
  }
  return ctx;
}

// Safe variant for components that may render outside the provider (e.g.
// shared building blocks). Returns `null` instead of throwing.
export function useCarritoOptional(): CartContextValue | null {
  return React.useContext(CartContext);
}

// ─── Formatting ───────────────────────────────────────────────────────────────

function formatPrice(cents: number, currency = "MXN"): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function thumbnailLabel(slug: string): string {
  const cleaned = slug.replace(/[^a-z0-9-]/gi, "");
  return (cleaned.slice(0, 3) || "CUR").toUpperCase();
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

/**
 * Botón que abre el carrito. Pensado para vivir en la barra de navegación.
 * Muestra un badge con la cuenta total cuando hay cursos agregados.
 *
 * Por defecto es icon-only (variant="ghost" size="icon-sm"). Si pasás
 * `showLabel` se renderiza con la palabra "Carrito" al lado del ícono —
 * útil en layouts anchos donde querés reforzar la CTA.
 */
function CarritoTrigger({
  className,
  showLabel = false,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const { totalItems, openCart } = useCarrito();
  const count = totalItems;
  const label =
    count > 0
      ? `Carrito, ${count} ${count === 1 ? "curso" : "cursos"}`
      : "Carrito";

  return (
    <Button
      variant="ghost"
      size={showLabel ? "sm" : "icon-sm"}
      aria-label={label}
      onClick={openCart}
      className={cn("relative", className)}
    >
      <ShoppingCart aria-hidden="true" />
      {showLabel ? <span>Carrito</span> : null}
      {count > 0 ? (
        <span
          aria-hidden="true"
          className={cn(
            "absolute -top-0.5 -right-0.5 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-sky px-1 text-[10px] font-mono font-medium tabular-nums leading-none text-sky-ink",
            // Use a stable shape so the badge doesn't dance as the count grows.
            count > 9 ? "min-w-[22px]" : null,
          )}
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Button>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function CartEmpty() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <div
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-full border border-dashed text-muted-foreground"
      >
        <ShoppingCart className="size-5" />
      </div>
      <div className="space-y-1">
        <p className="font-heading text-base font-medium tracking-tight">
          Tu carrito está vacío
        </p>
        <p className="mx-auto max-w-[28ch] text-sm text-muted-foreground text-balance">
          Explora el catálogo y agregá los cursos que quieras tomar.
        </p>
      </div>
      <SheetClose
        render={<Button size="sm" render={<Link href="/courses" transitionTypes={["nav-forward"]} />} />}
      >
        Ver cursos
      </SheetClose>
    </div>
  );
}

// ─── Line item ───────────────────────────────────────────────────────────────

function CartLine({ item }: { item: CartItem }) {
  const { updateQty, removeItem } = useCarrito();
  const lineTotal = formatPrice(item.priceCents * item.qty);

  return (
    <li className="flex gap-4 p-4">
      <div
        aria-hidden="true"
        className="flex size-16 shrink-0 items-center justify-center rounded-md border bg-muted font-mono text-[10px] tracking-tight text-muted-foreground"
      >
        {thumbnailLabel(item.slug)}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          href={`/courses/${item.slug}`}
          className="font-heading text-sm font-medium leading-tight line-clamp-2 hover:underline"
        >
          {item.title}
        </Link>
        {item.author ? (
          <p className="font-mono text-[11px] tracking-tight text-muted-foreground">
            {item.author}
          </p>
        ) : null}

        <div className="mt-1 flex items-center justify-between gap-2">
          <QuantityStepper
            value={item.qty}
            onChange={(qty) => updateQty(item.id, qty)}
            itemLabel={item.title}
          />
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm tabular-nums">{lineTotal}</span>
            <button
              type="button"
              aria-label={`Quitar ${item.title} del carrito`}
              onClick={() => removeItem(item.id)}
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

function QuantityStepper({
  value,
  onChange,
  itemLabel,
}: {
  value: number;
  onChange: (next: number) => void;
  itemLabel: string;
}) {
  return (
    <div className="flex items-center rounded-md border">
      <button
        type="button"
        aria-label={`Reducir cantidad de ${itemLabel}`}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        className="flex size-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <Minus className="size-3" aria-hidden="true" />
      </button>
      <span
        aria-live="polite"
        className="flex w-7 items-center justify-center font-mono text-xs tabular-nums"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label={`Aumentar cantidad de ${itemLabel}`}
        onClick={() => onChange(value + 1)}
        className="flex size-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <Plus className="size-3" aria-hidden="true" />
      </button>
    </div>
  );
}

// ─── Sheet body ──────────────────────────────────────────────────────────────

function CartBody() {
  const { items, totalCents, clear } = useCarrito();
  const subtotal = formatPrice(totalCents);

  if (items.length === 0) {
    return <CartEmpty />;
  }

  return (
    <>
      <ul
        role="list"
        className="flex flex-1 flex-col divide-y divide-border overflow-y-auto"
      >
        {items.map((item) => (
          <CartLine key={item.id} item={item} />
        ))}
      </ul>

      <div className="space-y-3 border-t bg-background p-4">
        <div className="flex items-center justify-between font-mono text-xs tracking-tight">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="tabular-nums text-foreground">{subtotal}</span>
        </div>
        <p className="font-mono text-[11px] tracking-tight text-muted-foreground">
          Impuestos y descuentos se calculan en el pago.
        </p>
        <div className="flex flex-col gap-2 pt-1">
          <SheetClose
            render={
              <Button className="w-full" render={<Link href="/checkout" transitionTypes={["nav-forward"]} />} />
            }
          >
            Finalizar compra
          </SheetClose>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={clear}
          >
            Vaciar carrito
          </Button>
        </div>
      </div>
    </>
  );
}

// ─── Sheet (the actual drawer) ────────────────────────────────────────────────

function CartDrawer() {
  const { open, setOpen, totalItems } = useCarrito();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b">
          <SheetTitle>
            <div className="flex items-center gap-2">
              <ShoppingCart className="size-4" aria-hidden="true" />
              <span>Carrito</span>
              {totalItems > 0 ? (
                <span className="font-mono text-xs font-normal text-muted-foreground tabular-nums">
                  ({totalItems})
                </span>
              ) : null}
            </div>
          </SheetTitle>
          <SheetDescription>
            {totalItems > 0
              ? "Revisá los cursos antes de finalizar la compra."
              : "Aún no has agregado cursos."}
          </SheetDescription>
        </SheetHeader>
        <CartBody />
      </SheetContent>
    </Sheet>
  );
}

// ─── Public wrapper ──────────────────────────────────────────────────────────

/**
 * Mount once near the root of the tree (the root layout is the natural home).
 * Owns the cart state and renders the drawer; consumers trigger it via the
 * navbar-mounted `<CarritoTrigger />` or by calling `openCart()` from
 * `useCarrito()`.
 */
export function CarritoRoot({ children }: { children: React.ReactNode }) {
  return (
    <CarritoProvider>
      {children}
      <CartDrawer />
    </CarritoProvider>
  );
}

// ─── Re-exports ──────────────────────────────────────────────────────────────

export { CarritoTrigger, CarritoProvider };

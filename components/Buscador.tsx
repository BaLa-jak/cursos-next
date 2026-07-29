import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import React, { useEffect, useRef, useState } from "react";

interface BuscadorI {
  get: (query?: string) => void;
}

const Buscador: React.FC<BuscadorI> = ({ get }) => {
  const [buscador, setBuscador] = useState<string>("");
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      get(buscador);
    }, 400);
    return () => clearTimeout(timer);
  }, [buscador]);

  return (
    <div className="relative w-52">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        value={buscador}
        onChange={e => setBuscador(e.target.value)}
        placeholder="Buscar..."
        className="h-auto py-1.5 pl-9 pr-8 text-sm"
      />
      {buscador && (
        <button
          type="button"
          onClick={() => setBuscador("")}
          aria-label="Limpiar búsqueda"
          className="absolute right-2 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  )
}
export default Buscador;
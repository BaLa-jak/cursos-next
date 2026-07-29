import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps {
  paginaActual: number;
  totalPaginas: number;
  total: number;
  limite: number;
  onCambiarPagina: (pagina: number) => void;
  onCambiarLimite: (limite: number) => void;
}

export function DataTablePagination({
  paginaActual,
  totalPaginas,
  total,
  limite,
  onCambiarPagina,
  onCambiarLimite,
}: DataTablePaginationProps) {
  const limiteSeleccionado = Number.isFinite(limite) && limite > 0 ? limite : 20;
  const limiteOpciones = Array.from(
    new Set([10, 20, 25, 30, 40, 50, limiteSeleccionado]),
  ).sort((a, b) => a - b);

  return (
    <div className="flex items-center justify-end px-2">
      <div className="flex justify-start items-center text-sm text-muted-foreground w-full h-auto">
        {total} registro(s)
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center justify-end text-sm font-medium w-[100px] h-auto">
          Página {paginaActual} de {totalPaginas}
        </div>
        <div className="my-2 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-8 cursor-pointer"
            onClick={() => onCambiarPagina(paginaActual - 1)}
            disabled={paginaActual <= 1}
          >
            <span className="sr-only">ir a la página anterior</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 border border-primary text-primary cursor-pointer"
          >
            {paginaActual}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 cursor-pointer"
            onClick={() => onCambiarPagina(paginaActual + 1)}
            disabled={paginaActual >= totalPaginas}
          >
            <span className="sr-only">ir a la siguiente página</span>
            <ChevronRight />
          </Button>
          <Select
            value={String(limiteSeleccionado)}
            onValueChange={(value) => onCambiarLimite(Number(value))}
          >
            <SelectTrigger
              size="sm"
              className="w-20 cursor-pointer"
              aria-label="Registros por página"
            >
              <SelectValue>{limiteSeleccionado}</SelectValue>
            </SelectTrigger>
            <SelectContent side="top">
              <SelectGroup>
                {limiteOpciones.map((opcion) => (
                  <SelectItem key={opcion} value={String(opcion)}>
                    {opcion}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
import {
  type ColumnDef,
  type RowData,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { navigate } from "astro:transitions/client";
import { DataTablePagination } from "./Paginacion";
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { http, HttpService, type IRequestParams } from "@/services";
import { toast } from "sonner";
import type { TPaginacion } from "@/types/responses";
import { TooltipProvider } from "./ui/tooltip";
import { Spinner } from "./ui/spinner";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    cellClassName?: string;
    headerClassName?: string;
  }
}

export interface TablaModel {
  ENDPOINTS: { DEFAULT: string;[key: string]: string };
  BASE_ROUTE: string;
  fromJsonList?: (data: any[]) => any[];
}

export interface TablaHandle {
  fetch: (params?: Partial<IRequestParams>) => Promise<void>;
  refetch: () => Promise<void>;
}

interface TablaProps<TData> {
  model: TablaModel;
  columns: ColumnDef<TData>[];
  params?: Partial<IRequestParams>;
  enlace?: (row: TData) => string;
}

const DEFAULT_PARAMS: IRequestParams = {
  ordenar: "nombre-asc",
  limite: 20,
  pagina: 1,
};

function _Tabla<TData>(
  { model, columns, params, enlace }: TablaProps<TData>,
  ref: React.ForwardedRef<TablaHandle>,
) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<TData[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginacion, setPaginacion] = useState<TPaginacion | null>(null);
  const storedParamsRef = useRef<IRequestParams>({
    ...DEFAULT_PARAMS,
    ...params,
  });

  const doFetch = useCallback(
    async (partialParams?: Partial<IRequestParams>) => {
      const mergedParams = { ...storedParamsRef.current, ...partialParams };
      storedParamsRef.current = mergedParams;

      setLoading(true);
      try {
        const res = await http.get(model.ENDPOINTS.DEFAULT, mergedParams);

        if (res.isError) {
          toast.error(
            HttpService.getMensajeError(
              res,
              "Ocurrió un problema al obtener los datos",
            ),
          );
          return;
        }

        const raw = res.resultado;
        const transformed =
          model.fromJsonList && Array.isArray(raw)
            ? (model.fromJsonList(raw) as TData[])
            : (raw as TData[]);

        setData(transformed ?? []);
        setPaginacion(res.paginacion ?? null);
      } catch {
        toast.error("Ocurrió un problema al obtener los datos");
      } finally {
        setLoading(false);
      }
    },
    [model],
  );

  const refetch = useCallback(async () => {
    await doFetch();
  }, [doFetch]);

  const datosPaginacion = useMemo(() => {
    const paginaActual = paginacion?.pagina ?? 1;
    const limite = paginacion?.limite ?? DEFAULT_PARAMS.limite ?? 20;
    const total = paginacion?.total ?? 0;
    const totalPaginas = total > 0 ? Math.max(1, Math.ceil(total / limite)) : 1;
    return { paginaActual, totalPaginas, total, limite };
  }, [paginacion]);

  const cambiarPagina = useCallback(
    (nuevaPagina: number) => {
      const { paginaActual, totalPaginas } = datosPaginacion;
      if (totalPaginas < 1) return;
      const clamped = Math.min(Math.max(1, nuevaPagina), totalPaginas);
      if (clamped === paginaActual) return;
      doFetch({ pagina: clamped });
    },
    [doFetch, datosPaginacion],
  );

  const cambiarLimite = useCallback(
    (nuevoLimite: number) => {
      if (nuevoLimite <= 0) return;
      doFetch({ limite: nuevoLimite, pagina: 1 });
    },
    [doFetch],
  );

  useImperativeHandle(ref, () => ({ fetch: doFetch, refetch }), [
    doFetch,
    refetch,
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    doFetch();
  }, []);

  return (
    <TooltipProvider>
      <div className="relative overflow-hidden rounded-md border">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
            <Spinner className="size-8" />
          </div>
        )}
        <Table className={loading ? "opacity-50" : ""}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="font-semibold"
                      style={
                        header.column.columnDef.size
                          ? { width: header.getSize() }
                          : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length > 0 &&
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="even:bg-muted/50 hover:cursor-pointer"
                  onClick={() => {
                    const link = enlace
                      ? enlace(row.original)
                      : `${model.BASE_ROUTE}/detalle?id=${(row.original as any).id}`;
                    navigate(link);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={
                        cell.column.columnDef.size
                          ? { width: cell.column.getSize() }
                          : undefined
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <DataTablePagination
          paginaActual={datosPaginacion.paginaActual}
          totalPaginas={datosPaginacion.totalPaginas}
          total={datosPaginacion.total}
          limite={datosPaginacion.limite}
          onCambiarPagina={cambiarPagina}
          onCambiarLimite={cambiarLimite}
        />
      </div>
    </TooltipProvider>
  );
}

export const Tabla = React.forwardRef(_Tabla) as <TData>(
  props: TablaProps<TData> & { ref?: React.ForwardedRef<TablaHandle> },
) => React.ReactElement;

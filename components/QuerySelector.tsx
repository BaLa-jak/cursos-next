import React from "react";
import type { ModeloBase } from "../types/ModeloBase.model";
import { toast } from "sonner";
import { http } from "@/services";
import { cn } from "@/lib/utils";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./ui/combobox";

interface Props<T extends ModeloBase> {
  endpoint: string;
  placeholder: string;
  value?: any;
  queryProps?: Record<string, any>;
  labelKey?: keyof T;
  className?: string;
  disabled?: boolean;
  onValueChange: (v: any) => void;
  optionRender?: (data: T) => React.ReactNode;
}

function QuerySelector<T extends ModeloBase>({
  queryProps,
  endpoint,
  placeholder,
  value,
  labelKey = "nombre" as keyof T,
  className,
  disabled,
  onValueChange,
  optionRender,
}: Props<T>) {
  const [items, setItems] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(false);

  const selected = React.useMemo(
    () => items.find((item) => item.id === value) ?? null,
    [items, value],
  );

  const queryPropsKey = React.useMemo(
    () => JSON.stringify(queryProps ?? {}),
    [queryProps],
  );

  React.useEffect(() => {
    const params = JSON.parse(queryPropsKey) as Record<string, any>;
    (async () => {
      setLoading(true);
      try {
        const res = await http.get(endpoint, { ...params });
        if (res.isError) return toast.error("Ocurrió un error al obtener los elementos");
        setItems(res.resultado as T[]);
      } catch {
        toast.error("Ocurrió un error al obtener los elementos");
      } finally {
        setLoading(false);
      }
    })();
  }, [endpoint, queryPropsKey]);

  return (
    <Combobox<T>
      value={selected}
      items={items}
      autoHighlight
      itemToStringLabel={(item) => String(item?.[labelKey] ?? item?.id ?? "")}
      itemToStringValue={(item) => String(item?.id ?? "")}
      isItemEqualToValue={(a, b) => a?.id === b?.id}
      onValueChange={(item) => onValueChange(item?.id ?? "")}
    >
      <ComboboxInput
        placeholder={placeholder}
        disabled={loading || disabled}
        className={cn("w-auto", className)}
      />
      <ComboboxContent>
        <ComboboxEmpty>No se encontraron elementos.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={`id-${item.id}`} value={item}>
              {optionRender ? optionRender(item) : String(item[labelKey] ?? item.id)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export default QuerySelector;

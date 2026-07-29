/**
 * Tipo compartido entre los modelos.
 *
 * `ModelColumnsType<T>` describe UNA columna de una tabla de UI: el
 * `accessorKey` es la propiedad de la fila (tipo `keyof T` para que
 * TypeScript atrape typos al renombrar), y `header` es la etiqueta que
 * se muestra en la cabecera. Los campos opcionales cubren necesidades
 * comunes del UI (renderer custom, sort) sin obligar a definirlos.
 */
export type ModelColumnsType<T> = {
  /** Llave de la fila a la que esta columna apunta. Tipada contra el modelo. */
  accessorKey: keyof T;

  /** Texto que se renderiza en la cabecera de la columna. */
  header: string;

  /** Renderer custom opcional — recibe la fila completa y devuelve lo que sea. */
  cell?: (row: T) => unknown;

  /** Si la columna admite ordenamiento. Por defecto `true` si se omite. */
  enableSorting?: boolean;
};

/**
 * Clase base para todos los modelos de tabla.
 *
 * Mantiene los cuatro campos que `db/schema.ts` repite en cada tabla vía
 * `baseColumns` (`id`, `creado`, `modificado`, `eliminado`). El resto de
 * campos se declaran opcionalmente (`?`) en cada subclase, igual que las
 * relaciones one-to-many / one-to-one que el modelo pueda hidratar.
 *
 * Constructor vacío a propósito: las subclases hacen `super()` y luego
 * `Object.assign(this, data)` para evitar copiar manualmente cada campo.
 *
 * Nota sobre `eliminado`: nullable en la DB para que `INSERT` no requiera
 * valor. La presencia/ausencia de un timestamp marca el soft-delete; un
 * `null` (o `undefined`) significa fila activa.
 */
export class ModeloBase {
  /** UUID v4 generado por Postgres (`gen_random_uuid()`). */
  id?: string;

  /** Timestamp de creación. Lo escribe `defaultNow()` si la app no lo manda. */
  creado?: Date;

  /** Timestamp de la última actualización. Mantenido al día por trigger. */
  modificado?: Date;

  /** Soft-delete. `null` o `undefined` = fila activa. */
  eliminado?: Date | null;

  constructor() {}

  /** `true` si la fila fue marcada como borrada (soft-delete). */
  get isDeleted(): boolean {
    return this.eliminado != null;
  }

  /** `true` si la fila NO fue soft-deleted — útil para filtros de UI. */
  get isActive(): boolean {
    return !this.isDeleted;
  }
}

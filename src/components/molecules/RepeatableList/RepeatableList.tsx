"use client";

import { AdminButton } from "@/components/atoms/AdminButton";
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, TrashIcon } from "@/components/atoms/icons";

/** Todo item de una lista del CMS se identifica por `id`: es la clave de React y
 * lo que usa `onChange` para ubicar el que cambió. */
interface Identified {
  id: string;
}

export interface RepeatableListProps<T extends Identified> {
  items: T[];
  onChange: (items: T[]) => void;
  /** Crea el item en blanco que se agrega al final. Tiene que traer un `id` nuevo. */
  createItem: () => T;
  addLabel: string;
  /** Encabezado de cada item. Suele ser su título, con el número como respaldo
   * mientras está vacío. */
  itemLabel: (item: T, index: number) => string;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  /** Tope de items. Al alcanzarlo se esconde el botón de agregar: hay grillas que
   * sólo se ven bien con una cantidad acotada de cards. */
  max?: number;
  /** Qué se muestra cuando no hay ningún item. */
  emptyLabel?: string;
  /** Ancho mínimo de cada item, en px. Los items se acomodan en tantas columnas
   * como entren: un renglón de horarios ocupa poco y conviene verlo de a tres,
   * mientras que una card con foto necesita más lugar. */
  itemMinWidth: number;
}

function IconButton({
  onClick,
  label,
  disabled,
  danger,
  children,
}: {
  onClick: () => void;
  label: string;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-taupe transition-colors disabled:opacity-35 ${
        danger ? "hover:bg-terracotta/10 hover:text-terracotta" : "hover:bg-sage/10 hover:text-sage"
      } disabled:hover:bg-transparent disabled:hover:text-taupe`}
    >
      {children}
    </button>
  );
}

/** Lista de items reordenables del CMS: categorías, servicios, fotos, horarios,
 * códigos postales y preguntas comparten esta carcasa, y cada editor sólo pasa
 * los campos de su item en `renderItem`.
 *
 * El orden importa —es el orden en que salen en la landing— así que cada item
 * trae sus flechas para subir y bajar. */
export function RepeatableList<T extends Identified>({
  items,
  onChange,
  createItem,
  addLabel,
  itemLabel,
  renderItem,
  max,
  emptyLabel = "Todavía no hay nada cargado.",
  itemMinWidth,
}: RepeatableListProps<T>) {
  function update(id: string, patch: Partial<T>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function remove(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  const canAdd = max === undefined || items.length < max;

  return (
    <div className="flex flex-col gap-3">
      {items.length === 0 ? <p className="text-[13px] text-stone">{emptyLabel}</p> : null}

      {/* `min()` en vez de `minmax(Npx, 1fr)` a secas: sin eso, un contenedor más
          angosto que el mínimo deja la columna en Npx y la tarjeta se desborda. */}
      <div
        className="grid items-start gap-3"
        style={{ gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${itemMinWidth}px), 1fr))` }}
      >
        {items.map((item, index) => (
          <div key={item.id} className="rounded-lg border border-line-light bg-paper px-4 pb-4 pt-3">
            <div className="mb-3 flex items-center gap-1 border-b border-line-light pb-2.5">
              <span className="min-w-0 flex-1 truncate text-[13px] text-stone">
                {itemLabel(item, index)}
              </span>
              <IconButton label="Subir" onClick={() => move(index, -1)} disabled={index === 0}>
                <ChevronUpIcon className="h-4 w-4" />
              </IconButton>
              <IconButton
                label="Bajar"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
              >
                <ChevronDownIcon className="h-4 w-4" />
              </IconButton>
              <IconButton label="Eliminar" onClick={() => remove(item.id)} danger>
                <TrashIcon className="h-4 w-4" />
              </IconButton>
            </div>
            <div className="flex flex-col gap-3.5">
              {renderItem(item, (patch) => update(item.id, patch))}
            </div>
          </div>
        ))}
      </div>

      {canAdd ? (
        <AdminButton variant="outline" onClick={() => onChange([...items, createItem()])} className="w-fit gap-1.5">
          <PlusIcon className="h-4 w-4" />
          {addLabel}
        </AdminButton>
      ) : (
        <p className="text-[13px] text-stone">
          Llegaste al máximo de {max} para que la grilla se siga viendo bien.
        </p>
      )}
    </div>
  );
}

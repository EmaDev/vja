"use client";

import { cn } from "@/lib/utils";

export interface ColorFieldProps {
  label: string;
  /** Color en `#rrggbb`. Es el formato que guarda el CMS y el único que acepta
   * `input[type=color]`. */
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/** Campo de color del panel: la muestra que abre el selector del sistema y el
 * hexadecimal al lado, editable a mano.
 *
 * Los dos controles hacen falta. El selector es el que usa el cliente cuando
 * elige un color mirando; el campo de texto es el que se usa cuando el color ya
 * está decidido —el de la marca, copiado de otro lado— y buscarlo en la rueda
 * sería adivinar.
 *
 * El texto se normaliza al salir del campo y no en cada tecla: mientras se
 * escribe "#1a2b3c" pasa por estados que no son un color, y corregirlos al
 * instante haría imposible tipear. */
export function ColorField({ label, value, onChange, className }: ColorFieldProps) {
  return (
    <label className={cn("flex flex-col gap-[7px]", className)}>
      <span className="text-[13px] text-ink">{label}</span>
      <span className="flex items-center gap-2.5 rounded-md border border-line bg-paper-light px-3 py-[9px]">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={`${label}: selector de color`}
          className="h-7 w-9 shrink-0 cursor-pointer rounded border border-line bg-transparent p-0"
        />
        <input
          type="text"
          value={value}
          spellCheck={false}
          onChange={(event) => onChange(event.target.value)}
          onBlur={(event) => onChange(normalizeHex(event.target.value, value))}
          aria-label={`${label}: código hexadecimal`}
          className="min-w-0 flex-1 bg-transparent font-mono text-[14px] uppercase text-forest outline-none"
        />
      </span>
    </label>
  );
}

/** Deja el texto en `#rrggbb`: completa el numeral, expande la forma corta
 * (`#1a2`) y descarta lo que no sea un color, que vuelve al valor anterior. */
function normalizeHex(input: string, fallback: string): string {
  const hex = input.trim().replace(/^#/, "").toLowerCase();

  if (/^[0-9a-f]{3}$/.test(hex)) {
    return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }
  if (/^[0-9a-f]{6}$/.test(hex)) return `#${hex}`;

  return fallback;
}

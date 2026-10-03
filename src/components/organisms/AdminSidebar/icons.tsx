/** Iconografía de la barra lateral del CMS.
 *
 * SVG en línea en vez de una librería: son nueve glifos de 18px que nunca
 * cambian, y traerse un paquete entero para eso agregaría peso al bundle del
 * panel sin devolver nada. Todos heredan el color con `currentColor` y el
 * grosor de trazo, así que el estado activo se resuelve sólo con clases de
 * texto en el enlace que los contiene. */

export type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function LeafIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M11 20A7 7 0 0 1 11 6h8v6a8 8 0 0 1-8 8Z" />
      <path d="M5 20c2-5 6-8 10-9" />
    </svg>
  );
}

export function TagsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h5l9 9-5 5-9-9v-3.5Z" />
      <circle cx="7.5" cy="10.5" r="1.1" />
      <path d="M14 4h5.5A1.5 1.5 0 0 1 21 5.5V11" />
    </svg>
  );
}

export function MegaphoneIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 10v4a1 1 0 0 0 1 1h3l8 4V5L8 9H5a1 1 0 0 0-1 1Z" />
      <path d="M19 9a3.5 3.5 0 0 1 0 6" />
      <path d="M8 15v4" />
    </svg>
  );
}

export function PaletteIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21a9 9 0 1 1 9-9c0 2-1.6 2.6-3 2.6h-1.4a2 2 0 0 0-1.4 3.4 1.6 1.6 0 0 1-1.2 3H12Z" />
      <circle cx="7.8" cy="12" r="1.1" />
      <circle cx="10" cy="7.8" r="1.1" />
      <circle cx="15" cy="8.6" r="1.1" />
    </svg>
  );
}

export function LayersIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
      <path d="m3.5 12 8.5 4.5 8.5-4.5" />
      <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
    </svg>
  );
}

export function TextIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  );
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function LogoutIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M15 4h2.5A1.5 1.5 0 0 1 19 5.5v13a1.5 1.5 0 0 1-1.5 1.5H15" />
      <path d="M11 8 7 12l4 4" />
      <path d="M7 12h9" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function ExternalIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
    </svg>
  );
}

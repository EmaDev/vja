import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CardShellProps = {
  /** Con `href` la card entera navega; sin él queda un contenedor mudo, que es
   * lo que necesita la vitrina de variantes del CMS, donde las cards son sólo
   * una muestra del diseño. */
  href?: string;
  /** Nombre accesible del enlace. Sin esto el lector de pantalla lee de corrido
   * todo lo que hay dentro de la card —categoría, nombre, chips de cuidado—
   * cuando lo útil es escuchar la planta. */
  label?: string;
  className?: string;
  children: ReactNode;
};

/** Raíz de las cards de producto.
 *
 * El enlace reemplaza al `div` en lugar de envolverlo: varias variantes animan
 * con `group-hover`, así que el hover tiene que ocurrir sobre el mismo elemento
 * que lleva las clases. El foco se marca en terracota porque es el único acento
 * de la paleta que se lee tanto sobre papel como sobre verde. */
export function CardShell({ href, label, className, children }: CardShellProps) {
  if (!href) return <div className={className}>{children}</div>;

  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        className,
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
      )}
    >
      {children}
    </Link>
  );
}

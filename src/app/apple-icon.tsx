import { renderAppIcon } from "@/lib/seo/app-icon";

/** Ícono para "Agregar a inicio" en iOS. 180×180 es la medida que usa Safari.
 *
 * iOS no respeta `border-radius` acá —recorta el ícono con su propia máscara—
 * así que el fondo va lleno hasta el borde. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return renderAppIcon(size.width);
}

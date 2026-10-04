/** Lo que comparten el editor del ícono y las rutas que lo dibujan.
 *
 * Vive en `lib/cms` y no en `lib/seo` porque lo usa también el panel, que corre
 * en el navegador: nada de acá puede ser `server-only`.
 *
 * Los colores llegan como texto escrito a mano en el panel, y del otro lado los
 * consume `ImageResponse`, que no valida nada: un `background` con basura
 * adentro no se ve raro, rompe la generación del ícono. Por eso se normalizan
 * del lado del servidor y no sólo en el campo del formulario. */

/** `--color-forest` y `--color-paper` de `globals.css`, en hexadecimal: el ícono
 * se dibuja fuera del sitio, donde no existen las variables CSS. */
export const DEFAULT_ICON_BACKGROUND = "#17301f";
export const DEFAULT_ICON_FOREGROUND = "#f6f1e7";

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

/** Un `#rrggbb` seguro para pasarle al generador del ícono. */
export function iconColor(value: string, fallback: string): string {
  const hex = value.trim();
  return HEX_COLOR.test(hex) ? hex : fallback;
}

/** La letra del ícono generado: lo que cargó el cliente o, si no cargó nada, la
 * inicial del nombre del negocio.
 *
 * Dos caracteres como máximo. A 16 px —el tamaño de la pestaña— una sigla de
 * tres letras ya es una mancha, y el ícono existe para que se reconozca de un
 * vistazo, no para que se lea. */
export function iconLetter(letter: string, siteName: string): string {
  const typed = letter.trim();
  if (typed) return typed.slice(0, 2);

  const initial = siteName.trim().charAt(0);
  return (initial || "V").toUpperCase();
}

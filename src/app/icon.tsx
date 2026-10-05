import { renderAppIcon } from "@/lib/seo/app-icon";

/** Ícono del sitio: la pestaña del navegador y, sobre todo, el redondelito que
 * Google dibuja al lado del resultado en el celular.
 *
 * 48×48 porque es la medida que pide Google —el ícono tiene que ser un múltiplo
 * de 48 px— y abajo de eso lo descarta y dibuja un globo gris.
 *
 * El contenido lo decide el cliente desde "Ícono del sitio" en el panel; acá
 * sólo se fija el tamaño. test*/
export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return renderAppIcon(size.width);
}

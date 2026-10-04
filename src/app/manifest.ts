import type { MetadataRoute } from "next";
import { FALLBACK_SITE_NAME } from "@/lib/seo/site";

/** Manifiesto web. Lo pide la auditoría de buenas prácticas de Lighthouse y es
 * lo que usa Android cuando alguien agrega el sitio a la pantalla de inicio.
 *
 * `display: "browser"` y no `"standalone"`: esto es un sitio, no una app. En
 * modo standalone desaparece la barra de direcciones y con ella el botón de
 * compartir, que para un vivero es justo lo que se quiere que usen.
 *
 * El nombre sale de la constante y no del CMS a propósito: el manifiesto lo lee
 * el navegador una vez y lo cachea en el dispositivo, así que no es el lugar
 * para un texto que el cliente puede cambiar cualquier día. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${FALLBACK_SITE_NAME} — Vivero`,
    short_name: FALLBACK_SITE_NAME,
    description: "Catálogo de plantas de interior y exterior, y datos del local.",
    start_url: "/",
    display: "browser",
    lang: "es-AR",
    // `--color-paper` y `--color-forest` de `globals.css`.
    background_color: "#f6f1e7",
    theme_color: "#17301f",
    icons: [
      { src: "/icon", sizes: "48x48", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}

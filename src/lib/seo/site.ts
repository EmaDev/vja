import "server-only";
import { SITE_URL, normalizeSiteUrl } from "@/lib/site-url";

/** Origen absoluto del sitio para todo lo que Google y las redes leen: el
 * `metadataBase`, los canónicos, el sitemap, el robots y los `@id` de los datos
 * estructurados.
 *
 * A diferencia de `SITE_URL` —que puede quedar vacío a propósito para frenar la
 * impresión de QR— acá siempre hay un valor. Un campo de metadata relativo sin
 * `metadataBase` es un error de build (lo dice
 * `03-api-reference/04-functions/generate-metadata.md`), así que quedarse sin
 * origen no es una opción: rompería el deploy en vez de degradar el SEO.
 *
 * El orden es de más explícito a más adivinado:
 *
 * 1. `NEXT_PUBLIC_SITE_URL` — el dominio del cliente, lo único que vale en
 *    producción. Es la que hay que cargar en Vercel.
 * 2. `VERCEL_PROJECT_PRODUCTION_URL` — el dominio de producción del proyecto.
 *    Lo inyecta Vercel y es estable entre deploys, así que un preview de una
 *    rama sigue canonizando al dominio real y no se indexa a sí mismo.
 * 3. `VERCEL_URL` — la URL del deploy puntual. Último recurso para que un
 *    preview sin nada configurado no canonice a `localhost`.
 * 4. `localhost:3000` — desarrollo.
 *
 * `server-only` a propósito: los pasos 2 y 3 no existen en el navegador, así
 * que un componente de cliente que leyera esto renderizaría otro valor que el
 * servidor. */
function resolveOrigin(): string {
  if (SITE_URL) return SITE_URL;

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL ?? "";
  // Vercel las publica como host pelado, sin esquema, y siempre sobre https.
  if (vercel) return normalizeSiteUrl(vercel) || "http://localhost:3000";

  return "http://localhost:3000";
}

export const SITE_ORIGIN = resolveOrigin();

export const siteMetadataBase = new URL(SITE_ORIGIN);

/** URL absoluta de una ruta del sitio. El sitemap y los datos estructurados la
 * necesitan absoluta: a diferencia de los campos de `metadata`, ahí no hay
 * `metadataBase` que la complete. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_ORIGIN).toString();
}

/** Nombre del negocio que se usa cuando el CMS todavía no tiene nada cargado.
 * Aparece en el `title` y en el JSON-LD, así que es mejor una constante que un
 * string suelto repetido en cada archivo. */
export const FALLBACK_SITE_NAME = "VJA Plantas";

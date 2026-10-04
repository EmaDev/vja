import "server-only";
import type { Metadata } from "next";
import { pickSection } from "@/lib/cms/published";
import type { CmsSection } from "@/lib/cms/types";
import { FALLBACK_SITE_NAME } from "./site";

/** Los campos de `metadata` que comparten las tres páginas públicas.
 *
 * Existe para que no se escapen: el canónico, el `og:locale` o la tarjeta de
 * Twitter son fáciles de poner en una página y olvidar en la siguiente, y el
 * síntoma —una vista previa de WhatsApp distinta según el link— aparece mucho
 * después de la línea que lo causó. */

/** El nombre del negocio tal como lo cargó el cliente. El `logoText` del header
 * es el que se ve arriba de la página, así que es el que mejor coincide con lo
 * que alguien reconoce en un resultado de Google. */
export function siteName(sections: CmsSection[]): string {
  const header = pickSection(sections, "header")?.logoText?.trim();
  const store = pickSection(sections, "contact")?.storeName?.trim();
  return header || store || FALLBACK_SITE_NAME;
}

export interface PublicMetadataInput {
  sections: CmsSection[];
  /** Título completo, con el sufijo del negocio ya puesto si corresponde. */
  title: string;
  description: string;
  /** Ruta relativa, incluida la query cuando forma parte de la página.
   * `metadataBase` la completa a absoluta. */
  canonical: string;
  /** `article` para una ficha de planta, `website` para el resto. */
  type?: "website" | "article";
}

export function publicMetadata({
  sections,
  title,
  description,
  canonical,
  type = "website",
}: PublicMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteName(sections),
      locale: "es_AR",
      type,
    },
    // La imagen no se declara acá a propósito: la genera
    // `app/opengraph-image.tsx` (y la de la ficha, la de su propia carpeta), y
    // Next completa `og:image` y `twitter:image` con ella. Declararla también
    // acá dejaría dos etiquetas compitiendo.
    twitter: { card: "summary_large_image", title, description },
  };
}

import type { FooterSection } from "./types";

/** Las redes del footer, como URL.
 *
 * El panel pide el usuario, no el enlace: es lo que el cliente tiene a mano y
 * lo que se lee en el pie ("@vja.plantas"). La URL se arma acá.
 *
 * Vive fuera del componente porque el pie no es el único que la necesita: el
 * JSON-LD declara las mismas redes en `sameAs`, y ahí tienen que ser URL
 * absolutas y —esto es lo importante— **las mismas** que los enlaces visibles.
 * Un `sameAs` que apunta a otro lado que el pie es justo el desajuste entre
 * dato estructurado y página que Google marca como señal de spam. */
export function socialHref(base: string, handle: string): string | null {
  const clean = handle.trim().replace(/^@/, "");
  return clean ? `${base}/${clean}` : null;
}

export function socialLinks(footer?: FooterSection): { instagram: string | null; pinterest: string | null } {
  return {
    instagram: socialHref("https://instagram.com", footer?.instagram ?? ""),
    pinterest: socialHref("https://pinterest.com", footer?.pinterest ?? ""),
  };
}

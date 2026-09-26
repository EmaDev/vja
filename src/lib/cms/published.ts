import { cache } from "react";
import { getPublishedCached } from "./repository";
import type { CmsSection } from "./types";

/** Contenido publicado, una sola vez por request.
 *
 * `generateMetadata` y el componente de página leen lo mismo, y toda página
 * pública necesita además el header, el footer y los datos de contacto. `cache`
 * de React une todas esas lecturas en una sola llamada; `getPublishedCached`
 * evita además ir a Firestore mientras no se publique algo nuevo. */
export const loadPublished = cache(getPublishedCached);

/** Busca la sección de un `kind`. Hay a lo sumo una de cada una: el repositorio
 * normaliza lo guardado contra el seed antes de devolverlo. */
export function pickSection<K extends CmsSection["kind"]>(
  sections: CmsSection[],
  kind: K,
): Extract<CmsSection, { kind: K }> | undefined {
  return sections.find(
    (section): section is Extract<CmsSection, { kind: K }> => section.kind === kind,
  );
}

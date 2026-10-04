import {
  SHARE_IMAGE_ALT,
  SHARE_IMAGE_CONTENT_TYPE,
  SHARE_IMAGE_SIZE,
  renderSiteShareImage,
} from "@/lib/seo/share-image";

/** Vista previa del sitio. Al estar en la raíz de `app/`, la heredan todas las
 * rutas que no definan una propia (el catálogo, por ejemplo). */
export const alt = SHARE_IMAGE_ALT;
export const size = SHARE_IMAGE_SIZE;
export const contentType = SHARE_IMAGE_CONTENT_TYPE;

export default function OpengraphImage() {
  return renderSiteShareImage();
}

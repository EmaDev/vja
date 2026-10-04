import {
  SHARE_IMAGE_ALT,
  SHARE_IMAGE_CONTENT_TYPE,
  SHARE_IMAGE_SIZE,
  renderSiteShareImage,
} from "@/lib/seo/share-image";

/** La misma tarjeta que Open Graph. Va en su propio archivo porque Twitter/X
 * lee `twitter:image` y no cae en `og:image` cuando la tarjeta es
 * `summary_large_image`. */
export const alt = SHARE_IMAGE_ALT;
export const size = SHARE_IMAGE_SIZE;
export const contentType = SHARE_IMAGE_CONTENT_TYPE;

export default function TwitterImage() {
  return renderSiteShareImage();
}

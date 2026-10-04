import { notFound } from "next/navigation";
import { findLiveProduct } from "@/lib/cms/catalog-repository";
import {
  SHARE_IMAGE_ALT,
  SHARE_IMAGE_CONTENT_TYPE,
  SHARE_IMAGE_SIZE,
  renderProductShareImage,
} from "@/lib/seo/share-image";

/** Vista previa de la ficha: la foto de la planta y su nombre. Pisa la de la
 * raíz, que es la genérica del vivero. */
export const alt = SHARE_IMAGE_ALT;
export const size = SHARE_IMAGE_SIZE;
export const contentType = SHARE_IMAGE_CONTENT_TYPE;

export default async function ProductOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await findLiveProduct(slug);
  if (!product) notFound();

  return renderProductShareImage(product);
}

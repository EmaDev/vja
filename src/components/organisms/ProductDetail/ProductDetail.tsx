import type { ReactNode } from "react";
import Link from "next/link";
import { CtaButton } from "@/components/atoms/CtaButton";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { ProductGallery, type GalleryPhoto } from "./ProductGallery";
import { Markdown } from "@/lib/cms/markdown";
import { whatsappHref } from "@/lib/cms/whatsapp";
import type { Product } from "@/lib/cms/catalog-types";
import type { ContactSection } from "@/lib/cms/types";

export interface ProductDetailProps {
  product: Product;
  /** Datos del local, para el botón de consulta. Sin sección de contacto
   * publicada la ficha se muestra igual, sin CTA. */
  contact?: ContactSection;
}

/** Consulta con el nombre de la planta ya escrito, para que el visitante no
 * tenga que explicar desde qué página escribe. */
function inquiryHref(product: Product, contact?: ContactSection): string | null {
  if (!contact?.whatsappEnabled) return null;
  return whatsappHref(contact.whatsappPhone, `Hola, quería consultar por ${product.name}.`);
}

/** Las fotos cargadas en el CMS.
 *
 * Un producto sin fotos devuelve igual un recuadro: la ficha sin galería queda
 * coja, y el recuadro con el nombre es el mismo marcador de posición que usan
 * las cards del catálogo. */
function galleryPhotos(product: Product): GalleryPhoto[] {
  if (product.photos.length === 0) {
    return [{ alt: product.name, label: product.name }];
  }

  return product.photos.map((photo, index) => ({
    src: photo.imageUrl,
    alt: photo.imageAlt || (index === 0 ? product.name : ""),
    label: index === 0 ? product.name : `${product.name} ${index + 1}`,
  }));
}

/** Bloque titulado de la columna derecha. Todos entran con el mismo gesto y un
 * retardo creciente, así la ficha se arma de arriba hacia abajo en vez de
 * aparecer de golpe. */
function Block({
  title,
  delay,
  children,
}: {
  title?: string;
  delay: string;
  children: ReactNode;
}) {
  return (
    <section
      className="animate-[rp-rise_0.65s_ease_both] border-t border-line pt-7"
      style={{ animationDelay: delay }}
    >
      {title && (
        <h2 className="mb-5 text-[11px] uppercase tracking-[0.2em] text-taupe">{title}</h2>
      )}
      {children}
    </section>
  );
}

/** Ficha pública de una planta.
 *
 * Dos columnas parejas en escritorio: la galería a la izquierda, que queda fija
 * mientras se lee, y a la derecha el detalle partido en bloques separados por
 * filetes: la descripción tal como se redactó en el CMS, las características y
 * la consulta. Por debajo de `lg` se apila, galería primero. */
export function ProductDetail({ product, contact }: ProductDetailProps) {
  const inquiry = inquiryHref(product, contact);

  return (
    <article className="site-gutter bg-paper py-8 md:py-12 lg:py-16">
      <nav
        aria-label="Migas de pan"
        className="mb-8 animate-[rp-fade_0.6s_ease_both] text-[13px] text-taupe lg:mb-14"
      >
        <Link href="/" className="transition-colors duration-300 hover:text-forest">
          Inicio
        </Link>
        <span className="px-2 text-line">/</span>
        <Link href="/#catalogo" className="transition-colors duration-300 hover:text-forest">
          Catálogo
        </Link>
        <span className="px-2 text-line">/</span>
        <span className="text-forest">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-20 xl:gap-28">
        {/* `self-start` es lo que habilita el `sticky`: sin eso la columna se
            estira a lo alto de la fila y no tiene margen para quedarse fija. */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <ProductGallery photos={galleryPhotos(product)} />
        </div>

        <div className="flex flex-col gap-7">
          <header className="animate-[rp-rise_0.65s_ease_both]">
            <Eyebrow>{product.category}</Eyebrow>
            <h1 className="mt-3 font-display text-[42px] font-normal leading-[1.02] text-forest sm:text-[54px] lg:text-[62px]">
              {product.name}
            </h1>
            {product.latin && (
              <p className="mt-2 font-display text-xl italic text-taupe">{product.latin}</p>
            )}
          </header>

          {product.long.trim() && (
            <Block delay="0.08s">
              {/* Lo que se escribió en el CMS, con su formato. Es el único cuerpo
                  de texto de la ficha: los cuidados se cuentan acá, redactados,
                  en vez de repartidos en una grilla de rótulos. */}
              <Markdown
                text={product.long}
                className="text-base text-ink [&>*:first-child]:mt-0 md:text-lg"
              />
            </Block>
          )}

          {product.tags.length > 0 && (
            <Block title="Características" delay="0.16s">
              <ul className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-line bg-paper-light px-3.5 py-1.5 text-[13px] text-stone transition-[transform,border-color,color] duration-300 hover:-translate-y-0.5 hover:border-terracotta hover:text-forest"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </Block>
          )}

          <Block title="Consultar" delay="0.24s">
            <div className="flex flex-wrap items-center gap-4">
              {inquiry && (
                <CtaButton href={inquiry} tone="forest">
                  Consultar por esta planta
                </CtaButton>
              )}
              <CtaButton href="/#catalogo" tone="forest" variant="outline">
                Volver al catálogo
              </CtaButton>
            </div>
            {/* El precio no está en el modelo de producto: la venta se cierra por
                WhatsApp, así que la ficha lo dice en vez de dejar un hueco. */}
            {inquiry && (
              <p className="mt-5 text-sm leading-[1.6] text-stone">
                Escribinos y te pasamos precio y disponibilidad del día.
              </p>
            )}
          </Block>
        </div>
      </div>
    </article>
  );
}

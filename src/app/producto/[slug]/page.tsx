import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCatalog } from "@/components/organisms/ProductCatalog/ProductCatalog";
import { ProductDetail } from "@/components/organisms/ProductDetail/ProductDetail";
import { SiteChrome } from "@/components/organisms/SiteChrome/SiteChrome";
import { SiteFooter } from "@/components/organisms/SiteFooter/SiteFooter";
import { WhatsAppButton } from "@/components/organisms/WhatsAppButton/WhatsAppButton";
import { defaultCardVariant } from "@/lib/cms/card-variants";
import { findLiveProduct, loadLiveProducts } from "@/lib/cms/catalog-repository";
import type { Product } from "@/lib/cms/catalog-types";
import { loadPublished, pickSection } from "@/lib/cms/published";

/** Esta ruta no lleva `loading.tsx` a propósito.
 *
 * Un esqueleto acá haría que Next empiece a transmitir la respuesta antes de
 * resolver la página, y para entonces el estado HTTP ya salió en 200: un slug
 * inexistente devolvería 200 con la pantalla de "no encontramos esa planta", que
 * es justo el soft 404 que un buscador penaliza. Medido: con `loading.tsx`,
 * `/producto/no-existe` responde 200; sin él, 404.
 *
 * Se pierde el prefetch parcial, pero la ficha no lo necesita: tanto el catálogo
 * como el contenido publicado vienen de lecturas cacheadas. */

/** Otras plantas de la misma categoría. Si la categoría tiene una sola, no se
 * muestra nada: una grilla de uno queda peor que no tenerla. */
async function relatedProducts(product: Product): Promise<Product[]> {
  return (await loadLiveProducts())
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 3);
}

export async function generateMetadata({
  params,
}: PageProps<"/producto/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await findLiveProduct(slug);
  if (!product) return {};

  const sections = await loadPublished();
  const seo = pickSection(sections, "seo");
  // El nombre del vivero va como sufijo: en la pestaña y en Google se lee
  // primero la planta, que es lo que se buscó.
  const suffix = pickSection(sections, "header")?.logoText;
  const title = suffix ? `${product.name} · ${suffix}` : product.name;
  const description = product.long || product.short;

  return {
    title,
    description,
    alternates: { canonical: `/producto/${product.id}` },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "es_AR",
      images: seo?.shareImageUrl
        ? [{ url: seo.shareImageUrl, alt: seo.shareImageAlt || title }]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/producto/[slug]">) {
  const { slug } = await params;
  const product = await findLiveProduct(slug);
  if (!product) notFound();

  const sections = await loadPublished();
  const header = pickSection(sections, "header");
  const footer = pickSection(sections, "footer");
  const contact = pickSection(sections, "contact");
  // La card del catálogo es una decisión de diseño del cliente: las plantas
  // relacionadas usan la misma para que la ficha no parezca otro sitio.
  const cardVariant = pickSection(sections, "cards")?.variant ?? defaultCardVariant;
  const related = await relatedProducts(product);

  const content = (
    <>
      <main className="min-w-0">
        <ProductDetail product={product} contact={contact} />
        {related.length > 0 && (
          <ProductCatalog
            variant={cardVariant}
            anchorId="relacionados"
            eyebrow="También te puede gustar"
            title={`Más en ${product.category}`}
            description=""
            products={related}
          />
        )}
      </main>
      {footer ? <SiteFooter section={footer} contact={contact} /> : null}
      {contact ? <WhatsAppButton section={contact} /> : null}
    </>
  );

  if (!header) return content;

  return (
    <SiteChrome header={header} heroTone="light" hasHero={false}>
      {content}
    </SiteChrome>
  );
}

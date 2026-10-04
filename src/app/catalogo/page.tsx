import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CatalogBrowser,
  CATALOG_PAGE_SIZE,
} from "@/components/organisms/CatalogBrowser/CatalogBrowser";
import { SiteChrome } from "@/components/organisms/SiteChrome/SiteChrome";
import { SiteFooter } from "@/components/organisms/SiteFooter/SiteFooter";
import { WhatsAppButton } from "@/components/organisms/WhatsAppButton/WhatsAppButton";
import { defaultCardVariant } from "@/lib/cms/card-variants";
import { loadLiveCategories, loadLiveProducts } from "@/lib/cms/catalog-repository";
import { loadPublished, pickSection } from "@/lib/cms/published";

/** Lee el filtro y la página de la URL.
 *
 * Un `?pagina=` raro no tiene que tirar la página abajo: todo lo que no sea un
 * entero mayor a cero cae en la primera. La categoría, en cambio, sí se valida
 * contra el catálogo más adelante: un slug inexistente es un 404 y no una lista
 * vacía, para no dejar direcciones muertas indexadas. */
function readParams(params: Record<string, string | string[] | undefined>) {
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? (value[0] ?? "") : (value ?? "");

  const requested = Number.parseInt(first(params.pagina), 10);
  return {
    categorySlug: first(params.categoria),
    page: Number.isInteger(requested) && requested > 0 ? requested : 1,
  };
}

export async function generateMetadata({
  searchParams,
}: PageProps<"/catalogo">): Promise<Metadata> {
  const { categorySlug, page } = readParams(await searchParams);
  const [sections, categories] = await Promise.all([loadPublished(), loadLiveCategories()]);
  const category = categories.find((candidate) => candidate.slug === categorySlug);

  const suffix = pickSection(sections, "header")?.logoText;
  const name = category ? `${category.name} · Catálogo` : "Catálogo";
  const base = suffix ? `${name} · ${suffix}` : name;

  return {
    title: page > 1 ? `${base} · Página ${page}` : base,
    description:
      category?.short ||
      category?.description ||
      pickSection(sections, "seo")?.metaDescription ||
      "Todas las plantas publicadas del vivero, con filtro por categoría.",
    // El canónico apunta siempre a la categoría sin paginar: las páginas
    // internas son cortes de la misma lista, no contenido propio.
    alternates: { canonical: categorySlug ? `/catalogo?categoria=${categorySlug}` : "/catalogo" },
  };
}

export default async function CatalogPage({ searchParams }: PageProps<"/catalogo">) {
  const { categorySlug, page } = readParams(await searchParams);

  const [sections, products, categories] = await Promise.all([
    loadPublished(),
    loadLiveProducts(),
    loadLiveCategories(),
  ]);

  const selected = categories.find((category) => category.slug === categorySlug);
  if (categorySlug && !selected) notFound();

  const matching = selected
    ? products.filter((product) => product.category === selected.name)
    : products;
  const totalPages = Math.max(1, Math.ceil(matching.length / CATALOG_PAGE_SIZE));

  const header = pickSection(sections, "header");
  const footer = pickSection(sections, "footer");
  const contact = pickSection(sections, "contact");
  // La card del catálogo es una decisión de diseño del cliente: esta página usa
  // la misma que la landing para que no parezca otro sitio.
  const variant = pickSection(sections, "cards")?.variant ?? defaultCardVariant;

  const content = (
    <>
      <main className="min-w-0">
        <CatalogBrowser
          variant={variant}
          products={products}
          categories={categories}
          categorySlug={categorySlug}
          // Una página fuera de rango muestra la última en vez de un 404: el
          // catálogo cambia seguido y un enlace viejo tiene que seguir llevando
          // a algo.
          page={Math.min(page, totalPages)}
        />
      </main>
      {footer ? <SiteFooter section={footer} contact={contact} /> : null}
      {contact ? <WhatsAppButton section={contact} /> : null}
    </>
  );

  if (!header) return content;

  return (
    <SiteChrome header={header} contact={contact} heroTone="light" hasHero={false}>
      {content}
    </SiteChrome>
  );
}

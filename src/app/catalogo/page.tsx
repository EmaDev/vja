import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/atoms/JsonLd";
import {
  CatalogBrowser,
  CATALOG_PAGE_SIZE,
} from "@/components/organisms/CatalogBrowser/CatalogBrowser";
import { SiteChrome } from "@/components/organisms/SiteChrome/SiteChrome";
import { SiteFooter } from "@/components/organisms/SiteFooter/SiteFooter";
import { WhatsAppButton } from "@/components/organisms/WhatsAppButton/WhatsAppButton";
import { defaultCardVariant } from "@/lib/cms/card-variants";
import { loadLiveCategories, loadLiveProducts } from "@/lib/cms/catalog-repository";
import type { Category, Product } from "@/lib/cms/catalog-types";
import { loadPublished, pickSection } from "@/lib/cms/published";
import { publicMetadata, siteName } from "@/lib/seo/metadata";
import { breadcrumbGraph, catalogGraph } from "@/lib/seo/structured-data";

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

/** La URL canónica de un corte del catálogo.
 *
 * Cada página del paginado es canónica de sí misma, incluida la página 2. Antes
 * apuntaban todas a la lista sin paginar, que es lo que parece razonable pero es
 * justo lo que Google pide no hacer: dice explícitamente que no se canonicen las
 * páginas de una secuencia a la primera, porque las plantas que sólo aparecen en
 * la página 2 dejan de tener una URL indexable y desaparecen del índice.
 *
 * El número que entra es el que se dibuja —ya recortado al total— así que una
 * `?pagina=99` canoniza a la última página real y no inventa una URL vacía. */
function canonicalPath(categorySlug: string, page: number): string {
  const params = new URLSearchParams();
  if (categorySlug) params.set("categoria", categorySlug);
  if (page > 1) params.set("pagina", String(page));

  const query = params.toString();
  return query ? `/catalogo?${query}` : "/catalogo";
}

/** Cuántas páginas tiene el corte, y en cuál se cae realmente. */
function resolvePage(products: Product[], category: Category | undefined, page: number) {
  const matching = category
    ? products.filter((product) => product.category === category.name)
    : products;
  const totalPages = Math.max(1, Math.ceil(matching.length / CATALOG_PAGE_SIZE));
  const current = Math.min(page, totalPages);

  return {
    matching,
    totalPages,
    current,
    visible: matching.slice((current - 1) * CATALOG_PAGE_SIZE, current * CATALOG_PAGE_SIZE),
  };
}

export async function generateMetadata({
  searchParams,
}: PageProps<"/catalogo">): Promise<Metadata> {
  const { categorySlug, page } = readParams(await searchParams);
  const [sections, categories, products] = await Promise.all([
    loadPublished(),
    loadLiveCategories(),
    loadLiveProducts(),
  ]);
  const category = categories.find((candidate) => candidate.slug === categorySlug);
  const { current } = resolvePage(products, category, page);

  const suffix = siteName(sections);
  const name = category ? `${category.name} · Catálogo` : "Catálogo";
  const base = `${name} · ${suffix}`;

  return publicMetadata({
    sections,
    title: current > 1 ? `${base} · Página ${current}` : base,
    description:
      category?.short ||
      category?.description ||
      pickSection(sections, "seo")?.metaDescription ||
      "Todas las plantas publicadas del vivero, con filtro por categoría.",
    canonical: canonicalPath(categorySlug, current),
  });
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

  const { current, visible } = resolvePage(products, selected, page);

  const header = pickSection(sections, "header");
  const footer = pickSection(sections, "footer");
  const contact = pickSection(sections, "contact");
  // La card del catálogo es una decisión de diseño del cliente: esta página usa
  // la misma que la landing para que no parezca otro sitio.
  const variant = pickSection(sections, "cards")?.variant ?? defaultCardVariant;

  const content = (
    <>
      {/* Las migas que Google dibuja arriba del resultado en lugar de la URL. */}
      <JsonLd
        data={breadcrumbGraph([
          { name: "Inicio", path: "/" },
          selected
            ? { name: "Catálogo", path: "/catalogo" }
            : { name: "Catálogo" },
          ...(selected ? [{ name: selected.name }] : []),
        ])}
      />
      {/* La lista de la página que se está viendo, en el mismo orden. Le ahorra
          a Google deducir de la grilla cuáles son los elementos. */}
      <JsonLd
        data={catalogGraph({
          products: visible,
          firstPosition: (current - 1) * CATALOG_PAGE_SIZE + 1,
          path: canonicalPath(categorySlug, current),
          name: selected ? `${selected.name} · Catálogo` : "Catálogo",
          description: selected?.short || selected?.description,
        })}
      />
      <main className="min-w-0">
        <CatalogBrowser
          variant={variant}
          products={products}
          categories={categories}
          categorySlug={categorySlug}
          // Una página fuera de rango muestra la última en vez de un 404: el
          // catálogo cambia seguido y un enlace viejo tiene que seguir llevando
          // a algo.
          page={current}
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

import Link from "next/link";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import {
  isDarkVariant,
  ProductGrid,
  sectionBackground,
} from "@/components/organisms/ProductCatalog/ProductGrid";
import type { CardVariantId } from "@/lib/cms/card-variants";
import type { Category, Product } from "@/lib/cms/catalog-types";
import { cn } from "@/lib/utils";

/** Plantas por página.
 *
 * No sigue a `LANDING_CATALOG_LIMIT` a propósito: ese tope es cuánto asoma la
 * portada —una decisión de diseño de la landing, de ahí que se regule por
 * variable de entorno— y éste es cuánto entra en una página de la lista
 * completa, que depende de cuánto scroll es razonable pedir. */
export const CATALOG_PAGE_SIZE = 15;

export interface CatalogBrowserProps {
  variant: CardVariantId;
  /** Todo el catálogo publicado, sin filtrar: el filtro y el corte de página se
   * resuelven acá para poder contar cuántas plantas tiene cada categoría. */
  products: Product[];
  /** Categorías publicadas, en el orden del CMS. */
  categories: Category[];
  /** Slug de la categoría elegida, o `""` para todas. */
  categorySlug: string;
  /** Página pedida, 1 en adelante. Ya acotada por la página al rango real. */
  page: number;
}

/** Ruta del catálogo con filtro y página. Los valores por defecto no se
 * escriben en la URL: `/catalogo` y `/catalogo?pagina=1` son la misma lista y
 * conviene que tengan una sola dirección. */
function catalogHref(categorySlug: string, page: number): string {
  const query = new URLSearchParams();
  if (categorySlug) query.set("categoria", categorySlug);
  if (page > 1) query.set("pagina", String(page));
  const search = query.toString();
  return search ? `/catalogo?${search}` : "/catalogo";
}

/** Números de página a dibujar. Con pocas páginas van todas; con muchas, las
 * puntas y una ventana alrededor de la actual, y los saltos se marcan con
 * `null` para dibujar los puntos suspensivos. */
function pageWindow(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  const around = [current - 1, current, current + 1].filter((page) => page > 1 && page < total);
  const pages = [1, ...around, total];

  return pages.flatMap((page, index) => {
    const previous = pages[index - 1];
    return previous !== undefined && page - previous > 1 ? [null, page] : [page];
  });
}

/** Catálogo completo: filtro por categoría, grilla y paginado.
 *
 * Todo se resuelve con enlaces y no con estado de cliente: así cada
 * combinación de filtro y página tiene su propia URL —se comparte, se marca y
 * vuelve con el botón de atrás— y la grilla sigue siendo un componente de
 * servidor, igual que en la landing. */
export function CatalogBrowser({
  variant,
  products,
  categories,
  categorySlug,
  page,
}: CatalogBrowserProps) {
  const dark = isDarkVariant(variant);

  // `Product.category` guarda el nombre de la categoría, no su slug: el filtro
  // traduce uno en otro contra las categorías publicadas.
  const selected = categories.find((category) => category.slug === categorySlug);
  const filtered = selected
    ? products.filter((product) => product.category === selected.name)
    : products;

  const totalPages = Math.max(1, Math.ceil(filtered.length / CATALOG_PAGE_SIZE));
  const startIndex = (page - 1) * CATALOG_PAGE_SIZE;
  const visible = filtered.slice(startIndex, startIndex + CATALOG_PAGE_SIZE);

  // Una categoría sin plantas publicadas no se ofrece: el filtro llevaría a una
  // lista vacía.
  const filters = [
    { slug: "", label: "Todas", count: products.length },
    ...categories
      .map((category) => ({
        slug: category.slug,
        label: category.name,
        count: products.filter((product) => product.category === category.name).length,
      }))
      .filter((category) => category.count > 0),
  ];

  const pages = pageWindow(page, totalPages);

  return (
    <section
      id="catalogo"
      aria-labelledby="catalogo-titulo"
      className={cn("site-gutter py-14 md:py-20", sectionBackground[variant])}
    >
      <div className="max-w-[720px]">
        <Eyebrow tone={dark ? "cream" : "terracotta"}>Catálogo completo</Eyebrow>
        <h1
          id="catalogo-titulo"
          className={cn(
            "mt-3 font-display text-[38px] font-normal leading-[1.05] sm:text-[48px] lg:text-[56px]",
            dark ? "text-[#F9F6EF]" : "text-forest",
          )}
        >
          {selected ? selected.name : "Todas las plantas del vivero"}
        </h1>
        <p
          className={cn(
            "mt-4 text-base leading-[1.6] md:text-lg",
            dark ? "text-[#D5DCCF]" : "text-ink",
          )}
        >
          {selected?.short ||
            "Filtrá por categoría para encontrar más rápido. Si no ves lo que buscás, escribinos: cortamos y armamos a pedido."}
        </p>
      </div>

      <nav aria-label="Filtrar por categoría" className="mt-8 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const active = filter.slug === categorySlug;
          return (
            <Link
              key={filter.slug || "todas"}
              href={catalogHref(filter.slug, 1)}
              aria-current={active ? "page" : undefined}
              scroll={false}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors duration-200",
                active
                  ? "border-forest bg-forest text-paper"
                  : dark
                    ? "border-paper/30 text-[#D5DCCF] hover:border-paper hover:text-paper"
                    : "border-forest/25 text-ink hover:border-forest hover:text-forest",
              )}
            >
              {filter.label}
              <span className="ml-2 opacity-60">{filter.count}</span>
            </Link>
          );
        })}
      </nav>

      {visible.length === 0 ? (
        <p className={cn("mt-12 text-base", dark ? "text-[#D5DCCF]" : "text-ink")}>
          {selected
            ? "Todavía no hay plantas publicadas en esta categoría."
            : "Todavía no hay plantas publicadas en el catálogo."}
        </p>
      ) : (
        <>
          <div className="mt-10">
            <ProductGrid variant={variant} products={visible} startIndex={startIndex} />
          </div>

          <div className="mt-12 flex flex-col items-center gap-4">
            <p className={cn("text-sm", dark ? "text-[#D5DCCF]" : "text-ink")}>
              {startIndex + 1}–{startIndex + visible.length} de {filtered.length} plantas
            </p>

            {totalPages > 1 && (
              <nav aria-label="Paginado del catálogo" className="flex flex-wrap items-center gap-2">
                <PageLink
                  href={catalogHref(categorySlug, page - 1)}
                  dark={dark}
                  disabled={page === 1}
                  label="Página anterior"
                >
                  ←
                </PageLink>

                {pages.map((candidate, index) =>
                  candidate === null ? (
                    <span
                      key={`salto-${index}`}
                      aria-hidden
                      className={cn("px-1 text-sm", dark ? "text-[#D5DCCF]" : "text-ink")}
                    >
                      …
                    </span>
                  ) : (
                    <PageLink
                      key={candidate}
                      href={catalogHref(categorySlug, candidate)}
                      dark={dark}
                      active={candidate === page}
                      label={`Página ${candidate}`}
                    >
                      {candidate}
                    </PageLink>
                  ),
                )}

                <PageLink
                  href={catalogHref(categorySlug, page + 1)}
                  dark={dark}
                  disabled={page === totalPages}
                  label="Página siguiente"
                >
                  →
                </PageLink>
              </nav>
            )}
          </div>
        </>
      )}
    </section>
  );
}

interface PageLinkProps {
  href: string;
  children: React.ReactNode;
  /** Texto para lectores de pantalla: el visible es un número o una flecha. */
  label: string;
  dark: boolean;
  active?: boolean;
  /** Las puntas del paginado. Se dibujan como `<span>` y no como enlace: no hay
   * adónde ir, y un enlace deshabilitado igual recibe el foco. */
  disabled?: boolean;
}

function PageLink({ href, children, label, dark, active = false, disabled = false }: PageLinkProps) {
  const classes = cn(
    "inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm transition-colors duration-200",
    active
      ? "border-forest bg-forest text-paper"
      : dark
        ? "border-paper/30 text-[#D5DCCF] hover:border-paper hover:text-paper"
        : "border-forest/25 text-ink hover:border-forest hover:text-forest",
  );

  if (disabled) {
    return (
      <span aria-hidden className={cn(classes, "opacity-35")}>
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      scroll={false}
      className={classes}
    >
      {children}
    </Link>
  );
}

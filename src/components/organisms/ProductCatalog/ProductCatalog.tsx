import { Eyebrow } from "@/components/atoms/Eyebrow";
import { ProductCardArch } from "@/components/molecules/ProductCardArch";
import { ProductCardCircle } from "@/components/molecules/ProductCardCircle";
import { ProductCardDrawer } from "@/components/molecules/ProductCardDrawer";
import { ProductCardEditorialRow } from "@/components/molecules/ProductCardEditorialRow";
import { ProductCardOverlay } from "@/components/molecules/ProductCardOverlay";
import { loadLiveProducts } from "@/lib/cms/catalog-repository";
import { productHref, type Product } from "@/lib/cms/catalog-types";
import type { CardVariantId } from "@/lib/cms/card-variants";
import { cn } from "@/lib/utils";

export interface ProductCatalogProps {
  variant: CardVariantId;
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Qué mostrar. Por defecto, todo el catálogo publicado; la ficha de producto
   * le pasa las plantas de la misma categoría. */
  products?: Product[];
  /** Ancla de la sección. La landing la usa como destino del menú, así que una
   * grilla relacionada tiene que pedir la suya para no duplicar el `id`. */
  anchorId?: string;
}

/** Fondo de sección por variante: algunas cards usan texto claro y sólo se leen
 * sobre verde. Es el mismo criterio que `previewBg` en `card-variants.ts`. */
const sectionBackground: Record<CardVariantId, string> = {
  overlay: "bg-paper",
  arch: "bg-paper-light",
  drawer: "bg-forest",
  row: "bg-paper",
  circle: "bg-cream",
};

const gridClasses: Record<CardVariantId, string> = {
  overlay: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[26px]",
  arch: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[26px]",
  drawer: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[26px]",
  row: "flex flex-col gap-4",
  circle: "grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-[26px]",
};

/** Las cards oscuras invierten el color del encabezado de la sección. */
function isDarkVariant(variant: CardVariantId): boolean {
  return variant === "drawer";
}

function careMeta(product: Product): string {
  return `${product.light} · riego ${product.water.toLowerCase()}`;
}

function renderCard(variant: CardVariantId, product: Product, index: number) {
  const href = productHref(product);

  switch (variant) {
    case "overlay":
      return (
        <ProductCardOverlay
          key={product.id}
          href={href}
          category={`${product.category} · ${product.light}`}
          name={product.name}
          imageLabel={product.name}
          tags={[`Riego ${product.water.toLowerCase()}`, product.difficulty]}
        />
      );

    case "arch":
      return (
        <ProductCardArch
          key={product.id}
          href={href}
          name={product.name}
          subtitle={product.latin}
          imageLabel={product.name}
          specs={[
            { label: "Luz", value: product.light },
            { label: "Riego", value: product.water },
            { label: "Altura", value: product.height },
          ]}
        />
      );

    case "drawer":
      return (
        <ProductCardDrawer
          key={product.id}
          href={href}
          badge={product.category}
          name={product.name}
          imageLabel={product.name}
          description={product.long}
        />
      );

    case "row":
      return (
        <ProductCardEditorialRow
          key={product.id}
          href={href}
          index={String(index + 1).padStart(2, "0")}
          category={`${product.category} · ${product.difficulty}`}
          name={product.name}
          imageLabel={product.name}
          description={product.long}
        />
      );

    case "circle":
      return (
        <ProductCardCircle
          key={product.id}
          href={href}
          name={product.name}
          imageLabel={product.name}
          meta={careMeta(product)}
        />
      );
  }
}

/** Catálogo público de plantas, con la card que se eligió en el CMS.
 *
 * Los productos salen de la colección `products` del sitio; sólo se muestran los
 * que están en `live`. La lectura va cacheada contra `CATALOG_TAG`, así que una
 * visita no implica una consulta a Firestore mientras no se edite el catálogo. */
export async function ProductCatalog({
  variant,
  eyebrow = "Catálogo",
  title = "Lo que hay hoy en el vivero",
  description = "Cada planta sale aclimatada, con maceta, sustrato propio y una ficha de riego escrita a mano. Si no encontrás lo que buscás, escribinos: cortamos y armamos a pedido.",
  products,
  anchorId = "catalogo",
}: ProductCatalogProps) {
  const items = products ?? (await loadLiveProducts());
  const dark = isDarkVariant(variant);

  if (items.length === 0) return null;

  const titleId = `${anchorId}-titulo`;

  return (
    <section
      id={anchorId}
      aria-labelledby={titleId}
      className={cn("site-gutter py-16 md:py-24", sectionBackground[variant])}
    >
      <div className="mb-10 max-w-[620px] lg:mb-14">
        <Eyebrow tone={dark ? "cream" : "terracotta"}>{eyebrow}</Eyebrow>
        <h2
          id={titleId}
          className={cn(
            "mt-3 font-display text-[38px] font-normal leading-[1.05] sm:text-[48px] lg:text-[56px]",
            dark ? "text-[#F9F6EF]" : "text-forest",
          )}
        >
          {title}
        </h2>
        {/* La grilla de relacionados del detalle no lleva bajada: el título ya
            dice todo lo que hay que decir. */}
        {description && (
          <p
            className={cn(
              "mt-4 text-base leading-[1.6] md:text-lg",
              dark ? "text-[#D5DCCF]" : "text-ink",
            )}
          >
            {description}
          </p>
        )}
      </div>

      <div className={gridClasses[variant]}>
        {items.map((product, index) => renderCard(variant, product, index))}
      </div>
    </section>
  );
}

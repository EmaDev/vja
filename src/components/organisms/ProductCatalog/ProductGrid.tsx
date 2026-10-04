import { ProductCardArch } from "@/components/molecules/ProductCardArch";
import { ProductCardCircle } from "@/components/molecules/ProductCardCircle";
import { ProductCardDrawer } from "@/components/molecules/ProductCardDrawer";
import { ProductCardEditorialRow } from "@/components/molecules/ProductCardEditorialRow";
import { ProductCardOverlay } from "@/components/molecules/ProductCardOverlay";
import { Reveal, STAGGER } from "@/components/motion/Reveal";
import { markdownToPlain } from "@/lib/cms/markdown";
import { productCover, productHref, type Product } from "@/lib/cms/catalog-types";
import type { CardVariantId } from "@/lib/cms/card-variants";

/** Fondo de sección por variante: algunas cards usan texto claro y sólo se leen
 * sobre verde. Es el mismo criterio que `previewBg` en `card-variants.ts`. */
export const sectionBackground: Record<CardVariantId, string> = {
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

/** Cuántas columnas tiene la grilla en pantalla grande.
 *
 * La demora de entrada se calcula con el resto de dividir por este número, no
 * con el índice entero: las cards se revelan por fila a medida que la fila entra
 * en pantalla, así que encadenar las quince del catálogo dejaría a la última
 * esperando más de un segundo después de estar a la vista. Por columna, en
 * cambio, cada fila barre de izquierda a derecha y arranca de cero en la
 * siguiente. La lista editorial es una sola columna y no escalona nada. */
const staggerColumns: Record<CardVariantId, number> = {
  overlay: 3,
  arch: 3,
  drawer: 3,
  row: 1,
  circle: 4,
};

/** Clase del envoltorio de entrada, por variante.
 *
 * El envoltorio pasa a ser el hijo de la grilla, así que es él quien se estira
 * al alto de la fila y la card adentro se quedaría en su alto natural. Las dos
 * variantes que miden distinto según cuánto texto traigan —la de arco y la
 * circular— necesitan que ese estirón les llegue. Las demás traen alto fijo y
 * forzarlas lo rompería. */
const itemClasses: Record<CardVariantId, string | undefined> = {
  overlay: undefined,
  arch: "h-full [&>*]:h-full",
  drawer: undefined,
  row: undefined,
  circle: "h-full [&>*]:h-full",
};

/** Las cards oscuras invierten el color del encabezado de la sección. */
export function isDarkVariant(variant: CardVariantId): boolean {
  return variant === "drawer";
}

function renderCard(variant: CardVariantId, product: Product, index: number) {
  const href = productHref(product);
  // La portada es la primera foto cargada. Sin fotos, `image` queda `undefined` y
  // la card dibuja el recuadro con el nombre, igual que antes.
  const cover = productCover(product);
  const image = cover?.imageUrl;
  const imageAlt = cover?.imageAlt || product.name;

  switch (variant) {
    case "overlay":
      return (
        <ProductCardOverlay
          key={product.id}
          href={href}
          image={image}
          imageAlt={imageAlt}
          category={product.category}
          name={product.name}
          imageLabel={product.name}
          tags={product.tags}
        />
      );

    case "arch":
      return (
        <ProductCardArch
          key={product.id}
          href={href}
          image={image}
          imageAlt={imageAlt}
          name={product.name}
          subtitle={product.latin}
          imageLabel={product.name}
          description={product.short}
        />
      );

    case "drawer":
      return (
        <ProductCardDrawer
          key={product.id}
          href={href}
          image={image}
          imageAlt={imageAlt}
          badge={product.category}
          name={product.name}
          imageLabel={product.name}
          description={markdownToPlain(product.long)}
        />
      );

    case "row":
      return (
        <ProductCardEditorialRow
          key={product.id}
          href={href}
          image={image}
          imageAlt={imageAlt}
          index={String(index + 1).padStart(2, "0")}
          category={product.category}
          name={product.name}
          imageLabel={product.name}
          description={markdownToPlain(product.long)}
        />
      );

    case "circle":
      return (
        <ProductCardCircle
          key={product.id}
          href={href}
          image={image}
          imageAlt={imageAlt}
          name={product.name}
          imageLabel={product.name}
          meta={product.short}
        />
      );
  }
}

export interface ProductGridProps {
  variant: CardVariantId;
  products: Product[];
  /** Arranque de la numeración visible. Sólo la mira la card editorial, que
   * muestra el índice: en la página 2 del catálogo la lista sigue en 16 y no
   * vuelve a empezar en 01. */
  startIndex?: number;
}

/** Grilla de cards del catálogo, con la variante elegida en el CMS.
 *
 * Vive aparte de `ProductCatalog` porque la página `/catalogo` dibuja su propio
 * encabezado —filtros y paginado— alrededor de la misma grilla. */
export function ProductGrid({ variant, products, startIndex = 0 }: ProductGridProps) {
  const columns = staggerColumns[variant];

  return (
    <div className={gridClasses[variant]}>
      {products.map((product, index) => (
        <Reveal
          key={product.id}
          delay={(index % columns) * STAGGER}
          duration={0.65}
          amount={0.12}
          className={itemClasses[variant]}
        >
          {renderCard(variant, product, startIndex + index)}
        </Reveal>
      ))}
    </div>
  );
}

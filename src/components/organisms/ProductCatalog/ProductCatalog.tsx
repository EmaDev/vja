import { CtaButton } from "@/components/atoms/CtaButton";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { isDarkVariant, ProductGrid, sectionBackground } from "./ProductGrid";
import { loadLiveProducts } from "@/lib/cms/catalog-repository";
import type { Product } from "@/lib/cms/catalog-types";
import type { CardVariantId } from "@/lib/cms/card-variants";
import { cn } from "@/lib/utils";

/** Cuánto muestra la landing cuando la variable de entorno no dice otra cosa. */
const DEFAULT_LANDING_CATALOG_LIMIT = 15;

/** Lee el tope de `LANDING_CATALOG_LIMIT`.
 *
 * Se exige un entero positivo escrito solo: `parseInt` leería `1.5` como 1 y
 * `20 plantas` como 20, y un tope equivocado se descubre tarde —cuando alguien
 * cuenta las cards de la portada— y no al levantar el sitio. Cualquier otra
 * cosa, incluida la variable ausente, cae en el valor por defecto. */
function readLandingLimit(raw: string | undefined): number {
  const value = (raw ?? "").trim();
  if (!/^\d+$/.test(value)) return DEFAULT_LANDING_CATALOG_LIMIT;

  const parsed = Number(value);
  return parsed > 0 ? parsed : DEFAULT_LANDING_CATALOG_LIMIT;
}

/** Cuántas plantas entran en la grilla de la landing. El resto se ve en
 * `/catalogo`, que es donde están los filtros y el paginado: la portada muestra
 * una muestra y no el catálogo entero.
 *
 * Se resuelve al cargar el módulo, así que cambiar la variable pide reiniciar
 * el servidor. Es una variable de servidor —sin `NEXT_PUBLIC_`— y tiene que
 * seguir así: todos los que importan este módulo se ejecutan en el servidor, y
 * el prefijo la grabaría en el bundle del navegador sin necesidad. */
export const LANDING_CATALOG_LIMIT = readLandingLimit(process.env.LANDING_CATALOG_LIMIT);

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
  /** Tope de cards a dibujar. Sin tope se muestran todas las que lleguen. */
  limit?: number;
  /** Destino del botón del pie. Con `href` el botón se dibuja siempre, incluso
   * si el tope no dejó ninguna planta afuera: `/catalogo` es la lista con
   * filtro por categoría, así que sigue ofreciendo algo que la portada no tiene
   * aunque muestre las mismas plantas. */
  moreHref?: string;
  moreLabel?: string;
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
  limit,
  moreHref,
  moreLabel = "Ver más plantas",
}: ProductCatalogProps) {
  const items = products ?? (await loadLiveProducts());
  const dark = isDarkVariant(variant);

  if (items.length === 0) return null;

  const visible = limit ? items.slice(0, limit) : items;
  // La leyenda sí depende del recorte: "Mostrando 4 de 4" no informa nada y
  // deja al botón explicándose solo, que es lo que corresponde cuando la
  // portada ya muestra todo el catálogo.
  const hidden = items.length - visible.length;
  const titleId = `${anchorId}-titulo`;

  return (
    <section
      id={anchorId}
      aria-labelledby={titleId}
      className={cn("site-gutter py-16 md:py-24", sectionBackground[variant])}
    >
      <div className="mb-10 max-w-[620px] lg:mb-14">
        <Reveal animation="fade" duration={0.5}>
          <Eyebrow tone={dark ? "cream" : "terracotta"}>{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2
            id={titleId}
            className={cn(
              "mt-3 font-display text-[38px] font-normal leading-[1.05] sm:text-[48px] lg:text-[56px]",
              dark ? "text-[#F9F6EF]" : "text-forest",
            )}
          >
            {title}
          </h2>
        </Reveal>
        {/* La grilla de relacionados del detalle no lleva bajada: el título ya
            dice todo lo que hay que decir. */}
        {description && (
          <Reveal delay={0.16}>
            <p
              className={cn(
                "mt-4 text-base leading-[1.6] md:text-lg",
                dark ? "text-[#D5DCCF]" : "text-ink",
              )}
            >
              {description}
            </p>
          </Reveal>
        )}
      </div>

      <ProductGrid variant={variant} products={visible} />

      {moreHref && (
        <Reveal className="mt-10 flex flex-col items-center gap-2 lg:mt-14">
          <CtaButton href={moreHref} tone={dark ? "paper" : "forest"}>
            {moreLabel}
          </CtaButton>
          {hidden > 0 && (
            <p className={cn("text-sm", dark ? "text-[#D5DCCF]" : "text-ink")}>
              Mostrando {visible.length} de {items.length} plantas
            </p>
          )}
        </Reveal>
      )}
    </section>
  );
}

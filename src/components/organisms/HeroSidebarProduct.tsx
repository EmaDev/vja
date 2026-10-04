import { CtaButton } from "@/components/atoms/CtaButton";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import type { MiniProductTileProps } from "@/components/molecules/MiniProductTile";
import { SidebarNav } from "@/components/molecules/SidebarNav";
import { TrendingProductsRow } from "@/components/molecules/TrendingProductsRow";
import { cn } from "@/lib/utils";

export type HeroSidebarProductProps = {
  eyebrow?: string;
  titleLine1?: string;
  titleEmphasis?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  /** Foto de fondo del hero. Va atenuada bajo un velo verde para que el titular
   * en papel siga teniendo contraste suficiente. */
  image?: string;
  imageAlt?: string;
  products?: MiniProductTileProps[];
  showHeader?: boolean;
};

const defaultProducts: MiniProductTileProps[] = [
  { imageLabel: "Ficus", name: "Ficus Lyrata", meta: "Interior · 1,4 m" },
  { imageLabel: "Ramo", name: "Ramo del día", meta: "Corte del día" },
  { imageLabel: "Pothos", name: "Pothos colgante", meta: "Colgante" },
  { imageLabel: "Kokedama", name: "Kokedama", meta: "Sin maceta" },
];

/** Fixed sidebar nav + dark hero + a trending-products strip. Mockup ref: 1e.
 * Con `showHeader={false}` la columna del sidebar desaparece y el hero ocupa todo
 * el ancho: la landing ya montó el header elegido en el CMS por fuera. */
export function HeroSidebarProduct({
  eyebrow,
  titleLine1 = "El vivero,",
  titleEmphasis = "ahora a domicilio",
  description = "Elegí por rincón de la casa, por luz o por lo poco que quieras ocuparte. Nosotros nos encargamos del resto.",
  primaryCtaLabel = "Empezar a elegir",
  primaryCtaHref,
  secondaryCtaLabel = "Ver el vivero",
  secondaryCtaHref,
  image,
  imageAlt,
  products = defaultProducts,
  showHeader = true,
}: HeroSidebarProductProps) {
  return (
    <div
      className={cn(
        "relative grid min-h-[620px] bg-forest lg:min-h-[720px]",
        showHeader && "lg:grid-cols-[232px_1fr]",
      )}
    >
      {image ? (
        <div className="pointer-events-none absolute inset-0">
          <ImagePlaceholder src={image} alt={imageAlt ?? ""} priority className="absolute inset-0" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,31,19,0.82)_0%,rgba(14,31,19,0.68)_55%,rgba(14,31,19,0.92)_100%)]" />
        </div>
      ) : null}

      {showHeader ? (
        <div className="relative hidden lg:block">
          <SidebarNav />
        </div>
      ) : null}
      <div className="site-gutter relative flex flex-col justify-between gap-12 pb-10 pt-10 md:pt-12 lg:[--site-gutter:3rem]">
        <div className="hidden justify-end gap-6 text-[13px] uppercase tracking-[0.1em] text-[#9FB09A] lg:flex">
          <span>Buscar</span>
          <span>ES / EN</span>
        </div>
        <div className="max-w-[780px] animate-[rp-rise_0.8s_ease_both]">
          {eyebrow ? <Eyebrow tone="sage">{eyebrow}</Eyebrow> : null}
          <h1 className="mt-4 font-display text-[48px] font-normal leading-[1] text-[#F9F6EF] sm:text-[64px] lg:text-[80px] lg:leading-[0.95] xl:text-[98px]">
            {titleLine1}
            {titleEmphasis ? (
              <>
                <br />
                <em className="text-[#9FC49F]">{titleEmphasis}</em>
              </>
            ) : null}
          </h1>
          <p className="mt-5 max-w-[480px] text-base leading-[1.6] text-[#D5DCCF] md:text-[19px] lg:mt-[26px]">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3.5 lg:mt-[34px]">
            {primaryCtaLabel ? (
              <CtaButton href={primaryCtaHref} tone="terracotta" shape="rounded">
                {primaryCtaLabel}
              </CtaButton>
            ) : null}
            {secondaryCtaLabel ? (
              <CtaButton href={secondaryCtaHref} tone="paper" variant="outline" shape="rounded">
                {secondaryCtaLabel}
              </CtaButton>
            ) : null}
          </div>
        </div>
        <TrendingProductsRow products={products} />
      </div>
    </div>
  );
}

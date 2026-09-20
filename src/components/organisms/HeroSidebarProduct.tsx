import { CtaButton } from "@/components/atoms/CtaButton";
import type { MiniProductTileProps } from "@/components/molecules/MiniProductTile";
import { SidebarNav } from "@/components/molecules/SidebarNav";
import { TrendingProductsRow } from "@/components/molecules/TrendingProductsRow";

export type HeroSidebarProductProps = {
  titleLine1?: string;
  titleLine2Prefix?: string;
  titleEmphasis?: string;
  description?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  products?: MiniProductTileProps[];
};

const defaultProducts: MiniProductTileProps[] = [
  { imageLabel: "Ficus", name: "Ficus Lyrata", meta: "Interior · 1,4 m" },
  { imageLabel: "Ramo", name: "Ramo del día", meta: "Corte del día" },
  { imageLabel: "Pothos", name: "Pothos colgante", meta: "Colgante" },
  { imageLabel: "Kokedama", name: "Kokedama", meta: "Sin maceta" },
];

/** Fixed sidebar nav + dark hero + a trending-products strip. Mockup ref: 1e. */
export function HeroSidebarProduct({
  titleLine1 = "El vivero,",
  titleLine2Prefix = "ahora a ",
  titleEmphasis = "domicilio",
  description = "Elegí por rincón de la casa, por luz o por lo poco que quieras ocuparte. Nosotros nos encargamos del resto.",
  primaryCtaLabel = "Empezar a elegir",
  secondaryCtaLabel = "Ver el vivero",
  products = defaultProducts,
}: HeroSidebarProductProps) {
  return (
    <div className="grid min-h-[720px] grid-cols-[232px_1fr] bg-forest">
      <SidebarNav />
      <div className="flex flex-col justify-between px-12 pb-10 pt-12">
        <div className="flex justify-end gap-6 text-[13px] uppercase tracking-[0.1em] text-[#9FB09A]">
          <span>Buscar</span>
          <span>Ingresar</span>
          <span>ES / EN</span>
        </div>
        <div className="max-w-[780px] animate-[rp-rise_0.8s_ease_both]">
          <h1 className="font-display text-[98px] font-normal leading-[0.95] text-[#F9F6EF]">
            {titleLine1}
            <br />
            {titleLine2Prefix}
            <em className="text-[#9FC49F]">{titleEmphasis}</em>
          </h1>
          <p className="mt-[26px] max-w-[480px] text-[19px] leading-[1.6] text-[#D5DCCF]">
            {description}
          </p>
          <div className="mt-[34px] flex gap-3.5">
            <CtaButton tone="terracotta" shape="rounded">
              {primaryCtaLabel}
            </CtaButton>
            <CtaButton tone="paper" variant="outline" shape="rounded">
              {secondaryCtaLabel}
            </CtaButton>
          </div>
        </div>
        <TrendingProductsRow products={products} />
      </div>
    </div>
  );
}

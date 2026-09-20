import { CtaButton } from "@/components/atoms/CtaButton";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { FloatingBadge } from "@/components/atoms/FloatingBadge";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import { StatBlock } from "@/components/atoms/StatBlock";
import { TextLink } from "@/components/atoms/TextLink";
import { SiteHeaderCentered } from "@/components/molecules/SiteHeaderCentered";

export type HeroEditorialSplitProps = {
  eyebrow?: string;
  titleLine1?: string;
  titleEmphasis?: string;
  description?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  stats?: { value: string; label: string }[];
  image?: string;
  imageLabel?: string;
  featured?: { eyebrow: string; title: string; subtitle: string };
};

const defaultStats = [
  { value: "240+", label: "especies" },
  { value: "24 h", label: "envío en CABA" },
  { value: "30 d", label: "garantía de vida" },
];

/** Editorial split hero: centered header, copy left, portrait photo with a favorite callout right. Mockup ref: 1a. */
export function HeroEditorialSplit({
  eyebrow = "Temporada de interior",
  titleLine1 = "Plantas que",
  titleEmphasis = "viven bien en tu casa",
  description = "Seleccionamos cada especie a mano en nuestro vivero de Tigre. Llega con maceta, sustrato y una ficha de cuidados escrita por nosotros.",
  primaryCtaLabel = "Ver catálogo",
  secondaryCtaLabel = "Armar mi ramo →",
  stats = defaultStats,
  image,
  imageLabel = "Foto vertical: monstera junto a ventana",
  featured = { eyebrow: "Favorita", title: "Monstera Deliciosa", subtitle: "Luz media" },
}: HeroEditorialSplitProps) {
  return (
    <div className="bg-paper">
      <SiteHeaderCentered />
      <div className="grid min-h-[620px] grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] items-stretch">
        <div className="flex animate-[rp-rise_0.7s_ease_both] flex-col justify-center px-14 py-20">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-[22px] text-pretty font-display text-[88px] font-normal leading-[0.98] text-forest">
            {titleLine1}
            <br />
            <em className="text-sage">{titleEmphasis}</em>
          </h1>
          <p className="mt-[26px] max-w-[430px] text-lg leading-[1.6] text-ink">{description}</p>
          <div className="mt-[38px] flex items-center gap-3.5">
            <CtaButton>{primaryCtaLabel}</CtaButton>
            <TextLink>{secondaryCtaLabel}</TextLink>
          </div>
          <div className="mt-16 flex gap-10 border-t border-line pt-[26px]">
            {stats.map((stat) => (
              <StatBlock key={stat.label} {...stat} />
            ))}
          </div>
        </div>
        <div className="relative bg-sand">
          <ImagePlaceholder src={image} alt={titleEmphasis} label={imageLabel} />
          <FloatingBadge
            className="absolute bottom-14 left-[-56px] w-[196px]"
            eyebrow={featured.eyebrow}
            title={featured.title}
            subtitle={featured.subtitle}
          />
        </div>
      </div>
    </div>
  );
}

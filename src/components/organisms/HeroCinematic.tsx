import { Eyebrow } from "@/components/atoms/Eyebrow";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import { TextLink } from "@/components/atoms/TextLink";
import { FloatingHeader } from "@/components/molecules/FloatingHeader";

export type HeroCinematicProps = {
  eyebrow?: string;
  titleLine1?: string;
  titleLine2?: string;
  description?: string;
  note?: string;
  ctaLabel?: string;
  ctaHref?: string;
  image?: string;
  imageAlt?: string;
  imageLabel?: string;
  showHeader?: boolean;
};

/** Full-bleed cinematic hero with a floating glass header. Mockup ref: 1b. */
export function HeroCinematic({
  eyebrow = "Floristería y vivero",
  titleLine1 = "Un poco de selva",
  titleLine2 = "para tu living",
  description = "Plantas, flores frescas y arreglos a medida. Entregamos todos los días antes de las 18 h.",
  note = "Envío el mismo día en CABA y GBA norte.",
  ctaLabel = "Ver flores de temporada →",
  ctaHref,
  image,
  imageAlt,
  imageLabel = "Foto apaisada: invernadero con luz difusa",
  showHeader = true,
}: HeroCinematicProps) {
  return (
    <div className="relative h-[560px] overflow-hidden bg-forest md:h-[660px] lg:h-[760px]">
      <ImagePlaceholder
        src={image}
        alt={imageAlt ?? titleLine1}
        label={imageLabel}
        className="absolute inset-0"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(12,26,16,0.66)_0%,rgba(12,26,16,0.18)_38%,rgba(12,26,16,0.82)_100%)]" />
      {showHeader ? <FloatingHeader /> : null}
      <div className="site-inset pointer-events-none absolute bottom-10 flex flex-col items-start gap-8 lg:bottom-16 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:[--site-gutter:3rem]">
        <div className="max-w-[760px] animate-[rp-rise_0.9s_ease_both]">
          {eyebrow ? <Eyebrow tone="cream">{eyebrow}</Eyebrow> : null}
          <h1 className="mt-4 font-display text-[48px] font-normal leading-[0.98] text-[#F9F6EF] sm:text-[64px] lg:mt-5 lg:text-[84px] lg:leading-[0.94] xl:text-[104px]">
            {titleLine1}
            {titleLine2 ? (
              <>
                <br />
                {titleLine2}
              </>
            ) : null}
          </h1>
          <p className="mt-5 max-w-[520px] text-base leading-[1.6] text-[#EDE8DA] md:text-[19px] lg:mt-6">
            {description}
          </p>
        </div>
        <div className="pointer-events-auto flex flex-col items-start gap-4 text-sm text-[#EDE8DA] lg:items-end lg:text-right">
          <div className="w-[220px] border-t border-paper/30 pt-3">{note}</div>
          {ctaLabel ? (
            <TextLink href={ctaHref} tone="light" className="text-[#F9F6EF]">
              {ctaLabel}
            </TextLink>
          ) : null}
        </div>
      </div>
    </div>
  );
}

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
  image?: string;
  imageLabel?: string;
};

/** Full-bleed cinematic hero with a floating glass header. Mockup ref: 1b. */
export function HeroCinematic({
  eyebrow = "Floristería y vivero",
  titleLine1 = "Un poco de selva",
  titleLine2 = "para tu living",
  description = "Plantas, flores frescas y arreglos a medida. Entregamos todos los días antes de las 18 h.",
  note = "Envío el mismo día en CABA y GBA norte.",
  ctaLabel = "Ver flores de temporada →",
  image,
  imageLabel = "Foto apaisada: invernadero con luz difusa",
}: HeroCinematicProps) {
  return (
    <div className="relative h-[760px] overflow-hidden bg-forest">
      <ImagePlaceholder
        src={image}
        alt={titleLine1}
        label={imageLabel}
        className="absolute inset-0"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(12,26,16,0.66)_0%,rgba(12,26,16,0.18)_38%,rgba(12,26,16,0.82)_100%)]" />
      <FloatingHeader />
      <div className="pointer-events-none absolute inset-x-12 bottom-16 flex items-end justify-between gap-12">
        <div className="max-w-[760px] animate-[rp-rise_0.9s_ease_both]">
          <Eyebrow tone="cream">{eyebrow}</Eyebrow>
          <h1 className="mt-5 font-display text-[104px] font-normal leading-[0.94] text-[#F9F6EF]">
            {titleLine1}
            <br />
            {titleLine2}
          </h1>
          <p className="mt-6 max-w-[520px] text-[19px] leading-[1.6] text-[#EDE8DA]">
            {description}
          </p>
        </div>
        <div className="pointer-events-auto flex flex-col items-end gap-4 text-right text-sm text-[#EDE8DA]">
          <div className="w-[220px] border-t border-paper/30 pt-3">{note}</div>
          <TextLink tone="light" className="text-[#F9F6EF]">
            {ctaLabel}
          </TextLink>
        </div>
      </div>
    </div>
  );
}

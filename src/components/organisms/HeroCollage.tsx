import { CtaButton } from "@/components/atoms/CtaButton";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import { HeaderWithDot } from "@/components/molecules/HeaderWithDot";

export type HeroCollageProps = {
  titlePrefix?: string;
  titleEmphasis?: string;
  titleSuffix?: string;
  description?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  images?: { src?: string; label: string }[];
};

const defaultImages = [
  { label: "Detalle de hojas" },
  { label: "Ramo sobre mesa de trabajo" },
  { label: "Manos armando un ramo" },
];

/** Asymmetric photo collage with an oversized headline overlapping the images. Mockup ref: 1c. */
export function HeroCollage({
  titlePrefix = "Cultivado ",
  titleEmphasis = "aquí",
  titleSuffix = "cortado hoy",
  description = "Somos vivero y floristería. Lo que ves en la web se corta la misma mañana en que sale a tu casa.",
  primaryCtaLabel = "Comprar plantas",
  secondaryCtaLabel = "Comprar flores",
  images = defaultImages,
}: HeroCollageProps) {
  return (
    <div className="bg-paper-light">
      <HeaderWithDot />
      <div className="relative px-14 pb-24 pt-[72px]">
        <div className="grid grid-cols-12 items-start gap-5">
          <div className="col-span-4 mt-24 h-[380px]">
            <ImagePlaceholder
              src={images[0]?.src}
              alt={images[0]?.label}
              label={images[0]?.label}
              shape="rounded"
              radius={4}
            />
          </div>
          <div className="col-span-4 h-[470px]">
            <ImagePlaceholder
              src={images[1]?.src}
              alt={images[1]?.label}
              label={images[1]?.label}
              shape="rounded"
              radius={4}
            />
          </div>
          <div className="col-span-4 mt-12 h-[300px]">
            <ImagePlaceholder
              src={images[2]?.src}
              alt={images[2]?.label}
              label={images[2]?.label}
              shape="rounded"
              radius={4}
            />
          </div>
        </div>

        <h1 className="pointer-events-none absolute inset-x-14 top-[236px] animate-[rp-fade_1s_ease_both] text-center font-display text-[132px] font-normal leading-[0.9] text-forest mix-blend-multiply">
          {titlePrefix}
          <em>{titleEmphasis}</em>
          <br />
          {titleSuffix}
        </h1>

        <div className="mt-14 flex items-end justify-between gap-16">
          <p className="max-w-[460px] text-[19px] leading-[1.6] text-ink">{description}</p>
          <div className="flex gap-3">
            <CtaButton tone="terracotta" shape="rounded">
              {primaryCtaLabel}
            </CtaButton>
            <CtaButton tone="forest" shape="rounded">
              {secondaryCtaLabel}
            </CtaButton>
          </div>
        </div>
      </div>
    </div>
  );
}

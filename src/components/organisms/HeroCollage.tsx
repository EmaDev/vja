import { CtaButton } from "@/components/atoms/CtaButton";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import { HeaderWithDot } from "@/components/molecules/HeaderWithDot";

export type HeroCollageProps = {
  eyebrow?: string;
  titleLine1?: string;
  titleEmphasis?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  /** Foto principal: ocupa el panel central, el más alto de los tres. */
  image?: string;
  imageAlt?: string;
  /** Las dos fotos de apoyo, que no se editan desde el CMS. */
  sideImages?: { src?: string; label: string }[];
  showHeader?: boolean;
};

const defaultSideImages = [
  { label: "Detalle de hojas" },
  { label: "Manos armando un ramo" },
];

/** Asymmetric photo collage with an oversized headline overlapping the images. Mockup ref: 1c.
 * El titular superpuesto sólo se despega en `lg`: abajo de ese ancho se apila arriba
 * del collage, porque el `mix-blend-multiply` sobre tres fotos angostas no se lee. */
export function HeroCollage({
  eyebrow,
  titleLine1 = "Cultivado aquí",
  titleEmphasis = "cortado hoy",
  description = "Somos vivero y floristería. Lo que ves en la web se corta la misma mañana en que sale a tu casa.",
  primaryCtaLabel = "Comprar plantas",
  primaryCtaHref,
  secondaryCtaLabel = "Comprar flores",
  secondaryCtaHref,
  image,
  imageAlt,
  sideImages = defaultSideImages,
  showHeader = true,
}: HeroCollageProps) {
  return (
    <div className="bg-paper-light">
      {showHeader ? <HeaderWithDot /> : null}
      <div className="site-gutter relative pb-16 pt-10 md:pb-24 md:pt-[72px]">
        {eyebrow ? (
          <div className="mb-3 text-center lg:absolute lg:inset-x-14 lg:top-[190px] lg:z-10 lg:mb-0">
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
        ) : null}

        {/* Un solo `h1` para toda la página: en `lg` se despega en absoluto sobre el
            collage y abajo de ese ancho queda en el flujo, arriba de las fotos. */}
        <h1 className="animate-[rp-fade_1s_ease_both] text-center font-display text-[52px] font-normal leading-[0.94] text-forest sm:text-[72px] lg:pointer-events-none lg:absolute lg:inset-x-14 lg:top-[236px] lg:text-[104px] lg:leading-[0.9] lg:mix-blend-multiply xl:text-[132px]">
          {titleLine1}
          {titleEmphasis ? (
            <>
              <br />
              <em>{titleEmphasis}</em>
            </>
          ) : null}
        </h1>

        <div className="mt-8 grid grid-cols-2 items-start gap-3 lg:mt-0 lg:grid-cols-12 lg:gap-5">
          <div className="h-[220px] sm:h-[300px] lg:col-span-4 lg:mt-24 lg:h-[380px]">
            <ImagePlaceholder
              src={sideImages[0]?.src}
              alt={sideImages[0]?.label}
              label={sideImages[0]?.label}
              shape="rounded"
              radius={4}
            />
          </div>
          <div className="h-[220px] sm:h-[300px] lg:col-span-4 lg:h-[470px]">
            <ImagePlaceholder
              src={image}
              alt={imageAlt ?? titleLine1}
              label="Foto principal del collage"
              shape="rounded"
              radius={4}
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div className="col-span-2 h-[180px] sm:h-[240px] lg:col-span-4 lg:mt-12 lg:h-[300px]">
            <ImagePlaceholder
              src={sideImages[1]?.src}
              alt={sideImages[1]?.label}
              label={sideImages[1]?.label}
              shape="rounded"
              radius={4}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-8 lg:mt-14 lg:flex-row lg:items-end lg:gap-16">
          <p className="max-w-[460px] text-base leading-[1.6] text-ink md:text-[19px]">{description}</p>
          <div className="flex flex-wrap gap-3">
            {primaryCtaLabel ? (
              <CtaButton href={primaryCtaHref} tone="terracotta" shape="rounded">
                {primaryCtaLabel}
              </CtaButton>
            ) : null}
            {secondaryCtaLabel ? (
              <CtaButton href={secondaryCtaHref} tone="forest" shape="rounded">
                {secondaryCtaLabel}
              </CtaButton>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

import { CtaButton } from "@/components/atoms/CtaButton";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { FloatingBadge } from "@/components/atoms/FloatingBadge";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import { AnnouncementMarquee } from "@/components/molecules/AnnouncementMarquee";
import { AvatarStack } from "@/components/molecules/AvatarStack";
import { StandardHeader } from "@/components/molecules/StandardHeader";

export type HeroAnnouncementArchProps = {
  eyebrow?: string;
  titleLine1?: string;
  titleLine2?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  ratingLabel?: string;
  image?: string;
  imageAlt?: string;
  imageLabel?: string;
  showHeader?: boolean;
};

/** Marquee announcement bar + shop header + arched product hero. Mockup ref: 1d. */
export function HeroAnnouncementArch({
  eyebrow = "Nuevo · colección sombra",
  titleLine1 = "Para ese rincón",
  titleLine2 = "sin sol directo",
  description = "Doce especies que prosperan con luz indirecta. Con maceta de cerámica hecha en Buenos Aires y riego explicado en una tarjeta.",
  primaryCtaLabel = "Ver la colección",
  primaryCtaHref,
  secondaryCtaLabel = "Test: ¿qué planta soy?",
  secondaryCtaHref,
  ratingLabel = "4,9 / 5 · 1.284 reseñas verificadas",
  image,
  imageAlt,
  imageLabel = "Planta de sombra en cerámica",
  showHeader = true,
}: HeroAnnouncementArchProps) {
  return (
    <div className="bg-paper">
      {showHeader ? (
        <>
          <AnnouncementMarquee />
          <StandardHeader />
        </>
      ) : null}
      <div className="site-gutter grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1fr_440px] lg:gap-[72px] xl:grid-cols-[1fr_520px]">
        <div className="animate-[rp-rise_0.7s_ease_both]">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h1 className="mt-4 font-display text-[46px] font-normal leading-[1] text-forest sm:text-[62px] lg:mt-5 lg:text-[74px] lg:leading-[0.96] xl:text-[92px]">
            {titleLine1}
            {titleLine2 ? (
              <>
                <br />
                {titleLine2}
              </>
            ) : null}
          </h1>
          <p className="mt-5 max-w-[470px] text-base leading-[1.65] text-ink md:text-lg lg:mt-6">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3.5 lg:mt-9">
            {primaryCtaLabel ? (
              <CtaButton href={primaryCtaHref} tone="forest">
                {primaryCtaLabel}
              </CtaButton>
            ) : null}
            {secondaryCtaLabel ? (
              <CtaButton href={secondaryCtaHref} tone="forest" variant="outline">
                {secondaryCtaLabel}
              </CtaButton>
            ) : null}
          </div>
          <div className="mt-9 lg:mt-11">
            <AvatarStack label={ratingLabel} />
          </div>
        </div>
        <div className="relative h-[420px] sm:h-[540px] lg:h-[620px]">
          <div className="absolute inset-0 overflow-hidden rounded-[200px_200px_12px_12px] bg-sand lg:rounded-[260px_260px_12px_12px]">
            <ImagePlaceholder
              src={image}
              alt={imageAlt ?? titleLine1}
              label={imageLabel}
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <FloatingBadge pill className="absolute left-0 top-[60px] lg:left-[-40px] lg:top-[78px]">
            Luz indirecta ✓
          </FloatingBadge>
          <FloatingBadge pill className="absolute bottom-16 right-0 lg:bottom-24 lg:right-[-30px]">
            Riego cada 10 días
          </FloatingBadge>
        </div>
      </div>
    </div>
  );
}

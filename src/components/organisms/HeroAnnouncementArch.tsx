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
  secondaryCtaLabel?: string;
  ratingLabel?: string;
  image?: string;
  imageLabel?: string;
};

/** Marquee announcement bar + shop header + arched product hero. Mockup ref: 1d. */
export function HeroAnnouncementArch({
  eyebrow = "Nuevo · colección sombra",
  titleLine1 = "Para ese rincón",
  titleLine2 = "sin sol directo",
  description = "Doce especies que prosperan con luz indirecta. Con maceta de cerámica hecha en Buenos Aires y riego explicado en una tarjeta.",
  primaryCtaLabel = "Ver la colección",
  secondaryCtaLabel = "Test: ¿qué planta soy?",
  ratingLabel = "4,9 / 5 · 1.284 reseñas verificadas",
  image,
  imageLabel = "Planta de sombra en cerámica",
}: HeroAnnouncementArchProps) {
  return (
    <div className="bg-paper">
      <AnnouncementMarquee />
      <StandardHeader />
      <div className="grid grid-cols-[1fr_520px] items-center gap-[72px] px-14 py-20">
        <div className="animate-[rp-rise_0.7s_ease_both]">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 font-display text-[92px] font-normal leading-[0.96] text-forest">
            {titleLine1}
            <br />
            {titleLine2}
          </h1>
          <p className="mt-6 max-w-[470px] text-lg leading-[1.65] text-ink">{description}</p>
          <div className="mt-9 flex gap-3.5">
            <CtaButton tone="forest">{primaryCtaLabel}</CtaButton>
            <CtaButton tone="forest" variant="outline">
              {secondaryCtaLabel}
            </CtaButton>
          </div>
          <div className="mt-11">
            <AvatarStack label={ratingLabel} />
          </div>
        </div>
        <div className="relative h-[620px]">
          <div className="absolute inset-0 overflow-hidden rounded-[260px_260px_12px_12px] bg-sand">
            <ImagePlaceholder src={image} alt={titleLine1} label={imageLabel} />
          </div>
          <FloatingBadge pill className="absolute left-[-40px] top-[78px]">
            Luz indirecta ✓
          </FloatingBadge>
          <FloatingBadge pill className="absolute bottom-24 right-[-30px]">
            Riego cada 10 días
          </FloatingBadge>
        </div>
      </div>
    </div>
  );
}

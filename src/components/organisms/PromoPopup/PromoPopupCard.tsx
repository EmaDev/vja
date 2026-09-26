import { CtaButton } from "@/components/atoms/CtaButton";
import { CloseIcon } from "@/components/atoms/icons";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import { cn } from "@/lib/utils";
import type { Promotion } from "@/lib/cms/promo-types";

export interface PromoPopupCardProps {
  promotion: Promotion;
  onClose: () => void;
  className?: string;
}

/** La tarjeta del popup, sin el diálogo que la envuelve.
 *
 * Vive aparte para que el editor del CMS pueda dibujar la misma pieza como vista
 * previa sin arrastrar el portal, el bloqueo de scroll ni el recuerdo de cierre:
 * lo que se ve editando es exactamente lo que se ve en la landing. */
export function PromoPopupCard({ promotion, onClose, className }: PromoPopupCardProps) {
  const { title, description, imageUrl, imageAlt, ctaLabel, ctaHref } = promotion;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[14px] bg-paper-light shadow-[0_24px_60px_rgba(31,45,33,0.28)]",
        className,
      )}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar promoción"
        className="absolute right-3 top-3 z-[1] flex h-9 w-9 items-center justify-center rounded-full bg-paper-light/85 text-forest backdrop-blur-sm transition-colors hover:bg-paper-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
      >
        <CloseIcon className="h-4 w-4" />
      </button>

      {imageUrl ? (
        <div className="relative aspect-[4/3] w-full">
          <ImagePlaceholder src={imageUrl} alt={imageAlt} />
        </div>
      ) : null}

      <div className="flex flex-col gap-3 px-7 pb-7 pt-6">
        <h2 className="font-display text-[26px] leading-[1.15] text-forest">
          {title || "Promoción"}
        </h2>
        {description ? (
          <p className="whitespace-pre-line text-[15px] leading-[1.6] text-ink">{description}</p>
        ) : null}
        {ctaLabel && ctaHref ? (
          <CtaButton href={ctaHref} size="sm" className="mt-1 w-fit">
            {ctaLabel}
          </CtaButton>
        ) : null}
      </div>
    </div>
  );
}

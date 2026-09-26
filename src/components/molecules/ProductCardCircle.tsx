import { CardShell } from "@/components/atoms/CardShell";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";

export type ProductCardCircleProps = {
  image?: string;
  imageLabel?: string;
  name: string;
  meta: string;
  ctaLabel?: string;
  /** Ficha del producto. Sin esto la card no navega. */
  href?: string;
};

/** Compact circular portrait card for dense grids. Mockup ref: 2e. */
export function ProductCardCircle({
  image,
  imageLabel,
  name,
  meta,
  ctaLabel = "Cómo cuidarla",
  href,
}: ProductCardCircleProps) {
  return (
    <CardShell
      href={href}
      label={name}
      className="group block rounded-lg bg-paper-light px-6 pb-[26px] pt-7 text-center transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[10px] hover:shadow-[0_24px_40px_rgba(23,48,31,0.13)]"
    >
      <div className="mx-auto h-[140px] w-[140px] overflow-hidden rounded-full bg-sand sm:h-[168px] sm:w-[168px]">
        <ImagePlaceholder src={image} alt={name} label={imageLabel ?? name} shape="circle" />
      </div>
      <div className="mt-5 font-display text-2xl text-forest">{name}</div>
      <div className="mt-1 text-sm text-stone">{meta}</div>
      <div className="mt-4 inline-block border-b border-[#C9BFA6] pb-[3px] text-[13px] text-forest transition-colors duration-300 hover:border-terracotta group-hover:border-terracotta">
        {ctaLabel}
      </div>
    </CardShell>
  );
}

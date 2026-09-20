import { ArrowCircleButton } from "@/components/atoms/ArrowCircleButton";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";

export type ProductCardEditorialRowProps = {
  index: string;
  image?: string;
  imageLabel?: string;
  category: string;
  name: string;
  description: string;
};

/** Horizontal numbered row with an arrow affordance. Mockup ref: 2d. */
export function ProductCardEditorialRow({
  index,
  image,
  imageLabel,
  category,
  name,
  description,
}: ProductCardEditorialRowProps) {
  return (
    <div className="grid grid-cols-[190px_minmax(0,1fr)_auto] items-center gap-8 rounded-lg border border-line-light bg-paper-light p-[18px] transition-[background,transform] duration-[350ms] ease-out hover:translate-x-2 hover:bg-white">
      <div className="h-[150px] overflow-hidden rounded-[5px] bg-sand">
        <ImagePlaceholder src={image} alt={name} label={imageLabel ?? name} />
      </div>
      <div>
        <div className="flex items-center gap-3">
          <span className="font-display text-lg text-terracotta">{index}</span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-taupe">{category}</span>
        </div>
        <div className="mt-1.5 font-display text-[34px] text-forest">{name}</div>
        <p className="mt-2 max-w-[640px] text-base leading-[1.55] text-ink">{description}</p>
      </div>
      <ArrowCircleButton />
    </div>
  );
}

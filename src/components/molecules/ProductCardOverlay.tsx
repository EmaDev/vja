import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";

export type ProductCardOverlayProps = {
  image?: string;
  imageLabel?: string;
  category: string;
  name: string;
  tags: string[];
};

/** Photo-first card whose care tags rise into view on hover. Mockup ref: 2a. */
export function ProductCardOverlay({
  image,
  imageLabel,
  category,
  name,
  tags,
}: ProductCardOverlayProps) {
  return (
    <div className="group relative h-[470px] cursor-pointer overflow-hidden rounded-md bg-sand">
      <ImagePlaceholder src={image} alt={name} label={imageLabel ?? name} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(12,26,16,0)_45%,rgba(12,26,16,0.82)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6">
        <div className="text-[11px] uppercase tracking-[0.22em] text-[#D9C9A3]">{category}</div>
        <div className="mt-1.5 font-display text-[32px] text-[#F9F6EF]">{name}</div>
        <div className="max-h-0 overflow-hidden opacity-0 transition-[max-height,opacity] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:max-h-20 group-hover:opacity-100">
          <div className="flex gap-2 pt-3.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-paper/45 px-3 py-1.5 text-xs text-paper"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

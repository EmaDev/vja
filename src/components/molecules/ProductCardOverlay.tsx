import { CardShell } from "@/components/atoms/CardShell";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";

export type ProductCardOverlayProps = {
  image?: string;
  /** Texto alternativo de la foto. Sin él se usa el nombre, que es mejor que
   *  nada pero describe la planta y no la imagen. */
  imageAlt?: string;
  imageLabel?: string;
  category: string;
  name: string;
  tags: string[];
  /** Ficha del producto. Sin esto la card no navega. */
  href?: string;
};

/** Photo-first card whose care tags rise into view on hover. Mockup ref: 2a. */
export function ProductCardOverlay({
  image,
  imageAlt,
  imageLabel,
  category,
  name,
  tags,
  href,
}: ProductCardOverlayProps) {
  return (
    <CardShell
      href={href}
      label={name}
      className="group relative block h-[380px] cursor-pointer overflow-hidden rounded-md bg-sand sm:h-[470px]"
    >
      <ImagePlaceholder src={image} alt={imageAlt ?? name} label={imageLabel ?? name} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(12,26,16,0)_45%,rgba(12,26,16,0.82)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6">
        <div className="text-[11px] uppercase tracking-[0.22em] text-[#D9C9A3]">{category}</div>
        <div className="mt-1.5 font-display text-[26px] text-[#F9F6EF] sm:text-[32px]">{name}</div>
        <div className="max-h-24 overflow-hidden transition-[max-height,opacity] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:max-h-0 sm:opacity-0 sm:group-hover:max-h-24 sm:group-hover:opacity-100">
          <div className="flex flex-wrap gap-2 pt-3.5">
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
    </CardShell>
  );
}

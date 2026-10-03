import { CardShell } from "@/components/atoms/CardShell";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";

export type ProductCardDrawerProps = {
  image?: string;
  /** Texto alternativo de la foto. Sin él se usa el nombre, que es mejor que
   *  nada pero describe la planta y no la imagen. */
  imageAlt?: string;
  imageLabel?: string;
  badge: string;
  name: string;
  description: string;
  /** Ficha del producto. Sin esto la card no navega. */
  href?: string;
};

/** Dark card whose description drawer slides up from the bottom on hover. Mockup ref: 2c. */
export function ProductCardDrawer({
  image,
  imageAlt,
  imageLabel,
  badge,
  name,
  description,
  href,
}: ProductCardDrawerProps) {
  return (
    <CardShell
      href={href}
      label={name}
      className="group relative block h-[360px] cursor-pointer overflow-hidden rounded-[10px] bg-forest-deep sm:h-[430px]"
    >
      <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]">
        <ImagePlaceholder src={image} alt={imageAlt ?? name} label={imageLabel ?? name} />
      </div>
      <div className="pointer-events-none absolute left-[18px] top-[18px] rounded-full border border-paper/28 bg-[#0c1a10]/50 px-3.5 py-[7px] text-xs uppercase tracking-[0.1em] text-paper backdrop-blur-[8px]">
        {badge}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-paper px-[22px] py-5 transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:translate-y-[101%] sm:group-hover:translate-y-0">
        <div className="font-display text-[28px] text-forest">{name}</div>
        <p className="mt-2.5 text-[15px] leading-[1.55] text-ink">{description}</p>
      </div>
    </CardShell>
  );
}

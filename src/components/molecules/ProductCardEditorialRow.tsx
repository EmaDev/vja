import { ArrowCircleButton } from "@/components/atoms/ArrowCircleButton";
import { CardShell } from "@/components/atoms/CardShell";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";

export type ProductCardEditorialRowProps = {
  index: string;
  image?: string;
  imageLabel?: string;
  category: string;
  name: string;
  description: string;
  /** Ficha del producto. Sin esto la fila no navega, y la flecha queda como
   * adorno: ya es un `div` decorativo, no un control aparte. */
  href?: string;
};

/** Horizontal numbered row with an arrow affordance. Mockup ref: 2d. */
export function ProductCardEditorialRow({
  index,
  image,
  imageLabel,
  category,
  name,
  description,
  href,
}: ProductCardEditorialRowProps) {
  return (
    <CardShell
      href={href}
      label={name}
      className="grid items-center gap-5 rounded-lg border border-line-light bg-paper-light p-[18px] transition-[background,transform] duration-[350ms] ease-out sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[190px_minmax(0,1fr)_auto] lg:gap-8 lg:hover:translate-x-2 hover:bg-white"
    >
      <div className="h-[180px] overflow-hidden rounded-[5px] bg-sand sm:h-[150px]">
        <ImagePlaceholder src={image} alt={name} label={imageLabel ?? name} />
      </div>
      <div>
        <div className="flex items-center gap-3">
          <span className="font-display text-lg text-terracotta">{index}</span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-taupe">{category}</span>
        </div>
        <div className="mt-1.5 font-display text-[26px] text-forest sm:text-[30px] lg:text-[34px]">{name}</div>
        <p className="mt-2 max-w-[640px] text-base leading-[1.55] text-ink">{description}</p>
      </div>
      <ArrowCircleButton className="hidden lg:flex" />
    </CardShell>
  );
}

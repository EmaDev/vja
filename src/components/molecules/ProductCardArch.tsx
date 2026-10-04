import { CardShell } from "@/components/atoms/CardShell";
import { CARD_IMAGE_SIZES, ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";

export type ProductCardArchProps = {
  image?: string;
  /** Texto alternativo de la foto. Sin él se usa el nombre, que es mejor que
   *  nada pero describe la planta y no la imagen. */
  imageAlt?: string;
  imageLabel?: string;
  name: string;
  subtitle: string;
  description: string;
  /** Ficha del producto. Sin esto la card no navega. */
  href?: string;
};

/** Arched photo card with a short description under the name. Mockup ref: 2b. */
export function ProductCardArch({
  image,
  imageAlt,
  imageLabel,
  name,
  subtitle,
  description,
  href,
}: ProductCardArchProps) {
  return (
    <CardShell
      href={href}
      label={name}
      className="block rounded-lg bg-paper-dark p-[22px] pb-[26px] transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:shadow-[0_22px_44px_rgba(23,48,31,0.14)]"
    >
      <div className="h-[240px] overflow-hidden rounded-[120px_120px_8px_8px] bg-sand sm:h-[300px] sm:rounded-[150px_150px_8px_8px]">
        <ImagePlaceholder
          src={image}
          alt={imageAlt ?? name}
          label={imageLabel ?? name}
          sizes={CARD_IMAGE_SIZES}
        />
      </div>
      <div className="mt-[22px] font-display text-[26px] text-forest sm:text-[30px]">{name}</div>
      <div className="mt-0.5 font-display text-base italic text-taupe">{subtitle}</div>
      {description ? (
        <p className="mt-5 border-t border-line pt-[18px] text-sm leading-[1.6] text-[#3A4A3C]">
          {description}
        </p>
      ) : null}
    </CardShell>
  );
}

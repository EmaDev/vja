import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";

export type ProductCardArchSpec = {
  label: string;
  value: string;
};

export type ProductCardArchProps = {
  image?: string;
  imageLabel?: string;
  name: string;
  subtitle: string;
  specs: ProductCardArchSpec[];
};

/** Arched photo card with a three-column care spec row. Mockup ref: 2b. */
export function ProductCardArch({
  image,
  imageLabel,
  name,
  subtitle,
  specs,
}: ProductCardArchProps) {
  return (
    <div className="rounded-lg bg-paper-dark p-[22px] pb-[26px] transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:shadow-[0_22px_44px_rgba(23,48,31,0.14)]">
      <div className="h-[300px] overflow-hidden rounded-[150px_150px_8px_8px] bg-sand">
        <ImagePlaceholder src={image} alt={name} label={imageLabel ?? name} />
      </div>
      <div className="mt-[22px] font-display text-[30px] text-forest">{name}</div>
      <div className="mt-0.5 font-display text-base italic text-taupe">{subtitle}</div>
      <div className="mt-5 grid grid-cols-3 gap-2.5 border-t border-line pt-[18px]">
        {specs.map((spec) => (
          <div key={spec.label}>
            <div className="text-[10px] uppercase tracking-[0.16em] text-[#A09D8B]">
              {spec.label}
            </div>
            <div className="mt-1 text-sm text-[#3A4A3C]">{spec.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";

export type MiniProductTileProps = {
  image?: string;
  imageLabel?: string;
  name: string;
  meta: string;
  /** Ficha del producto. Sin link la tile queda como muestra estática. */
  href?: string;
};

/** Small dark tile used inside compact "trending products" carousels. Mockup ref: 1e. */
export function MiniProductTile({ image, imageLabel, name, meta, href }: MiniProductTileProps) {
  const content = (
    <>
      <div className="h-[132px] overflow-hidden rounded-[5px]">
        <ImagePlaceholder
          src={image}
          alt={name}
          label={imageLabel ?? name}
          sizes="(min-width: 640px) 25vw, 50vw"
        />
      </div>
      <div className="mt-3 truncate text-[15px] text-paper">{name}</div>
      <div className="mt-0.5 truncate text-[13px] text-[#9FB09A]">{meta}</div>
    </>
  );
  const className = "block min-w-0 rounded-lg border border-paper/14 bg-paper/[0.07] p-3";

  return href ? (
    <Link href={href} className={`${className} transition-colors hover:bg-paper/[0.12]`}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}

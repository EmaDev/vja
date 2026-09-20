import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";

export type MiniProductTileProps = {
  image?: string;
  imageLabel?: string;
  name: string;
  meta: string;
};

/** Small dark tile used inside compact "trending products" carousels. Mockup ref: 1e. */
export function MiniProductTile({ image, imageLabel, name, meta }: MiniProductTileProps) {
  return (
    <div className="rounded-lg border border-paper/14 bg-paper/[0.07] p-3">
      <div className="h-[132px] overflow-hidden rounded-[5px]">
        <ImagePlaceholder src={image} alt={name} label={imageLabel ?? name} />
      </div>
      <div className="mt-3 text-[15px] text-paper">{name}</div>
      <div className="mt-0.5 text-[13px] text-[#9FB09A]">{meta}</div>
    </div>
  );
}

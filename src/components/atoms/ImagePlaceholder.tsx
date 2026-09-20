import Image from "next/image";
import { cn } from "@/lib/utils";

export type ImagePlaceholderProps = {
  /** Real image source. Omit to render the sand placeholder box. */
  src?: string;
  alt?: string;
  /** Caption shown inside the placeholder box when no `src` is given. */
  label?: string;
  shape?: "rect" | "rounded" | "circle";
  /** Custom border radius in px, used instead of the `shape` presets. */
  radius?: number;
  className?: string;
};

export function ImagePlaceholder({
  src,
  alt,
  label,
  shape = "rect",
  radius,
  className,
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-sand",
        shape === "circle" && "rounded-full",
        shape === "rounded" && !radius && "rounded",
        className,
      )}
      style={radius !== undefined ? { borderRadius: radius } : undefined}
    >
      {src ? (
        <Image src={src} alt={alt ?? ""} fill className="object-cover" />
      ) : label ? (
        <span className="absolute inset-0 flex items-center justify-center px-4 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-forest/35">
          {label}
        </span>
      ) : null}
    </div>
  );
}

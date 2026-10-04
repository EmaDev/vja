import Image from "next/image";
import { cn } from "@/lib/utils";

/** `sizes` de una card en la grilla del catálogo: una columna en celular, dos
 * desde `sm` y tres desde `lg` (ver `ProductGrid`).
 *
 * Importa más de lo que parece. `fill` sin `sizes` equivale a `100vw`, así que
 * el navegador baja la variante más grande del `srcset` para cada miniatura:
 * en un celular, una foto de ancho completo por cada card de un tercio de
 * pantalla. Es el hallazgo típico de "las imágenes tienen un tamaño
 * incorrecto" de Lighthouse y, en datos móviles, varios megas de más. */
export const CARD_IMAGE_SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

/** Igual que la anterior, para la grilla de dos y cuatro columnas de la card
 * circular. */
export const CARD_CIRCLE_IMAGE_SIZES = "(min-width: 1024px) 25vw, 50vw";

export type ImagePlaceholderProps = {
  /** Real image source. Omit to render the sand placeholder box. */
  src?: string;
  alt?: string;
  /** Caption shown inside the placeholder box when no `src` is given. */
  label?: string;
  shape?: "rect" | "rounded" | "circle";
  /** Custom border radius in px, used instead of the `shape` presets. */
  radius?: number;
  /** Qué ancho va a ocupar la imagen, para que el navegador elija del `srcset`.
   * Por defecto `100vw`, que es lo que asume `next/image` con `fill`: hay que
   * pasarlo en cuanto la imagen ocupe menos que el ancho de la pantalla. */
  sizes?: string;
  /** Saca la imagen de la carga diferida y la precarga. Va sólo en la imagen
   * que se ve sin scrollear —la del hero, la de la ficha—, que es la que mide
   * el LCP. Ponerlo en varias es peor que no ponerlo en ninguna: compiten entre
   * ellas por el ancho de banda. */
  priority?: boolean;
  className?: string;
};

export function ImagePlaceholder({
  src,
  alt,
  label,
  shape = "rect",
  radius,
  sizes = "100vw",
  priority,
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
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : label ? (
        <span className="absolute inset-0 flex items-center justify-center px-4 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-forest/35">
          {label}
        </span>
      ) : null}
    </div>
  );
}

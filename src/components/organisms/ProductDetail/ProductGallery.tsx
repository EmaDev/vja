"use client";

import { useState } from "react";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import { cn } from "@/lib/utils";

export interface GalleryPhoto {
  /** URL real. Mientras no haya fotos cargadas va vacío y se ve el recuadro
   * con el nombre, igual que en las cards del catálogo. */
  src?: string;
  alt: string;
  /** Texto del recuadro cuando todavía no hay foto. */
  label: string;
}

export interface ProductGalleryProps {
  photos: GalleryPhoto[];
}

/** Galería de la ficha: una foto grande y la tira de miniaturas.
 *
 * Las fotos van todas montadas y se cruzan por opacidad en vez de reemplazarse:
 * así el cambio es un fundido y no un salto, y el alto de la caja nunca se mueve.
 * Es el único pedazo de la ficha que necesita cliente; el resto se arma en el
 * servidor. */
export function ProductGallery({ photos }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  if (photos.length === 0) return null;

  return (
    <div className="animate-[rp-fade_0.8s_ease_both]">
      <div className="group relative aspect-4/5 overflow-hidden rounded-[18px] bg-sand sm:aspect-square lg:aspect-4/5">
        {photos.map((photo, index) => (
          <div
            key={index}
            aria-hidden={index !== active}
            className={cn(
              "absolute inset-0 transition-[opacity,transform] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              index === active ? "opacity-100" : "scale-[1.04] opacity-0",
            )}
          >
            {/* El zoom suave al pasar el mouse le da algo de vida a una foto
                quieta, sin desbordar por el `overflow-hidden` del contenedor. */}
            <div className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]">
              <ImagePlaceholder src={photo.src} alt={photo.alt} label={photo.label} />
            </div>
          </div>
        ))}

        {photos.length > 1 && (
          <div className="pointer-events-none absolute bottom-5 right-5 rounded-full bg-forest/70 px-3.5 py-1.5 text-xs tracking-[0.08em] text-paper backdrop-blur-[6px]">
            {active + 1} / {photos.length}
          </div>
        )}
      </div>

      {photos.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-2.5 sm:gap-3">
          {photos.map((photo, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver foto ${index + 1} de ${photos.length}`}
              aria-current={index === active}
              className={cn(
                "aspect-square overflow-hidden rounded-md bg-sand transition-[transform,box-shadow,opacity] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                "hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
                index === active
                  ? "opacity-100 shadow-[0_0_0_2px_var(--color-terracotta)]"
                  : "opacity-60 hover:opacity-100",
              )}
            >
              <ImagePlaceholder src={photo.src} alt="" label={String(index + 1)} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

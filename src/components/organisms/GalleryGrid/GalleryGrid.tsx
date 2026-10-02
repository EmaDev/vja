import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { cn } from "@/lib/utils";
import type { GallerySection } from "@/lib/cms/types";

export interface GalleryGridProps {
  section: GallerySection;
}

/** Galería de fotos del local.
 *
 * La primera foto ocupa dos columnas y dos filas: una grilla de recuadros todos
 * iguales se lee como una planilla, y este mosaico le da jerarquía sin pedirle al
 * cliente que elija tamaños. Sólo se aplica cuando hay fotos suficientes para que
 * el hueco no quede a la vista. */
export function GalleryGrid({ section }: GalleryGridProps) {
  const loaded = section.images.filter((image) => image.imageUrl);
  // Sin fotos cargadas la sección sería una grilla de recuadros vacíos.
  if (loaded.length === 0) return null;

  const feature = loaded.length >= 5;

  return (
    <section
      id="galeria"
      aria-labelledby="galeria-titulo"
      className="site-gutter bg-cream py-16 md:py-24"
    >
      <SectionHeading
        eyebrow={section.eyebrow}
        title={section.title}
        subtitle={section.subtitle}
        titleId="galeria-titulo"
      />
      <div className="grid auto-rows-[200px] grid-cols-2 gap-3 sm:auto-rows-[240px] lg:grid-cols-4 lg:gap-4">
        {loaded.map((image, index) => (
          <div
            key={image.id}
            className={cn(
              "overflow-hidden rounded-[12px] bg-sand",
              feature && index === 0 && "col-span-2 row-span-2",
            )}
          >
            <ImagePlaceholder src={image.imageUrl} alt={image.imageAlt} />
          </div>
        ))}
      </div>
    </section>
  );
}

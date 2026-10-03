"use client";

import type { HeroSection } from "@/lib/cms/types";
import type { Product } from "@/lib/cms/catalog-types";
import { SelectField } from "@/components/atoms/SelectField";
import { TextField } from "@/components/atoms/TextField";
import { TextAreaField } from "@/components/atoms/TextAreaField";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";
import { ImageUploader } from "@/components/molecules/ImageUploader/ImageUploader";

interface HeroEditorProps {
  section: HeroSection;
  onChange: (section: HeroSection) => void;
  /** Plantas publicadas del catálogo, para elegir la de la card “Favorita”. */
  products: Product[];
}

export function HeroEditor({ section, onChange, products }: HeroEditorProps) {
  // La planta guardada puede haberse despublicado o borrado después de elegirla.
  // Sin esta opción fantasma el `select` se vería vacío y el cliente no sabría
  // por qué la card no sale en el sitio.
  const missing =
    section.featuredProductId.length > 0 &&
    !products.some((product) => product.id === section.featuredProductId);

  return (
    <div className="flex flex-col gap-5">
      <FieldCard
        title="Titular"
        subtitle="La segunda línea es la que cada diseño resalta en itálica o en otro color. Dejala vacía si querés un titular de una sola línea."
      >
        <TextField
          label="Volanta"
          placeholder="Temporada de interior"
          value={section.eyebrow}
          onChange={(event) => onChange({ ...section, eyebrow: event.target.value })}
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          <TextField
            label="Título — primera línea"
            value={section.title}
            onChange={(event) => onChange({ ...section, title: event.target.value })}
          />
          <TextField
            label="Título — segunda línea (destacada)"
            value={section.titleHighlight}
            onChange={(event) => onChange({ ...section, titleHighlight: event.target.value })}
          />
        </div>
        <TextAreaField
          label="Subtítulo"
          rows={3}
          value={section.subtitle}
          onChange={(event) => onChange({ ...section, subtitle: event.target.value })}
        />
      </FieldCard>

      <FieldCard
        title="Botones"
        subtitle="El secundario no aparece en la variante cinemática, que por diseño tiene una sola acción."
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          <TextField
            label="Botón principal"
            value={section.ctaLabel}
            onChange={(event) => onChange({ ...section, ctaLabel: event.target.value })}
          />
          <TextField
            label="Link del botón principal"
            placeholder="#catalogo"
            value={section.ctaHref}
            onChange={(event) => onChange({ ...section, ctaHref: event.target.value })}
          />
          <TextField
            label="Botón secundario"
            value={section.secondaryCtaLabel}
            onChange={(event) => onChange({ ...section, secondaryCtaLabel: event.target.value })}
          />
          <TextField
            label="Link del botón secundario"
            placeholder="#contacto"
            value={section.secondaryCtaHref}
            onChange={(event) => onChange({ ...section, secondaryCtaHref: event.target.value })}
          />
        </div>
      </FieldCard>

      <FieldCard
        title="Planta destacada"
        subtitle="La card que flota sobre la foto del hero. Sólo la dibuja la variante “Split editorial”; sin planta elegida, el hero va sin card."
      >
        <SelectField
          label="Planta"
          value={section.featuredProductId}
          onChange={(event) => onChange({ ...section, featuredProductId: event.target.value })}
        >
          <option value="">Sin planta destacada</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
          {missing ? (
            <option value={section.featuredProductId}>La planta elegida ya no está publicada</option>
          ) : null}
        </SelectField>
        {products.length === 0 ? (
          <p className="text-[13px] leading-[1.5] text-stone">
            Todavía no hay plantas publicadas en el catálogo. Cargá una desde Catálogo y
            después elegila acá.
          </p>
        ) : null}
        {missing ? (
          <p className="text-[13px] leading-[1.5] text-terracotta">
            La planta destacada ya no está publicada, así que el sitio no muestra la card.
            Elegí otra o volvé a publicar esa planta.
          </p>
        ) : null}
      </FieldCard>

      <FieldCard
        title="Imagen principal"
        subtitle="Se usa en las cinco variantes: como foto del hero, como panel central del collage o como fondo atenuado en el diseño oscuro."
      >
        <ImageUploader
          imageUrl={section.imageUrl}
          imageAlt={section.imageAlt}
          onChange={({ imageUrl, imageAlt }) => onChange({ ...section, imageUrl, imageAlt })}
        />
      </FieldCard>
    </div>
  );
}

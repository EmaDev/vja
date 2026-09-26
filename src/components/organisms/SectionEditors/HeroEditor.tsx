"use client";

import type { HeroSection } from "@/lib/cms/types";
import { TextField } from "@/components/atoms/TextField";
import { TextAreaField } from "@/components/atoms/TextAreaField";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";
import { ImageUploader } from "@/components/molecules/ImageUploader/ImageUploader";

interface HeroEditorProps {
  section: HeroSection;
  onChange: (section: HeroSection) => void;
}

export function HeroEditor({ section, onChange }: HeroEditorProps) {
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

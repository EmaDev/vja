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
    <FieldCard title="Texto e imagen">
      <TextField
        label="Título"
        value={section.title}
        onChange={(event) => onChange({ ...section, title: event.target.value })}
      />
      <TextAreaField
        label="Subtítulo"
        rows={3}
        value={section.subtitle}
        onChange={(event) => onChange({ ...section, subtitle: event.target.value })}
      />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        <TextField
          label="Texto del botón"
          value={section.ctaLabel}
          onChange={(event) => onChange({ ...section, ctaLabel: event.target.value })}
        />
        <TextField
          label="Link del botón"
          value={section.ctaHref}
          onChange={(event) => onChange({ ...section, ctaHref: event.target.value })}
        />
      </div>
      <ImageUploader
        imageUrl={section.imageUrl}
        imageAlt={section.imageAlt}
        onChange={({ imageUrl, imageAlt }) => onChange({ ...section, imageUrl, imageAlt })}
      />
    </FieldCard>
  );
}

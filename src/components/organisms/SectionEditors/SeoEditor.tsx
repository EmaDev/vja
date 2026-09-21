"use client";

import type { SeoSection } from "@/lib/cms/types";
import { TextField } from "@/components/atoms/TextField";
import { TextAreaField } from "@/components/atoms/TextAreaField";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";
import { ImageUploader } from "@/components/molecules/ImageUploader/ImageUploader";

interface SeoEditorProps {
  section: SeoSection;
  onChange: (section: SeoSection) => void;
}

export function SeoEditor({ section, onChange }: SeoEditorProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] items-start gap-7">
      <FieldCard title="Metadatos de la landing">
        <TextField
          label="Título (55 caracteres máx.)"
          value={section.metaTitle}
          onChange={(event) => onChange({ ...section, metaTitle: event.target.value })}
        />
        <TextAreaField
          label="Descripción"
          rows={3}
          value={section.metaDescription}
          onChange={(event) => onChange({ ...section, metaDescription: event.target.value })}
        />
        <ImageUploader
          imageUrl={section.shareImageUrl}
          imageAlt={section.shareImageAlt}
          onChange={({ imageUrl, imageAlt }) =>
            onChange({ ...section, shareImageUrl: imageUrl, shareImageAlt: imageAlt })
          }
        />
      </FieldCard>

      <FieldCard title="Vista en Google" tinted>
        <div className="rounded-lg bg-paper-light p-4">
          <div className="text-xs text-stone">raizypetalo.com.ar</div>
          <div className="mt-1 text-[17px] leading-[1.3] text-sage">{section.metaTitle}</div>
          <div className="mt-[5px] text-[13px] leading-[1.5] text-ink">{section.metaDescription}</div>
        </div>
      </FieldCard>
    </div>
  );
}

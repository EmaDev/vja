"use client";

import { TextAreaField } from "@/components/atoms/TextAreaField";
import { TextField } from "@/components/atoms/TextField";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";
import { ImageUploader } from "@/components/molecules/ImageUploader/ImageUploader";
import { RepeatableList } from "@/components/molecules/RepeatableList/RepeatableList";
import { SectionBasicsCard } from "./SectionBasicsCard";
import type { CareNote, CareSection } from "@/lib/cms/types";

interface CareEditorProps {
  section: CareSection;
  onChange: (section: CareSection) => void;
}

const MAX_NOTES = 6;

function emptyNote(): CareNote {
  return {
    id: crypto.randomUUID(),
    tag: "",
    title: "",
    summary: "",
    href: "",
    imageUrl: "",
    imageAlt: "",
  };
}

export function CareEditor({ section, onChange }: CareEditorProps) {
  return (
    <div className="flex flex-col gap-5">
      <SectionBasicsCard
        section={section}
        onChange={onChange}
        name="Cuidados"
        anchor="#cuidados"
        footer={
          <TextAreaField
            label="Bajada"
            rows={2}
            value={section.subtitle}
            onChange={(event) => onChange({ ...section, subtitle: event.target.value })}
          />
        }
      />

      <FieldCard
        title="Notas"
        subtitle="Consejos breves de cuidado. Si todavía no tenés la nota completa escrita, dejá el enlace vacío: la tarjeta se publica igual."
      >
        <RepeatableList
          items={section.items}
          onChange={(items) => onChange({ ...section, items })}
          createItem={emptyNote}
          addLabel="Agregar nota"
          max={MAX_NOTES}
          itemMinWidth={420}
          itemLabel={(note, index) => note.title || `Nota ${index + 1}`}
          emptyLabel="Sin notas cargadas la sección no se publica."
          renderItem={(note, update) => (
            <>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))] gap-3.5">
                <TextField
                  label="Tema"
                  placeholder="Riego"
                  value={note.tag}
                  onChange={(event) => update({ tag: event.target.value })}
                />
                <TextField
                  label="Título"
                  value={note.title}
                  onChange={(event) => update({ title: event.target.value })}
                />
              </div>
              <TextAreaField
                label="Resumen"
                rows={3}
                value={note.summary}
                onChange={(event) => update({ summary: event.target.value })}
              />
              <TextField
                label="Enlace a la nota completa"
                placeholder="https://instagram.com/p/…"
                value={note.href}
                onChange={(event) => update({ href: event.target.value })}
              />
              <ImageUploader
                imageUrl={note.imageUrl}
                imageAlt={note.imageAlt}
                onChange={({ imageUrl, imageAlt }) => update({ imageUrl, imageAlt })}
              />
            </>
          )}
        />
      </FieldCard>
    </div>
  );
}

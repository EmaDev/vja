"use client";

import { TextAreaField } from "@/components/atoms/TextAreaField";
import { TextField } from "@/components/atoms/TextField";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";
import { ImageUploader } from "@/components/molecules/ImageUploader/ImageUploader";
import { RepeatableList } from "@/components/molecules/RepeatableList/RepeatableList";
import { SectionBasicsCard } from "./SectionBasicsCard";
import type { AboutSection, AboutStat } from "@/lib/cms/types";

interface AboutEditorProps {
  section: AboutSection;
  onChange: (section: AboutSection) => void;
}

/** Más de cuatro números y la fila se parte en dos renglones desparejos. */
const MAX_STATS = 4;

function emptyStat(): AboutStat {
  return { id: crypto.randomUUID(), value: "", label: "" };
}

export function AboutEditor({ section, onChange }: AboutEditorProps) {
  return (
    <div className="flex flex-col gap-5">
      <SectionBasicsCard
        section={section}
        onChange={onChange}
        name="Nosotros"
        anchor="#nosotros"
        footer={
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4">
            <TextAreaField
              label="Primer párrafo"
              rows={4}
              value={section.bodyFirst}
              onChange={(event) => onChange({ ...section, bodyFirst: event.target.value })}
            />
            <TextAreaField
              label="Segundo párrafo"
              rows={4}
              value={section.bodySecond}
              onChange={(event) => onChange({ ...section, bodySecond: event.target.value })}
            />
          </div>
        }
      >
        <TextField
          label="Título — segunda línea (en itálica)"
          value={section.titleHighlight}
          onChange={(event) => onChange({ ...section, titleHighlight: event.target.value })}
        />
      </SectionBasicsCard>

      <FieldCard
        title="Números"
        subtitle="Los datos cortos que van bajo el texto, en la misma fila que se ven en el sitio. Dejá la lista vacía si preferís no mostrarlos."
      >
        <RepeatableList
          items={section.stats}
          onChange={(stats) => onChange({ ...section, stats })}
          createItem={emptyStat}
          addLabel="Agregar número"
          max={MAX_STATS}
          itemMinWidth={240}
          itemLabel={(stat, index) => stat.label || `Número ${index + 1}`}
          emptyLabel="Sin números cargados, la sección muestra sólo el texto."
          renderItem={(stat, update) => (
            <>
              <TextField
                label="Dato"
                placeholder="500+"
                value={stat.value}
                onChange={(event) => update({ value: event.target.value })}
              />
              <TextField
                label="Qué significa"
                placeholder="Productos disponibles"
                value={stat.label}
                onChange={(event) => update({ label: event.target.value })}
              />
            </>
          )}
        />
      </FieldCard>

      <FieldCard
        title="Fotos"
        subtitle="La principal se recorta vertical al costado del texto. La chica se monta sobre su esquina, sólo en pantallas grandes."
      >
        <div className="grid gap-5 xl:grid-cols-2">
          <div>
            <div className="mb-2.5 text-[13px] text-ink">Foto principal</div>
            <ImageUploader
              imageUrl={section.imageUrl}
              imageAlt={section.imageAlt}
              onChange={({ imageUrl, imageAlt }) => onChange({ ...section, imageUrl, imageAlt })}
            />
          </div>
          <div className="border-t border-line-light pt-5 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
            <div className="mb-2.5 text-[13px] text-ink">Foto chica</div>
            <ImageUploader
              imageUrl={section.accentImageUrl}
              imageAlt={section.accentImageAlt}
              onChange={({ imageUrl, imageAlt }) =>
                onChange({ ...section, accentImageUrl: imageUrl, accentImageAlt: imageAlt })
              }
            />
          </div>
        </div>
        <TextField
          label="Cartel sobre la foto"
          placeholder="VJA Plantas & Flores"
          value={section.badgeLabel}
          onChange={(event) => onChange({ ...section, badgeLabel: event.target.value })}
        />
      </FieldCard>
    </div>
  );
}

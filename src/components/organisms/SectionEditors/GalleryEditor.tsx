"use client";

import { TextAreaField } from "@/components/atoms/TextAreaField";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";
import { ImageUploader } from "@/components/molecules/ImageUploader/ImageUploader";
import { RepeatableList } from "@/components/molecules/RepeatableList/RepeatableList";
import { SectionBasicsCard } from "./SectionBasicsCard";
import type { GallerySection, SectionImage } from "@/lib/cms/types";

interface GalleryEditorProps {
  section: GallerySection;
  onChange: (section: GallerySection) => void;
}

const MAX_IMAGES = 12;

function emptyImage(): SectionImage {
  return { id: crypto.randomUUID(), imageUrl: "", imageAlt: "" };
}

export function GalleryEditor({ section, onChange }: GalleryEditorProps) {
  const loaded = section.images.filter((image) => image.imageUrl).length;

  return (
    <div className="flex flex-col gap-5">
      <SectionBasicsCard
        section={section}
        onChange={onChange}
        name="Galería"
        anchor="#galeria"
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
        title="Fotos"
        subtitle="La primera ocupa el doble de espacio cuando hay cinco o más. Las que todavía no tengan foto cargada no se publican."
      >
        <p className="-mt-2 text-[13px] leading-[1.5] text-stone">
          {loaded === 0
            ? "Todavía no hay fotos cargadas, así que la sección no se publica."
            : `${loaded} ${loaded === 1 ? "foto" : "fotos"} listas para publicar.`}
        </p>
        <RepeatableList
          items={section.images}
          onChange={(images) => onChange({ ...section, images })}
          createItem={emptyImage}
          addLabel="Agregar foto"
          max={MAX_IMAGES}
          itemMinWidth={420}
          itemLabel={(image, index) => image.imageAlt || `Foto ${index + 1}`}
          emptyLabel="Sin fotos cargadas la sección no se publica."
          renderItem={(image, update) => (
            <ImageUploader
              imageUrl={image.imageUrl}
              imageAlt={image.imageAlt}
              onChange={({ imageUrl, imageAlt }) => update({ imageUrl, imageAlt })}
            />
          )}
        />
      </FieldCard>
    </div>
  );
}

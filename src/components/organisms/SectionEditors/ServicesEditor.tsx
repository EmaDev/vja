"use client";

import { TextAreaField } from "@/components/atoms/TextAreaField";
import { TextField } from "@/components/atoms/TextField";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";
import { ImageUploader } from "@/components/molecules/ImageUploader/ImageUploader";
import { RepeatableList } from "@/components/molecules/RepeatableList/RepeatableList";
import { SectionBasicsCard } from "./SectionBasicsCard";
import type { ServiceCard, ServicesSection } from "@/lib/cms/types";

interface ServicesEditorProps {
  section: ServicesSection;
  onChange: (section: ServicesSection) => void;
}

const MAX_CARDS = 8;

function emptyCard(): ServiceCard {
  return {
    id: crypto.randomUUID(),
    tag: "",
    title: "",
    body: "",
    whatsappSubject: "",
    imageUrl: "",
    imageAlt: "",
  };
}

export function ServicesEditor({ section, onChange }: ServicesEditorProps) {
  return (
    <div className="flex flex-col gap-5">
      <SectionBasicsCard
        section={section}
        onChange={onChange}
        name="Servicios"
        anchor="#servicios"
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
        title="Servicios"
        subtitle="Cada card abre WhatsApp con la consulta ya escrita. El número es el que cargaste en Datos de contacto."
      >
        <RepeatableList
          items={section.items}
          onChange={(items) => onChange({ ...section, items })}
          createItem={emptyCard}
          addLabel="Agregar servicio"
          max={MAX_CARDS}
          itemMinWidth={420}
          itemLabel={(card, index) => card.title || `Servicio ${index + 1}`}
          emptyLabel="Sin servicios cargados la sección no se publica."
          renderItem={(card, update) => (
            <>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))] gap-3.5">
                <TextField
                  label="Rubro"
                  placeholder="Florería"
                  value={card.tag}
                  onChange={(event) => update({ tag: event.target.value })}
                />
                <TextField
                  label="Título"
                  value={card.title}
                  onChange={(event) => update({ title: event.target.value })}
                />
              </div>
              <TextAreaField
                label="Descripción"
                rows={3}
                value={card.body}
                onChange={(event) => update({ body: event.target.value })}
              />
              <TextField
                label="Consulta con la que arranca el WhatsApp"
                placeholder="Arreglo floral a pedido"
                value={card.whatsappSubject}
                onChange={(event) => update({ whatsappSubject: event.target.value })}
              />
              <p className="-mt-1 text-[13px] leading-[1.5] text-stone">
                {card.whatsappSubject
                  ? `El mensaje sale como: “Hola VJA, quería consultar por ${card.whatsappSubject}.”`
                  : "Vacío, la card queda informativa: se ve igual pero no enlaza a WhatsApp."}
              </p>
              <ImageUploader
                imageUrl={card.imageUrl}
                imageAlt={card.imageAlt}
                onChange={({ imageUrl, imageAlt }) => update({ imageUrl, imageAlt })}
              />
            </>
          )}
        />
      </FieldCard>
    </div>
  );
}

"use client";

import { TextAreaField } from "@/components/atoms/TextAreaField";
import { TextField } from "@/components/atoms/TextField";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";
import { RepeatableList } from "@/components/molecules/RepeatableList/RepeatableList";
import { SectionBasicsCard } from "./SectionBasicsCard";
import type { FaqItem, FaqSection } from "@/lib/cms/types";

interface FaqEditorProps {
  section: FaqSection;
  onChange: (section: FaqSection) => void;
}

const MAX_ITEMS = 24;

function emptyItem(): FaqItem {
  return { id: crypto.randomUUID(), question: "", answer: "" };
}

export function FaqEditor({ section, onChange }: FaqEditorProps) {
  return (
    <div className="flex flex-col gap-5">
      <SectionBasicsCard
        section={section}
        onChange={onChange}
        name="Preguntas frecuentes"
        anchor="#faq"
        footer={
          <p className="text-[13px] leading-[1.5] text-stone">
            El buscador filtra sobre las preguntas y las respuestas, sin acentos: quien escriba
            “envios” igual encuentra “envíos”. Si no hay resultados, se le ofrece preguntar por
            WhatsApp.
          </p>
        }
      >
        <TextField
          label="Título — segunda línea (en itálica)"
          value={section.titleHighlight}
          onChange={(event) => onChange({ ...section, titleHighlight: event.target.value })}
        />
        <TextField
          label="Texto del buscador"
          placeholder="Buscá tu pregunta — ej. envíos, pagos…"
          value={section.searchPlaceholder}
          onChange={(event) => onChange({ ...section, searchPlaceholder: event.target.value })}
        />
      </SectionBasicsCard>

      <FieldCard
        title="Preguntas"
        subtitle="Se muestran en este orden. Conviene empezar por las que más te preguntan en el local."
      >
        <RepeatableList
          items={section.items}
          onChange={(items) => onChange({ ...section, items })}
          createItem={emptyItem}
          addLabel="Agregar pregunta"
          max={MAX_ITEMS}
          itemMinWidth={400}
          itemLabel={(item, index) => item.question || `Pregunta ${index + 1}`}
          emptyLabel="Sin preguntas cargadas la sección no se publica."
          renderItem={(item, update) => (
            <>
              <TextField
                label="Pregunta"
                value={item.question}
                onChange={(event) => update({ question: event.target.value })}
              />
              <TextAreaField
                label="Respuesta"
                rows={4}
                value={item.answer}
                onChange={(event) => update({ answer: event.target.value })}
              />
            </>
          )}
        />
      </FieldCard>
    </div>
  );
}

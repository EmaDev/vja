"use client";

import type { ContactField, ContactSection } from "@/lib/cms/types";
import { TextField } from "@/components/atoms/TextField";
import { TextAreaField } from "@/components/atoms/TextAreaField";
import { AdminButton } from "@/components/atoms/AdminButton";
import { PlusIcon, TrashIcon } from "@/components/atoms/icons";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";

const REQUIREMENTS: ContactField["requirement"][] = ["Obligatorio", "Opcional", "Lista desplegable"];

interface ContactEditorProps {
  section: ContactSection;
  onChange: (section: ContactSection) => void;
}

export function ContactEditor({ section, onChange }: ContactEditorProps) {
  function updateField(id: string, patch: Partial<ContactField>) {
    onChange({
      ...section,
      fields: section.fields.map((field) => (field.id === id ? { ...field, ...patch } : field)),
    });
  }

  function removeField(id: string) {
    onChange({ ...section, fields: section.fields.filter((field) => field.id !== id) });
  }

  function addField() {
    onChange({
      ...section,
      fields: [...section.fields, { id: crypto.randomUUID(), label: "", requirement: "Opcional" }],
    });
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] items-start gap-7">
      <div className="flex flex-col gap-5">
        <FieldCard title="Local y horarios">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
            <TextField
              label="Nombre del local"
              value={section.storeName}
              onChange={(event) => onChange({ ...section, storeName: event.target.value })}
            />
            <TextField
              label="Teléfono / WhatsApp"
              value={section.phone}
              onChange={(event) => onChange({ ...section, phone: event.target.value })}
            />
            <TextField
              label="Dirección"
              wide
              value={section.address}
              onChange={(event) => onChange({ ...section, address: event.target.value })}
            />
            <TextField
              label="Email"
              value={section.email}
              onChange={(event) => onChange({ ...section, email: event.target.value })}
            />
            <TextField
              label="Horario"
              value={section.hours}
              onChange={(event) => onChange({ ...section, hours: event.target.value })}
            />
          </div>
        </FieldCard>

        <FieldCard
          title="Formulario de consulta"
          subtitle="Define qué campos ve el visitante y a dónde llegan las consultas."
        >
          <div className="flex flex-col">
            {section.fields.map((field, index) => (
              <div
                key={field.id}
                className={`flex items-center gap-2 py-1.5 ${
                  index < section.fields.length - 1 ? "border-b border-[#EDE6D6]" : ""
                }`}
              >
                <input
                  value={field.label}
                  onChange={(event) => updateField(field.id, { label: event.target.value })}
                  placeholder="Nombre del campo"
                  aria-label="Nombre del campo"
                  className="min-w-0 flex-1 rounded border border-transparent bg-transparent px-2 py-1.5 text-[15px] text-forest outline-none transition-colors placeholder:text-taupe hover:border-line focus:border-line focus:outline-2 focus:outline-sage focus:outline-offset-1"
                />
                <select
                  value={field.requirement}
                  onChange={(event) =>
                    updateField(field.id, { requirement: event.target.value as ContactField["requirement"] })
                  }
                  aria-label={`Requisito de ${field.label || "el campo"}`}
                  className="shrink-0 rounded border border-transparent bg-transparent px-2 py-1.5 text-xs uppercase tracking-[0.1em] text-taupe outline-none transition-colors hover:border-line focus:border-line focus:outline-2 focus:outline-sage focus:outline-offset-1"
                >
                  {REQUIREMENTS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeField(field.id)}
                  aria-label={`Eliminar ${field.label || "campo"}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-taupe transition-colors hover:bg-terracotta/10 hover:text-terracotta"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <AdminButton variant="outline" onClick={addField} className="w-fit gap-1.5">
            <PlusIcon className="h-4 w-4" />
            Agregar campo
          </AdminButton>
          <TextField
            label="Enviar consultas a"
            value={section.formRecipientEmail}
            onChange={(event) => onChange({ ...section, formRecipientEmail: event.target.value })}
          />
          <TextAreaField
            label="Mensaje de agradecimiento"
            rows={3}
            value={section.thankYouMessage}
            onChange={(event) => onChange({ ...section, thankYouMessage: event.target.value })}
          />
        </FieldCard>
      </div>

      <FieldCard title="Cómo se ve" tinted>
        <div className="rounded-lg bg-paper-light p-[18px]">
          <div className="font-display text-xl text-forest">Escribinos</div>
          <div className="mt-3 h-[34px] rounded-[5px] bg-[#F0EADB]" />
          <div className="mt-2 h-[34px] rounded-[5px] bg-[#F0EADB]" />
          <div className="mt-2 h-[62px] rounded-[5px] bg-[#F0EADB]" />
          <div className="mt-3 h-9 rounded-full bg-forest" />
        </div>
        <p className="text-[13px] leading-[1.55] text-stone">
          Los campos obligatorios se validan antes de enviar. El aviso de privacidad se agrega
          automáticamente.
        </p>
      </FieldCard>
    </div>
  );
}

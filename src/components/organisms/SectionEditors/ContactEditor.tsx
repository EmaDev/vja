"use client";

import type { ContactSection } from "@/lib/cms/types";
import { TextField } from "@/components/atoms/TextField";
import { TextAreaField } from "@/components/atoms/TextAreaField";
import { ToggleSwitch } from "@/components/atoms/ToggleSwitch";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";
import { whatsappHref } from "@/lib/cms/whatsapp";

interface ContactEditorProps {
  section: ContactSection;
  onChange: (section: ContactSection) => void;
}

export function ContactEditor({ section, onChange }: ContactEditorProps) {
  const href = whatsappHref(section.whatsappPhone, section.whatsappMessage);
  const label = section.whatsappLabel.trim() || "Escribinos";

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
              label="Teléfono"
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
          title="Botón de WhatsApp"
          subtitle="Reemplaza al formulario de consultas. Flota en todas las pantallas de la landing."
        >
          <div className="flex items-center justify-between gap-4">
            <span className="text-[15px] text-forest">Mostrar el botón en el sitio</span>
            <ToggleSwitch
              checked={section.whatsappEnabled}
              onChange={(whatsappEnabled) => onChange({ ...section, whatsappEnabled })}
              label="Botón flotante de WhatsApp"
            />
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
            <TextField
              label="Número de WhatsApp"
              value={section.whatsappPhone}
              placeholder="+54 9 11 4820-9931"
              onChange={(event) => onChange({ ...section, whatsappPhone: event.target.value })}
            />
            <TextField
              label="Texto del botón"
              value={section.whatsappLabel}
              placeholder="Escribinos"
              onChange={(event) => onChange({ ...section, whatsappLabel: event.target.value })}
            />
          </div>
          <TextAreaField
            label="Mensaje con el que arranca la conversación"
            rows={3}
            value={section.whatsappMessage}
            onChange={(event) => onChange({ ...section, whatsappMessage: event.target.value })}
          />
          {section.whatsappEnabled && !href ? (
            <p className="text-[13px] leading-[1.5] text-terracotta">
              Ese número no es válido, así que el botón no se va a mostrar. Escribilo en formato
              internacional, por ejemplo +54 9 11 4820-9931.
            </p>
          ) : null}
        </FieldCard>
      </div>

      <FieldCard title="Cómo se ve" tinted>
        <div className="relative h-[190px] overflow-hidden rounded-lg bg-paper-light">
          <div className="p-[18px]">
            <div className="h-3 w-24 rounded-full bg-[#F0EADB]" />
            <div className="mt-3 h-3 w-40 rounded-full bg-[#F0EADB]" />
            <div className="mt-3 h-3 w-32 rounded-full bg-[#F0EADB]" />
          </div>
          <div
            className={`absolute bottom-4 right-4 flex items-center gap-2 rounded-full px-[18px] py-2.5 text-[13px] font-medium text-paper-light transition-opacity ${
              section.whatsappEnabled && href ? "bg-[#25D366]" : "bg-[#CFC6B0] opacity-70"
            }`}
          >
            <span className="h-[15px] w-[15px] rounded-full bg-paper-light/90" />
            {label}
          </div>
        </div>
        <p className="text-[13px] leading-[1.55] text-stone">
          {section.whatsappEnabled && href
            ? "Al tocarlo se abre WhatsApp con el mensaje ya escrito. En celulares angostos el botón queda sólo con el ícono."
            : "El botón está apagado: la landing no lo muestra."}
        </p>
      </FieldCard>
    </div>
  );
}

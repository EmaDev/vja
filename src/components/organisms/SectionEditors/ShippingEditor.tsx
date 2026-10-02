"use client";

import { TextAreaField } from "@/components/atoms/TextAreaField";
import { TextField } from "@/components/atoms/TextField";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";
import { RepeatableList } from "@/components/molecules/RepeatableList/RepeatableList";
import { SectionBasicsCard } from "./SectionBasicsCard";
import type { ShippingSection, ShippingZone } from "@/lib/cms/types";

interface ShippingEditorProps {
  section: ShippingSection;
  onChange: (section: ShippingSection) => void;
}

const MAX_ZONES = 40;
const POSTAL_CODE_LENGTH = 4;

function emptyZone(): ShippingZone {
  return { id: crypto.randomUUID(), postalCode: "", locality: "" };
}

export function ShippingEditor({ section, onChange }: ShippingEditorProps) {
  /** Un código postal corto nunca va a coincidir con lo que escriba el visitante,
   * que ingresa cuatro dígitos. Mejor avisarlo acá que dejarlo mudo en el sitio. */
  const incomplete = section.zones.filter(
    (zone) => zone.postalCode.replace(/\D/g, "").length !== POSTAL_CODE_LENGTH,
  ).length;

  return (
    <div className="flex flex-col gap-5">
      <SectionBasicsCard
        section={section}
        onChange={onChange}
        name="Envíos"
        anchor="#envios"
        footer={
          <TextAreaField
            label="Bajada"
            rows={2}
            value={section.subtitle}
            onChange={(event) => onChange({ ...section, subtitle: event.target.value })}
          />
        }
      />

      <div className="grid items-start gap-5 xl:grid-cols-2">
        <FieldCard
          title="Respuestas"
          subtitle="Lo que se le dice a quien verifica su código postal. El botón abre WhatsApp con el código ya escrito."
        >
          <TextAreaField
            label="Cuando sí llegamos"
            rows={3}
            value={section.coveredNote}
            onChange={(event) => onChange({ ...section, coveredNote: event.target.value })}
          />
          <TextAreaField
            label="Cuando todavía no llegamos"
            rows={3}
            value={section.notCoveredNote}
            onChange={(event) => onChange({ ...section, notCoveredNote: event.target.value })}
          />
          <TextField
            label="Texto del botón"
            placeholder="Consultar por WhatsApp"
            value={section.ctaLabel}
            onChange={(event) => onChange({ ...section, ctaLabel: event.target.value })}
          />
        </FieldCard>

        <FieldCard
          title="Zona de reparto"
          subtitle="Los códigos postales a los que llegás hoy. Para ampliar la cobertura alcanza con sumar un renglón y publicar."
        >
          {incomplete > 0 ? (
            <p className="-mt-2 text-[13px] leading-[1.5] text-terracotta">
              {incomplete === 1
                ? "Hay un código postal que no tiene 4 dígitos, así que nunca va a coincidir."
                : `Hay ${incomplete} códigos postales que no tienen 4 dígitos, así que nunca van a coincidir.`}
            </p>
          ) : null}
          <RepeatableList
            items={section.zones}
            onChange={(zones) => onChange({ ...section, zones })}
            createItem={emptyZone}
            addLabel="Agregar código postal"
            max={MAX_ZONES}
            itemMinWidth={230}
            itemLabel={(zone, index) =>
              zone.postalCode ? `${zone.postalCode} · ${zone.locality}` : `Zona ${index + 1}`
            }
            emptyLabel="Sin zonas cargadas, el verificador le va a decir a todo el mundo que no llegás."
            renderItem={(zone, update) => (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,140px),1fr))] gap-3">
                <TextField
                  label="Código postal"
                  placeholder="1754"
                  inputMode="numeric"
                  maxLength={POSTAL_CODE_LENGTH}
                  value={zone.postalCode}
                  onChange={(event) => update({ postalCode: event.target.value.replace(/\D/g, "") })}
                />
                <TextField
                  label="Localidad"
                  placeholder="San Justo"
                  value={zone.locality}
                  onChange={(event) => update({ locality: event.target.value })}
                />
              </div>
            )}
          />
        </FieldCard>
      </div>
    </div>
  );
}

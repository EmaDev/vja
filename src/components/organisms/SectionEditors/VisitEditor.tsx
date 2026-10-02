"use client";

import { TextAreaField } from "@/components/atoms/TextAreaField";
import { TextField } from "@/components/atoms/TextField";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";
import { RepeatableList } from "@/components/molecules/RepeatableList/RepeatableList";
import { SectionBasicsCard } from "./SectionBasicsCard";
import type { VisitHours, VisitSection } from "@/lib/cms/types";

interface VisitEditorProps {
  section: VisitSection;
  onChange: (section: VisitSection) => void;
  /** La dirección sale de Contacto y se usa acá para armar los enlaces de Maps. */
  address: string;
}

const MAX_ROWS = 7;

function emptyRow(): VisitHours {
  return { id: crypto.randomUUID(), days: "", time: "" };
}

/** Arma el `src` del iframe de Google Maps a partir de una dirección escrita a
 * mano, que es lo que el cliente tiene a mano. El `output=embed` es lo que hace
 * que Maps devuelva el mapa suelto y no la página entera. */
function mapsEmbedUrl(address: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}

function mapsDirectionsUrl(address: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

export function VisitEditor({ section, onChange, address }: VisitEditorProps) {
  function useAddress() {
    onChange({
      ...section,
      mapEmbedUrl: mapsEmbedUrl(address),
      directionsUrl: mapsDirectionsUrl(address),
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <SectionBasicsCard
        section={section}
        onChange={onChange}
        name="Visitanos"
        anchor="#visitanos"
        footer={
          <TextAreaField
            label="Bajada"
            rows={2}
            value={section.subtitle}
            onChange={(event) => onChange({ ...section, subtitle: event.target.value })}
          />
        }
      >
        <TextField
          label="Título — segunda línea (en itálica)"
          value={section.titleHighlight}
          onChange={(event) => onChange({ ...section, titleHighlight: event.target.value })}
        />
      </SectionBasicsCard>

      <div className="grid items-start gap-5 xl:grid-cols-2">
        <FieldCard
          title="Horarios"
          subtitle="Un renglón por tramo. La dirección y el teléfono no se cargan acá: salen de Datos de contacto."
        >
          <RepeatableList
            items={section.hours}
            onChange={(hours) => onChange({ ...section, hours })}
            createItem={emptyRow}
            addLabel="Agregar renglón"
            max={MAX_ROWS}
            itemMinWidth={240}
            itemLabel={(row, index) => row.days || `Renglón ${index + 1}`}
            emptyLabel="Sin horarios cargados, la sección no muestra ese bloque."
            renderItem={(row, update) => (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,140px),1fr))] gap-3">
                <TextField
                  label="Días"
                  placeholder="Lunes a viernes"
                  value={row.days}
                  onChange={(event) => update({ days: event.target.value })}
                />
                <TextField
                  label="Horario"
                  placeholder="9:00 – 18:00"
                  value={row.time}
                  onChange={(event) => update({ time: event.target.value })}
                />
              </div>
            )}
          />
        </FieldCard>

        <FieldCard
          title="Mapa y cómo llegar"
          subtitle="Si no querés pelear con los enlaces de Google Maps, usá el botón: los arma con la dirección que cargaste en Datos de contacto."
        >
          {address ? (
            <button
              type="button"
              onClick={useAddress}
              className="w-fit rounded-md border border-line bg-paper-light px-3.5 py-2 text-[13px] text-forest transition-colors hover:border-sage hover:text-sage focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
            >
              Generar con “{address}”
            </button>
          ) : (
            <p className="text-[13px] leading-[1.5] text-stone">
              Cargá primero la dirección del local en Datos de contacto y después volvé: desde acá se
              generan los dos enlaces solos.
            </p>
          )}
          <TextField
            label="Mapa embebido (src del iframe)"
            placeholder="https://www.google.com/maps?q=…&output=embed"
            value={section.mapEmbedUrl}
            onChange={(event) => onChange({ ...section, mapEmbedUrl: event.target.value })}
          />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-4">
            <TextField
              label="Enlace de “Cómo llegar”"
              placeholder="https://www.google.com/maps/dir/?api=1&destination=…"
              value={section.directionsUrl}
              onChange={(event) => onChange({ ...section, directionsUrl: event.target.value })}
            />
            <TextField
              label="Texto del botón"
              placeholder="Cómo llegar"
              value={section.ctaLabel}
              onChange={(event) => onChange({ ...section, ctaLabel: event.target.value })}
            />
          </div>
          <p className="text-[13px] leading-[1.5] text-stone">
            Sin mapa cargado la sección se publica igual, a una sola columna. Sin enlace de cómo
            llegar no aparece el botón.
          </p>
        </FieldCard>
      </div>
    </div>
  );
}

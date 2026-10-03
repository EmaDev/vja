"use client";

import { TextAreaField } from "@/components/atoms/TextAreaField";
import { TextField } from "@/components/atoms/TextField";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";
import { SectionBasicsCard } from "./SectionBasicsCard";
import { mapsDirectionsUrl, mapsEmbedUrl } from "@/lib/cms/contact-info";
import type { VisitSection } from "@/lib/cms/types";

interface VisitEditorProps {
  section: VisitSection;
  onChange: (section: VisitSection) => void;
  /** La dirección sale de Contacto y se usa acá para armar los enlaces de Maps. */
  address: string;
}

export function VisitEditor({ section, onChange, address }: VisitEditorProps) {
  // Los enlaces se guardan armados, así que una dirección nueva en Contacto los
  // deja apuntando al local anterior hasta que se vuelvan a generar.
  const stale =
    Boolean(address) &&
    Boolean(section.mapEmbedUrl || section.directionsUrl) &&
    section.mapEmbedUrl !== mapsEmbedUrl(address) &&
    section.directionsUrl !== mapsDirectionsUrl(address);

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

      <FieldCard
        title="Mapa y cómo llegar"
        subtitle="Los horarios, la dirección y el teléfono de la sección se cargan en Datos de contacto. Acá sólo queda el mapa, que se arma con esa misma dirección."
      >
        {address ? (
          <>
            {stale ? (
              <p className="text-[13px] leading-[1.5] text-terracotta">
                Los enlaces de abajo se generaron con otra dirección. Volvé a generarlos para que
                apunten a la que está cargada hoy en Datos de contacto.
              </p>
            ) : null}
            <button
              type="button"
              onClick={useAddress}
              className="w-fit rounded-md border border-line bg-paper-light px-3.5 py-2 text-[13px] text-forest transition-colors hover:border-sage hover:text-sage focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
            >
              Generar con “{address}”
            </button>
          </>
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
  );
}

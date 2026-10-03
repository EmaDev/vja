import type { ReactNode } from "react";
import { CtaButton } from "@/components/atoms/CtaButton";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { ClockIcon, MapPinIcon, PhoneIcon } from "@/components/atoms/icons";
import { cn } from "@/lib/utils";
import type { ContactSection, VisitSection } from "@/lib/cms/types";

export interface VisitBlockProps {
  section: VisitSection;
  /** La dirección y el teléfono salen de Contacto: son los mismos datos del local
   * y no tiene sentido cargarlos dos veces. */
  contact?: ContactSection;
  /** Columna de la derecha. La landing mete acá el verificador de envíos; el
   * mapa, si hay uno cargado, queda debajo. */
  aside?: ReactNode;
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 border-t border-line py-5">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage/12 text-sage">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] uppercase tracking-[0.18em] text-taupe">{label}</div>
        <div className="mt-1.5 text-base leading-[1.5] text-forest">{children}</div>
      </div>
    </div>
  );
}

/** "Visitanos": datos del local, horarios día por día y el mapa embebido. */
export function VisitBlock({ section, contact, aside }: VisitBlockProps) {
  // Sin verificador ni mapa no hay segunda columna que armar: a una sola
  // columna el texto ocupa el ancho entero en vez de dejar media pantalla vacía.
  const hasSide = Boolean(aside) || Boolean(section.mapEmbedUrl);

  return (
    <section
      id="visitanos"
      aria-labelledby="visitanos-titulo"
      className="site-gutter bg-paper-light py-16 md:py-24"
    >
      <div
        className={cn(
          "grid gap-12",
          hasSide && "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20",
        )}
      >
        <div>
          {section.eyebrow ? <Eyebrow>{section.eyebrow}</Eyebrow> : null}
          <h2
            id="visitanos-titulo"
            className="mt-3 text-pretty font-display text-[38px] font-normal leading-[1.05] text-forest sm:text-[48px] lg:text-[56px]"
          >
            {section.title}
            {section.titleHighlight ? (
              <>
                <br />
                <em className="text-sage">{section.titleHighlight}</em>
              </>
            ) : null}
          </h2>
          {section.subtitle ? (
            <p className="mt-5 max-w-[460px] text-base leading-[1.6] text-ink md:text-lg">
              {section.subtitle}
            </p>
          ) : null}

          <div className="mt-9">
            {contact?.address ? (
              <InfoRow icon={<MapPinIcon className="h-[18px] w-[18px]" />} label="Dirección">
                {contact.address}
              </InfoRow>
            ) : null}

            {section.hours.length > 0 ? (
              <InfoRow icon={<ClockIcon className="h-[18px] w-[18px]" />} label="Horarios">
                <ul className="flex flex-col gap-1.5">
                  {section.hours.map((row) => (
                    <li key={row.id} className="flex justify-between gap-6 text-[15px]">
                      <span>{row.days}</span>
                      <span className="text-stone">{row.time}</span>
                    </li>
                  ))}
                </ul>
              </InfoRow>
            ) : null}

            {contact?.phone ? (
              <InfoRow icon={<PhoneIcon className="h-[18px] w-[18px]" />} label="Teléfono">
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-sage">
                  {contact.phone}
                </a>
              </InfoRow>
            ) : null}
          </div>

          {section.directionsUrl ? (
            <div className="mt-8">
              <CtaButton href={section.directionsUrl} tone="forest">
                {section.ctaLabel.trim() || "Cómo llegar"}
              </CtaButton>
            </div>
          ) : null}
        </div>

        {hasSide ? (
          <div className="flex flex-col gap-12">
            {aside}
            {section.mapEmbedUrl ? (
              <div className="h-[320px] overflow-hidden rounded-[18px] border border-line bg-sand lg:h-auto lg:min-h-[480px] lg:flex-1">
                <iframe
                  src={section.mapEmbedUrl}
                  title="Ubicación del local"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

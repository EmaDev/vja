import { Eyebrow } from "@/components/atoms/Eyebrow";
import { CtaButton } from "@/components/atoms/CtaButton";
import { HoursList } from "@/components/molecules/HoursList";
import { filledHours } from "@/lib/cms/contact-info";
import { whatsappHref } from "@/lib/cms/whatsapp";
import type { ContactSection } from "@/lib/cms/types";

export interface ContactBlockProps {
  section: ContactSection;
}

function DataRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line py-4">
      <dt className="text-[11px] uppercase tracking-[0.18em] text-taupe">{label}</dt>
      <dd className="mt-1.5 text-base leading-[1.5] text-forest md:text-[17px]">{children}</dd>
    </div>
  );
}

/** Datos del local. Ya no hay formulario: la consulta se canaliza por WhatsApp,
 * con el botón flotante de la landing y el CTA de acá. */
export function ContactBlock({ section }: ContactBlockProps) {
  const whatsapp = section.whatsappEnabled
    ? whatsappHref(section.whatsappPhone, section.whatsappMessage)
    : null;
  const hours = filledHours(section);

  return (
    <section
      id="contacto"
      aria-labelledby="contacto-titulo"
      className="site-gutter bg-paper py-16 md:py-24"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
        <div>
          <Eyebrow>Contacto</Eyebrow>
          <h2
            id="contacto-titulo"
            className="mt-3 font-display text-[38px] font-normal leading-[1.05] text-forest sm:text-[48px] lg:text-[56px]"
          >
            {section.storeName}
          </h2>
          <p className="mt-5 max-w-[440px] text-base leading-[1.6] text-ink md:text-lg">
            Pasá por el local o escribinos: te respondemos qué hay disponible esta semana y armamos
            el pedido a medida.
          </p>
          {whatsapp ? (
            <div className="mt-8">
              <CtaButton href={whatsapp} tone="forest">
                {section.whatsappLabel.trim() || "Escribinos"} por WhatsApp
              </CtaButton>
            </div>
          ) : null}
        </div>

        <dl className="lg:pt-2">
          <DataRow label="Dirección">{section.address}</DataRow>
          {hours.length > 0 ? (
            <DataRow label="Horarios">
              <HoursList hours={hours} />
            </DataRow>
          ) : null}
          <DataRow label="Teléfono">
            <a href={`tel:${section.phone.replace(/\s/g, "")}`} className="hover:text-sage">
              {section.phone}
            </a>
          </DataRow>
          <DataRow label="Email">
            <a href={`mailto:${section.email}`} className="hover:text-sage">
              {section.email}
            </a>
          </DataRow>
        </dl>
      </div>
    </section>
  );
}

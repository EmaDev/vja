import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { whatsappHref } from "@/lib/cms/whatsapp";
import type { ContactSection, ServiceCard, ServicesSection } from "@/lib/cms/types";

export interface ServicesGridProps {
  section: ServicesSection;
  /** De dónde sale el número de WhatsApp al que consulta cada card. */
  contact?: ContactSection;
}

function Card({ card, index, href }: { card: ServiceCard; index: number; href: string | null }) {
  const body = (
    <>
      <div className="relative aspect-[16/11] overflow-hidden bg-sand">
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
          <ImagePlaceholder src={card.imageUrl} alt={card.imageAlt} label={card.title} />
        </div>
        <span className="absolute right-4 top-4 font-display text-[26px] leading-none text-paper/85">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        {card.tag ? (
          <span className="text-[11px] uppercase tracking-[0.18em] text-terracotta">{card.tag}</span>
        ) : null}
        <h3 className="mt-2.5 font-display text-[24px] leading-[1.15] text-forest">{card.title}</h3>
        <p className="mt-3 text-[15px] leading-[1.6] text-ink">{card.body}</p>
        {href ? (
          <span className="mt-5 inline-block border-b border-forest pb-[3px] text-[15px] text-forest transition-colors group-hover:border-sage group-hover:text-sage">
            Consultar por WhatsApp →
          </span>
        ) : null}
      </div>
    </>
  );

  const classes =
    "group flex h-full flex-col overflow-hidden rounded-[14px] border border-line-light bg-paper-light transition-shadow duration-300";

  if (!href) return <article className={classes}>{body}</article>;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${classes} hover:shadow-[0_18px_40px_-28px_rgba(23,48,31,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage`}
    >
      {body}
    </a>
  );
}

/** Los servicios del local. Cada card abre WhatsApp con la consulta ya escrita;
 * sin número cargado en Contacto quedan como tarjetas informativas. */
export function ServicesGrid({ section, contact }: ServicesGridProps) {
  if (section.items.length === 0) return null;

  const phone = contact?.whatsappEnabled ? contact.whatsappPhone : "";

  return (
    <section
      id="servicios"
      aria-labelledby="servicios-titulo"
      className="site-gutter bg-paper py-16 md:py-24"
    >
      <SectionHeading
        eyebrow={section.eyebrow}
        title={section.title}
        subtitle={section.subtitle}
        titleId="servicios-titulo"
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[26px]">
        {section.items.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            index={index}
            href={
              phone && card.whatsappSubject
                ? whatsappHref(phone, `Hola VJA, quería consultar por ${card.whatsappSubject}.`)
                : null
            }
          />
        ))}
      </div>
    </section>
  );
}

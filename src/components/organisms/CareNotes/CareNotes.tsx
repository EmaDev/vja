import Link from "next/link";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import type { CareNote, CareSection } from "@/lib/cms/types";

export interface CareNotesProps {
  section: CareSection;
}

function Note({ note }: { note: CareNote }) {
  const body = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[12px] bg-sand">
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
          <ImagePlaceholder src={note.imageUrl} alt={note.imageAlt} label={note.title} />
        </div>
      </div>
      <div className="pt-5">
        {note.tag ? (
          <span className="text-[11px] uppercase tracking-[0.18em] text-terracotta">{note.tag}</span>
        ) : null}
        <h3 className="mt-2.5 font-display text-[24px] leading-[1.15] text-forest">{note.title}</h3>
        <p className="mt-2.5 text-[15px] leading-[1.6] text-ink">{note.summary}</p>
        {note.href ? (
          <span className="mt-4 inline-block border-b border-forest pb-[3px] text-[15px] text-forest transition-colors group-hover:border-sage group-hover:text-sage">
            Leer →
          </span>
        ) : null}
      </div>
    </>
  );

  if (!note.href) return <article className="group">{body}</article>;

  return (
    <Link
      href={note.href}
      className="group block rounded-[12px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sage"
    >
      {body}
    </Link>
  );
}

/** Notas de cuidado. Cada una puede enlazar a la nota completa; sin enlace se
 * queda como consejo breve en la portada. */
export function CareNotes({ section }: CareNotesProps) {
  if (section.items.length === 0) return null;

  return (
    <section
      id="cuidados"
      aria-labelledby="cuidados-titulo"
      className="site-gutter bg-paper py-16 md:py-24"
    >
      <SectionHeading
        eyebrow={section.eyebrow}
        title={section.title}
        subtitle={section.subtitle}
        titleId="cuidados-titulo"
      />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[26px]">
        {section.items.map((note) => (
          <Note key={note.id} note={note} />
        ))}
      </div>
    </section>
  );
}

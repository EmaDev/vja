import { Eyebrow } from "@/components/atoms/Eyebrow";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import { StatBlock } from "@/components/atoms/StatBlock";
import type { AboutSection } from "@/lib/cms/types";

export interface AboutBlockProps {
  section: AboutSection;
}

/** "Quiénes somos": texto y números a la izquierda, foto vertical con una segunda
 * foto montada a la derecha. */
export function AboutBlock({ section }: AboutBlockProps) {
  return (
    <section
      id="nosotros"
      aria-labelledby="nosotros-titulo"
      className="site-gutter bg-paper-light py-16 md:py-24"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center lg:gap-20">
        <div>
          {section.eyebrow ? <Eyebrow>{section.eyebrow}</Eyebrow> : null}
          <h2
            id="nosotros-titulo"
            className="mt-3 text-pretty font-display text-[40px] font-normal leading-[1.03] text-forest sm:text-[52px] lg:text-[64px]"
          >
            {section.title}
            {section.titleHighlight ? (
              <>
                <br />
                <em className="text-sage">{section.titleHighlight}</em>
              </>
            ) : null}
          </h2>
          {section.bodyFirst ? (
            <p className="mt-6 max-w-[520px] text-base leading-[1.65] text-ink md:text-lg">
              {section.bodyFirst}
            </p>
          ) : null}
          {section.bodySecond ? (
            <p className="mt-4 max-w-[520px] text-base leading-[1.65] text-ink md:text-lg">
              {section.bodySecond}
            </p>
          ) : null}

          {section.stats.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-line pt-8 sm:grid-cols-4">
              {section.stats.map((stat) => (
                <StatBlock key={stat.id} value={stat.value} label={stat.label} />
              ))}
            </div>
          ) : null}
        </div>

        {/* El `pb`/`pr` en pantallas grandes reserva el lugar donde asoma la foto
            chica; sin eso se recortaría contra el borde de la grilla. */}
        <div className="relative lg:pb-16 lg:pr-16">
          <div className="aspect-[4/5] overflow-hidden rounded-[18px] bg-sand">
            <ImagePlaceholder
              src={section.imageUrl}
              alt={section.imageAlt}
              label="Foto del vivero"
            />
          </div>
          {section.accentImageUrl ? (
            <div className="absolute bottom-0 right-0 hidden h-[220px] w-[220px] overflow-hidden rounded-[18px] border-[6px] border-paper-light bg-sand lg:block">
              <ImagePlaceholder src={section.accentImageUrl} alt={section.accentImageAlt} />
            </div>
          ) : null}
          {section.badgeLabel ? (
            <span className="absolute left-5 top-5 rounded-full bg-paper/92 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-forest">
              {section.badgeLabel}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}

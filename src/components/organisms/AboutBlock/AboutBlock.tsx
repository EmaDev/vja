import { Eyebrow } from "@/components/atoms/Eyebrow";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import { StatBlock } from "@/components/atoms/StatBlock";
import { Reveal, STAGGER } from "@/components/motion/Reveal";
import type { AboutSection } from "@/lib/cms/types";

export interface AboutBlockProps {
  section: AboutSection;
}

/** "Quiénes somos": texto y números a la izquierda, foto vertical con una segunda
 * foto montada a la derecha.
 *
 * Las dos columnas entran una desde cada costado y los párrafos se encadenan de
 * arriba hacia abajo. Los números cuentan desde cero cuando la fila llega a
 * pantalla —lo resuelve `StatBlock`—, así que la demora de su entrada es corta:
 * la cuenta tiene que empezar cuando el visitante ya los está mirando. */
export function AboutBlock({ section }: AboutBlockProps) {
  return (
    <section
      id="nosotros"
      aria-labelledby="nosotros-titulo"
      className="site-gutter bg-paper-light py-16 md:py-24"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center lg:gap-20">
        <div>
          {section.eyebrow ? (
            <Reveal animation="fade" duration={0.5}>
              <Eyebrow>{section.eyebrow}</Eyebrow>
            </Reveal>
          ) : null}
          <Reveal delay={0.08}>
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
          </Reveal>
          {section.bodyFirst ? (
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-[520px] text-base leading-[1.65] text-ink md:text-lg">
                {section.bodyFirst}
              </p>
            </Reveal>
          ) : null}
          {section.bodySecond ? (
            <Reveal delay={0.22}>
              <p className="mt-4 max-w-[520px] text-base leading-[1.65] text-ink md:text-lg">
                {section.bodySecond}
              </p>
            </Reveal>
          ) : null}

          {section.stats.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-line pt-8 sm:grid-cols-4">
              {section.stats.map((stat, index) => (
                <Reveal key={stat.id} delay={index * STAGGER} duration={0.6} amount={0.4}>
                  <StatBlock value={stat.value} label={stat.label} />
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>

        {/* El `pb`/`pr` en pantallas grandes reserva el lugar donde asoma la foto
            chica; sin eso se recortaría contra el borde de la grilla. */}
        <div className="relative lg:pb-16 lg:pr-16">
          <Reveal animation="right" duration={0.9} amount={0.15}>
            {/* La foto entra desde la derecha y, ya puesta, se acerca despacio
                al pasar el mouse: el recorte la contiene, así que lo único que
                se mueve es la imagen dentro del marco. */}
            <div className="group aspect-[4/5] overflow-hidden rounded-[18px] bg-sand">
              <div className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]">
                <ImagePlaceholder
                  src={section.imageUrl}
                  alt={section.imageAlt}
                  label="Foto del vivero"
                />
              </div>
            </div>
          </Reveal>
          {section.accentImageUrl ? (
            <Reveal
              animation="zoom"
              delay={0.25}
              duration={0.7}
              className="absolute bottom-0 right-0 hidden lg:block"
            >
              <div className="h-[220px] w-[220px] overflow-hidden rounded-[18px] border-[6px] border-paper-light bg-sand">
                <ImagePlaceholder src={section.accentImageUrl} alt={section.accentImageAlt} />
              </div>
            </Reveal>
          ) : null}
          {section.badgeLabel ? (
            <Reveal animation="fade" delay={0.4} className="absolute left-5 top-5">
              <span className="rounded-full bg-paper/92 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-forest">
                {section.badgeLabel}
              </span>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}

import { Eyebrow } from "@/components/atoms/Eyebrow";
import { cn } from "@/lib/utils";

export type SectionHeadingProps = {
  /** Volanta. Vacía se omite. */
  eyebrow?: string;
  title: string;
  /** Segunda línea del titular, en itálica y verde salvia. Vacía deja el titular
   * en una sola línea. */
  titleHighlight?: string;
  subtitle?: string;
  /** Id del `<h2>`, para el `aria-labelledby` de la sección. */
  titleId?: string;
  tone?: "dark" | "light";
  className?: string;
  /** Pieza al costado del titular: el enlace "ver todo" de la grilla de
   * categorías, por ejemplo. En mobile cae debajo. */
  aside?: React.ReactNode;
};

/** Encabezado de sección del sitio público: volanta, titular serif y bajada.
 *
 * Las ocho secciones de la landing lo repetían con las mismas medidas, así que
 * los tamaños de tipografía viven acá: cambiarlos en un lugar las alinea todas. */
export function SectionHeading({
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  titleId,
  tone = "dark",
  className,
  aside,
}: SectionHeadingProps) {
  const dark = tone === "dark";

  const heading = (
    <div className="max-w-[620px]">
      {eyebrow ? <Eyebrow tone={dark ? "terracotta" : "cream"}>{eyebrow}</Eyebrow> : null}
      <h2
        id={titleId}
        className={cn(
          "mt-3 text-pretty font-display text-[38px] font-normal leading-[1.05] sm:text-[48px] lg:text-[56px]",
          dark ? "text-forest" : "text-[#F9F6EF]",
        )}
      >
        {title}
        {titleHighlight ? (
          <>
            {" "}
            <em className={dark ? "text-sage" : "text-[#A8BFA2]"}>{titleHighlight}</em>
          </>
        ) : null}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-4 text-base leading-[1.6] md:text-lg",
            dark ? "text-ink" : "text-[#D5DCCF]",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );

  if (!aside) return <div className={cn("mb-10 lg:mb-14", className)}>{heading}</div>;

  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10 lg:mb-14",
        className,
      )}
    >
      {heading}
      <div className="shrink-0">{aside}</div>
    </div>
  );
}

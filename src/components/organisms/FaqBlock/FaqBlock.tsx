"use client";

import { useMemo, useState } from "react";
import { ChevronDownIcon, SearchIcon } from "@/components/atoms/icons";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { whatsappHref } from "@/lib/cms/whatsapp";
import type { FaqSection } from "@/lib/cms/types";

export interface FaqBlockProps {
  section: FaqSection;
  /** A dónde va la pregunta que no está en la lista. Vacío oculta ese enlace. */
  whatsappPhone: string;
}

/** Minúsculas y sin acentos, para que "envios" encuentre "envíos". */
function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

/** Preguntas frecuentes con buscador.
 *
 * El acordeón son `<details>` nativos: abren sin JavaScript, los lee cualquier
 * lector de pantalla y el buscador sólo filtra qué `<details>` se muestran. */
export function FaqBlock({ section, whatsappPhone }: FaqBlockProps) {
  const [query, setQuery] = useState("");

  const trimmed = query.trim();
  const filtered = useMemo(() => {
    const needle = normalize(trimmed);
    if (!needle) return section.items;
    return section.items.filter(
      (item) => normalize(item.question).includes(needle) || normalize(item.answer).includes(needle),
    );
  }, [section.items, trimmed]);

  if (section.items.length === 0) return null;

  const askHref = trimmed
    ? whatsappHref(whatsappPhone, `Hola VJA, mi pregunta es: ${trimmed}`)
    : null;

  return (
    <section id="faq" aria-labelledby="faq-titulo" className="site-gutter bg-paper-dark py-16 md:py-24">
      <div className="mx-auto max-w-[820px]">
        {section.eyebrow ? <Eyebrow>{section.eyebrow}</Eyebrow> : null}
        <h2
          id="faq-titulo"
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

        <div className="mt-9 flex items-center gap-3 rounded-full border border-line bg-paper-light px-5 py-[13px] focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-sage">
          <SearchIcon className="h-[18px] w-[18px] shrink-0 text-taupe" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={section.searchPlaceholder || "Buscá tu pregunta"}
            aria-label="Buscar en preguntas frecuentes"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-forest outline-none placeholder:text-taupe"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="mt-6 text-[15px] leading-[1.6] text-ink">
            No encontramos esa pregunta.{" "}
            {askHref ? (
              <a
                href={askHref}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-forest pb-[2px] text-forest transition-colors hover:border-sage hover:text-sage"
              >
                Preguntale al equipo por WhatsApp →
              </a>
            ) : null}
          </p>
        ) : (
          <div className="mt-6">
            {filtered.map((item) => (
              <details key={item.id} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-[17px] leading-[1.4] text-forest transition-colors hover:text-sage focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <ChevronDownIcon className="h-[18px] w-[18px] shrink-0 text-taupe transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="max-w-[680px] pb-6 text-[15px] leading-[1.65] text-ink">{item.answer}</p>
              </details>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

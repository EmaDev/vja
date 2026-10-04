"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDownIcon, SearchIcon } from "@/components/atoms/icons";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { EASE_OUT, Reveal, STAGGER } from "@/components/motion/Reveal";
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
 * lector de pantalla y el buscador sólo filtra qué `<details>` se muestran.
 *
 * Filtrar cambia la lista debajo de los dedos, así que las preguntas que salen
 * se desvanecen y las que entran suben a su lugar en vez de saltar de golpe:
 * con la lista corriéndose sola cuesta seguir qué quedó. */
export function FaqBlock({ section, whatsappPhone }: FaqBlockProps) {
  const [query, setQuery] = useState("");
  const reduceMotion = useReducedMotion();

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
        {section.eyebrow ? (
          <Reveal animation="fade" duration={0.5}>
            <Eyebrow>{section.eyebrow}</Eyebrow>
          </Reveal>
        ) : null}
        <Reveal delay={0.08}>
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
        </Reveal>

        <Reveal
          delay={0.16}
          className="mt-9 flex items-center gap-3 rounded-full border border-line bg-paper-light px-5 py-[13px] transition-colors duration-300 focus-within:border-sage focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-sage"
        >
          <SearchIcon className="h-[18px] w-[18px] shrink-0 text-taupe" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={section.searchPlaceholder || "Buscá tu pregunta"}
            aria-label="Buscar en preguntas frecuentes"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-forest outline-none placeholder:text-taupe"
          />
        </Reveal>

        {filtered.length === 0 ? (
          <motion.p
            initial={reduceMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className="mt-6 text-[15px] leading-[1.6] text-ink"
          >
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
          </motion.p>
        ) : (
          <Reveal delay={0.24} className="mt-6">
            <AnimatePresence initial={false} mode="popLayout">
              {filtered.map((item, index) => (
                <motion.details
                  key={item.id}
                  layout={reduceMotion ? false : "position"}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.35,
                    delay: reduceMotion ? 0 : Math.min(index, 6) * (STAGGER / 2),
                    ease: EASE_OUT,
                  }}
                  className="group border-b border-line"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-[17px] leading-[1.4] text-forest transition-colors hover:text-sage focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <ChevronDownIcon className="h-[18px] w-[18px] shrink-0 text-taupe transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="max-w-[680px] pb-6 text-[15px] leading-[1.65] text-ink">
                    {item.answer}
                  </p>
                </motion.details>
              ))}
            </AnimatePresence>
          </Reveal>
        )}
      </div>
    </section>
  );
}

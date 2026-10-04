"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CtaButton } from "@/components/atoms/CtaButton";
import { CheckIcon, CloseIcon, MapPinIcon } from "@/components/atoms/icons";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { EASE_OUT, Reveal } from "@/components/motion/Reveal";
import { whatsappHref } from "@/lib/cms/whatsapp";
import { cn } from "@/lib/utils";
import type { ShippingSection } from "@/lib/cms/types";

export interface ShippingCheckerProps {
  section: ShippingSection;
  /** Número al que se consulta la cotización. Vacío deja el resultado sin botón. */
  whatsappPhone: string;
  /** `true` cuando va como segunda columna de “Visitanos”: pierde la franja
   * propia —fondo, márgenes laterales y aire vertical— y aporta sólo su
   * encabezado y la tarjeta. */
  embedded?: boolean;
}

type Result =
  | { kind: "covered"; postalCode: string; locality: string }
  | { kind: "not-covered"; postalCode: string }
  | { kind: "invalid" };

const POSTAL_CODE_LENGTH = 4;

/** Verificador de zona de envío.
 *
 * Las zonas se cargan en el CMS, así que ampliar la cobertura es sumar una fila y
 * publicar: no hay una lista de códigos postales escrita en el código.
 *
 * La respuesta se despliega en lugar de aparecer: es lo único que cambia en la
 * pantalla después de apretar “Verificar”, y el movimiento es lo que lleva la
 * vista hasta ahí. Verificar otro código cruza una respuesta con la otra —de
 * ahí el `mode="wait"`—, así que nunca hay dos tarjetas a la vez. */
export function ShippingChecker({ section, whatsappPhone, embedded = false }: ShippingCheckerProps) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const reduceMotion = useReducedMotion();

  /** Entrada y salida de las tres respuestas posibles, que comparten el lugar
   * debajo del formulario.
   *
   * El alto entra en la animación para que la respuesta empuje lo que tiene
   * debajo en vez de aparecer encima, y por eso va en un envoltorio sin relleno
   * ni borde: un alto animado hasta cero sobre la tarjeta misma se frenaría en
   * el alto de su padding. */
  const feedback = {
    initial: reduceMotion ? undefined : { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" as const },
    exit: reduceMotion ? undefined : { opacity: 0, height: 0 },
    transition: { duration: reduceMotion ? 0 : 0.4, ease: EASE_OUT },
    className: "overflow-hidden",
  };

  /** Índice `código postal → localidad`. Los códigos se normalizan a dígitos
   * porque en el panel se pueden haber cargado con espacios. */
  const zones = useMemo(() => {
    const map = new Map<string, string>();
    for (const zone of section.zones) {
      const code = zone.postalCode.replace(/\D/g, "");
      if (code) map.set(code, zone.locality);
    }
    return map;
  }, [section.zones]);

  function check(event: React.FormEvent) {
    event.preventDefault();
    const code = value.trim();
    if (code.length !== POSTAL_CODE_LENGTH) {
      setResult({ kind: "invalid" });
      return;
    }
    const locality = zones.get(code);
    setResult(locality ? { kind: "covered", postalCode: code, locality } : { kind: "not-covered", postalCode: code });
  }

  const ctaLabel = section.ctaLabel.trim() || "Consultar por WhatsApp";

  const coveredHref =
    result?.kind === "covered"
      ? whatsappHref(
          whatsappPhone,
          `Hola VJA, quería cotizar un envío a ${result.locality} (CP ${result.postalCode}). Mi dirección es:`,
        )
      : null;

  const notCoveredHref =
    result?.kind === "not-covered"
      ? whatsappHref(
          whatsappPhone,
          `Hola VJA, quería consultar si pueden hacer un envío al CP ${result.postalCode}.`,
        )
      : null;

  return (
    <section
      id="envios"
      aria-labelledby="envios-titulo"
      className={embedded ? undefined : "site-gutter bg-paper py-16 md:py-24"}
    >
      <SectionHeading
        eyebrow={section.eyebrow}
        title={section.title}
        subtitle={section.subtitle}
        titleId="envios-titulo"
      />

      {/* Embebido el fondo de la sección ya es papel claro, así que la tarjeta
          invierte los tonos para seguir leyéndose como tarjeta. */}
      <Reveal
        delay={0.2}
        amount={0.25}
        className={cn(
          "rounded-[16px] border border-line p-6 md:p-8",
          embedded ? "bg-paper" : "max-w-[620px] bg-paper-light",
        )}
      >
        <form onSubmit={check}>
          <label htmlFor="codigo-postal" className="flex items-center gap-2 text-[13px] text-ink">
            <MapPinIcon className="h-4 w-4 text-sage" />
            Tu código postal
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              id="codigo-postal"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={POSTAL_CODE_LENGTH}
              placeholder="Ej: 1754"
              value={value}
              onChange={(event) => setValue(event.target.value.replace(/\D/g, ""))}
              className="flex-1 rounded-full border border-line bg-paper px-5 py-[15px] text-[15px] text-forest outline-none placeholder:text-taupe focus:outline-2 focus:outline-offset-1 focus:outline-sage"
            />
            <CtaButton type="submit" tone="forest">
              Verificar
            </CtaButton>
          </div>
        </form>

        <AnimatePresence mode="wait" initial={false}>
          {result?.kind === "invalid" ? (
            <motion.div key="invalid" {...feedback}>
              <p role="alert" className="mt-4 text-[14px] text-terracotta">
                Ingresá un código postal válido, de {POSTAL_CODE_LENGTH} dígitos.
              </p>
            </motion.div>
          ) : null}

          {result?.kind === "covered" ? (
            <motion.div key="covered" {...feedback}>
              <div
                role="status"
                className="mt-6 rounded-[12px] border border-sage/30 bg-sage/[0.07] p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage text-paper">
                    <CheckIcon className="h-[18px] w-[18px]" />
                  </span>
                  <div>
                    <strong className="block text-[15px] font-medium text-forest">
                      ¡Estás en nuestra zona!
                    </strong>
                    <span className="text-[14px] text-stone">
                      {result.locality} · CP {result.postalCode}
                    </span>
                  </div>
                </div>
                {section.coveredNote ? (
                  <p className="mt-4 text-[14px] leading-[1.6] text-ink">{section.coveredNote}</p>
                ) : null}
                {coveredHref ? (
                  <div className="mt-5">
                    <CtaButton href={coveredHref} tone="forest" size="sm">
                      {ctaLabel}
                    </CtaButton>
                  </div>
                ) : null}
              </div>
            </motion.div>
          ) : null}

          {result?.kind === "not-covered" ? (
            <motion.div key="not-covered" {...feedback}>
              <div
                role="status"
                className="mt-6 rounded-[12px] border border-terracotta/30 bg-terracotta/[0.06] p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracotta text-paper-light">
                    <CloseIcon className="h-[18px] w-[18px]" />
                  </span>
                  <div>
                    <strong className="block text-[15px] font-medium text-forest">
                      Por ahora no llegamos a tu zona
                    </strong>
                    <span className="text-[14px] text-stone">CP {result.postalCode}</span>
                  </div>
                </div>
                {section.notCoveredNote ? (
                  <p className="mt-4 text-[14px] leading-[1.6] text-ink">
                    {section.notCoveredNote}
                  </p>
                ) : null}
                {notCoveredHref ? (
                  <div className="mt-5">
                    <CtaButton href={notCoveredHref} tone="forest" variant="outline" size="sm">
                      {ctaLabel}
                    </CtaButton>
                  </div>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Reveal>
    </section>
  );
}

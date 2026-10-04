"use client";

import { useEffect, useMemo, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/components/motion/Reveal";

export interface CountUpProps {
  /** El valor tal cual se cargó en el panel: "500+", "365", "100%", "Premium". */
  value: string;
  className?: string;
  /** Cuánto dura la cuenta, en segundos. */
  duration?: number;
}

interface ParsedStat {
  prefix: string;
  suffix: string;
  target: number;
  decimals: number;
  /** El valor original traía separador de miles, así que la cuenta también lo usa. */
  grouped: boolean;
}

/** Un número con lo que venga pegado adelante y atrás: el "+" de "500+", el "%"
 * de "100%", el "$" de "$12.000". */
const STAT_PATTERN = /^(\D*)(\d[\d.,]*?)(\D*)$/;

/** Separa el número del adorno. Devuelve `null` para un valor sin número
 * —"Premium", "Todo el año"—, que entonces se queda quieto. */
function parseStat(value: string): ParsedStat | null {
  const match = STAT_PATTERN.exec(value.trim());
  if (!match) return null;

  const [, prefix, rawNumber, suffix] = match;
  // Convención local: el punto separa miles y la coma, decimales.
  const normalized = rawNumber.replace(/\./g, "").replace(",", ".");
  const target = Number(normalized);
  if (!Number.isFinite(target)) return null;

  const [, fraction = ""] = normalized.split(".");
  return {
    prefix,
    suffix,
    target,
    decimals: fraction.length,
    grouped: rawNumber.includes("."),
  };
}

/** El texto que se muestra en un punto cualquiera de la cuenta, con el adorno
 * puesto. */
function render(latest: number, stat: ParsedStat): string {
  const number = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: stat.decimals,
    maximumFractionDigits: stat.decimals,
    useGrouping: stat.grouped,
  }).format(latest);

  return `${stat.prefix}${number}${stat.suffix}`;
}

/** Número que cuenta desde cero la primera vez que entra en pantalla.
 *
 * En reposo dibuja el string del panel sin tocarlo, y eso es también lo que
 * sale del servidor: un buscador o un visitante sin JavaScript lee "500+" y no
 * "0+". La cuenta se escribe sobre el nodo en vez de pasar por estado de React
 * —son sesenta valores por segundo y ninguno le interesa a nadie más—, así que
 * el componente se dibuja una sola vez; al terminar vuelve a poner el string
 * original, de modo que ningún redondeo ni formato puede dejar en pantalla algo
 * distinto de lo que se cargó.
 *
 * Un valor sin número no tiene nada que contar y se dibuja igual que antes. */
export function CountUp({ value, className, duration = 1.6 }: CountUpProps) {
  const stat = useMemo(() => parseStat(value), [value]);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !stat || reduceMotion) return;

    // Mientras el bloque no llegue a pantalla, el contador espera en cero. No se
    // puede arrancar en cero ya desde el servidor: el primer render del cliente
    // tiene que coincidir con el HTML recibido. Para cuando este efecto corre,
    // la entrada de `Reveal` todavía tiene el bloque en opacidad cero, así que
    // el cambio no llega a verse.
    node.textContent = render(0, stat);
    if (!inView) return;

    const controls = animate(0, stat.target, {
      duration,
      ease: EASE_OUT,
      onUpdate: (latest) => {
        node.textContent = render(latest, stat);
      },
    });

    return () => {
      controls.stop();
      node.textContent = value;
    };
  }, [duration, inView, reduceMotion, stat, value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

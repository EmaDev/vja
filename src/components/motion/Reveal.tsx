"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

/** La curva de salida del sitio: arranca rápido y frena largo. Es la misma que
 * usa la pantalla de ingreso, así que una entrada de la landing y una del panel
 * se sienten del mismo material. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Paso entre un elemento y el siguiente de una misma tanda. Multiplicado por el
 * índice da la demora de cada card: lo suficiente para que se lea como una
 * cascada y no tanto como para que el último llegue cuando ya se pasó de largo. */
export const STAGGER = 0.08;

export type RevealAnimation = "rise" | "fade" | "left" | "right" | "zoom";

/** Desde dónde entra cada variante. El estado de llegada siempre es el reposo
 * —opacidad 1, sin desplazamiento ni escala— así que basta con declarar la
 * salida. */
const from: Record<RevealAnimation, { x?: number; y?: number; scale?: number }> = {
  rise: { y: 28 },
  fade: {},
  left: { x: -36 },
  right: { x: 36 },
  zoom: { scale: 1.05 },
};

export interface RevealProps {
  children: ReactNode;
  /** Desde dónde entra. `rise` (abajo) es lo que usan casi todas las secciones. */
  animation?: RevealAnimation;
  /** Demora en segundos. Para una tanda de cards, `index * STAGGER`. */
  delay?: number;
  duration?: number;
  /** Qué fracción del bloque tiene que estar en pantalla para disparar. Un
   * bloque alto —una columna entera— necesita un número chico o no entra nunca
   * entero en la ventana. */
  amount?: number;
  className?: string;
  style?: CSSProperties;
}

/** Entrada al entrar en pantalla. Envuelve un pedazo de la landing —un titular,
 * una card, una fila— y lo trae a su lugar la primera vez que se lo ve.
 *
 * Anima una sola vez (`once`): volver a subir y bajar la página no vuelve a
 * desarmar lo que ya se leyó. El margen inferior del viewport adelanta el
 * disparo unos pixeles, para que el bloque termine de entrar justo cuando queda
 * a la vista y no después.
 *
 * Quien pidió menos movimiento en su sistema recibe el contenido ya puesto: lo
 * que escribe framer-motion son estilos en línea y el bloque
 * `prefers-reduced-motion` de `globals.css` —que sólo alcanza al CSS— no los
 * toca. */
export function Reveal({
  children,
  animation = "rise",
  delay = 0,
  duration = 0.7,
  amount = 0.2,
  className,
  style,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={style}
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, ...from[animation] }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount, margin: "0px 0px -8% 0px" }}
      transition={{ duration: reduceMotion ? 0 : duration, delay: reduceMotion ? 0 : delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

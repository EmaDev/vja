"use client";

import { Fragment } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE_OUT } from "./Reveal";

export interface RevealWordsProps {
  text: string;
  /** Qué etiqueta dibuja el bloque. El cierre del pie es un párrafo; un titular
   * pediría `h2`. */
  as?: "p" | "h2";
  className?: string;
  delay?: number;
}

const container: Variants = {
  hidden: {},
  shown: (delay: number) => ({
    transition: { staggerChildren: 0.045, delayChildren: delay },
  }),
};

const word: Variants = {
  hidden: { opacity: 0, y: "0.35em" },
  shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

/** Frase que entra palabra por palabra.
 *
 * Es cara en nodos —un `span` por palabra— así que está pensada para un solo
 * bloque grande por página: la frase de cierre del pie, donde el texto es el
 * elemento gráfico de la franja y conviene que se escriba solo. Para el resto
 * alcanza con `Reveal`, que mueve el párrafo entero de una pieza.
 *
 * El texto se parte por espacios y cada palabra queda en un `inline-block`, así
 * que el salto de línea lo sigue decidiendo el navegador y la frase se lee
 * igual de corrido para un lector de pantalla.
 *
 * Con menos movimiento pedido se dibujan los mismos `span` sin animación, en
 * vez de un solo bloque de texto: el HTML del servidor y el del cliente tienen
 * que coincidir, y cambiar la forma del árbol obligaría a React a rehacerlo
 * entero al hidratar. */
export function RevealWords({ text, as = "p", className, delay = 0 }: RevealWordsProps) {
  const reduceMotion = useReducedMotion();
  const Tag = as === "h2" ? motion.h2 : motion.p;
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag
      className={className}
      variants={reduceMotion ? undefined : container}
      custom={delay}
      initial={reduceMotion ? undefined : "hidden"}
      whileInView={reduceMotion ? undefined : "shown"}
      viewport={{ once: true, amount: 0.25 }}
    >
      {words.map((item, index) => (
        <Fragment key={`${item}-${index}`}>
          <motion.span variants={reduceMotion ? undefined : word} className="inline-block">
            {item}
          </motion.span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

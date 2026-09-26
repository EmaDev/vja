"use client";

import { useEffect, useRef, useState } from "react";
import { whatsappHref } from "@/lib/cms/whatsapp";
import type { ContactSection } from "@/lib/cms/types";

/** Cuánto tarda en dejar de considerarse "scrolleando" después del último evento
 * de scroll: lo justo para que el achique se sienta pegado al gesto y el
 * agrandamiento llegue apenas el usuario se detiene. */
const SCROLL_IDLE_MS = 150;

export interface WhatsAppButtonProps {
  section: ContactSection;
}

/** El glifo va con `fill`, no con `stroke`, así que no usa el helper `createIcon`
 * de `atoms/icons.tsx`, que arma iconos de contorno. */
function WhatsAppGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-[26px] w-[26px] shrink-0 sm:h-6 sm:w-6"
    >
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.08-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Z" />
    </svg>
  );
}

/** Botón flotante de WhatsApp, presente en toda la landing.
 *
 * Sólo el ícono, fijo en la esquina en todo momento: entra con una animación al
 * montar, y se achica mientras el usuario scrollea para volver a su tamaño apenas
 * el scroll se detiene (vía `SCROLL_IDLE_MS`). El verde es el de la marca de
 * WhatsApp y no el de la paleta del sitio: acá la señal que importa es que se
 * reconozca de un vistazo. */
export function WhatsAppButton({ section }: WhatsAppButtonProps) {
  const [entered, setEntered] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolling(true);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setScrolling(false), SCROLL_IDLE_MS);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  if (!section.whatsappEnabled) return null;

  const href = whatsappHref(section.whatsappPhone, section.whatsappMessage);
  if (!href) return null;

  const label = section.whatsappLabel.trim() || "Escribinos";

  const scale = !entered ? 0.4 : scrolling ? 0.82 : 1;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} por WhatsApp`}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-paper-light shadow-[0_10px_30px_rgba(23,48,31,0.28)] hover:bg-[#1FBA57] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest sm:bottom-7 sm:right-7 sm:h-16 sm:w-16"
      style={{
        opacity: entered ? 1 : 0,
        transform: `translateY(${entered ? 0 : 16}px) scale(${scale})`,
        transitionProperty: "transform, opacity, background-color",
        transitionDuration: scrolling ? "200ms" : "450ms",
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <WhatsAppGlyph />
    </a>
  );
}

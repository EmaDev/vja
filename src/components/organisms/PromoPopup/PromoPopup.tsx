"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PromoPopupCard } from "@/components/organisms/PromoPopup/PromoPopupCard";
import { isPromotionActiveAt, siteMoment, type Promotion } from "@/lib/cms/promo-types";

/** Un respiro antes de tapar la portada: que se vea el hero primero. */
const OPEN_DELAY_MS = 900;

const DISMISSED_KEY = "vja:promo-dismissed";

export interface PromoPopupProps {
  /** Promociones publicadas. El calendario se evalúa acá, en el navegador. */
  promotions: Promotion[];
}

/** Marca de cierre de esta sesión de navegación.
 *
 * En `sessionStorage` y no en `localStorage` a propósito: quien cierra el popup
 * no quiere verlo otra vez mientras recorre el sitio, pero la promoción de la
 * semana que viene sí tiene que volver a aparecer. Se guarda el id para que una
 * promo nueva no herede el cierre de la anterior.
 *
 * En modo privado o con el almacenamiento bloqueado, leer o escribir tira: el
 * popup tiene que seguir funcionando igual, sólo que sin memoria. */
function wasDismissed(id: string): boolean {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === id;
  } catch {
    return false;
  }
}

function rememberDismissal(id: string): void {
  try {
    sessionStorage.setItem(DISMISSED_KEY, id);
  } catch {
    // Sin almacenamiento el popup vuelve en la próxima página. Es aceptable.
  }
}

/** Popup promocional de la landing.
 *
 * El calendario no se puede resolver en el servidor: la página publicada queda
 * cacheada contra `PROMOTIONS_TAG` y una promo que arranca el martes se
 * congelaría en el estado que tenía cuando se generó el HTML. Por eso llegan
 * todas las publicadas y acá se elige, con el reloj del visitante traducido a la
 * hora de Argentina.
 *
 * Ese mismo motivo obliga a montar el popup recién después de hidratar: si el
 * primer render del cliente decidiera algo distinto del HTML del servidor, React
 * marcaría un error de hidratación. */
export function PromoPopup({ promotions }: PromoPopupProps) {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moment = siteMoment();
    // El orden del listado del CMS desempata: la primera que corre hoy es la que
    // se muestra. Dos popups encimados no serían una promoción, serían un ruido.
    const active = promotions.find((candidate) => isPromotionActiveAt(candidate, moment));
    if (!active || wasDismissed(active.id)) return;

    const timer = setTimeout(() => setPromotion(active), OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, [promotions]);

  const close = useCallback(() => {
    setPromotion((current) => {
      if (current) rememberDismissal(current.id);
      return null;
    });
  }, []);

  useEffect(() => {
    if (!promotion) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);

    // El scroll del fondo se congela mientras el popup está abierto; si no, la
    // rueda del mouse mueve la landing de atrás en vez de la tarjeta.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // El foco entra al diálogo para que el teclado no siga recorriendo la página
    // tapada. El contenedor es `tabIndex={-1}`: recibe foco sin entrar al orden
    // de tabulación.
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [promotion, close]);

  if (!promotion) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={promotion.title || "Promoción"}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-forest/45 p-5 backdrop-blur-[3px]"
      onClick={(event) => {
        // Sólo el fondo cierra: un clic dentro de la tarjeta no tiene por qué
        // hacerla desaparecer.
        if (event.target === event.currentTarget) close();
      }}
    >
      <div ref={dialogRef} tabIndex={-1} className="w-full max-w-[420px] outline-none">
        <PromoPopupCard promotion={promotion} onClose={close} />
      </div>
    </div>,
    document.body,
  );
}

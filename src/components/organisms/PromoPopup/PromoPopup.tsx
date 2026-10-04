"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PromoPopupCard } from "@/components/organisms/PromoPopup/PromoPopupCard";
import { isPromotionActiveAt, siteMoment, type Promotion } from "@/lib/cms/promo-types";
import { cn } from "@/lib/utils";

/** Un respiro antes de tapar la portada: que se vea el hero primero. */
const OPEN_DELAY_MS = 900;

/** Lo que tarda el repliegue en CSS. El desmontaje espera lo mismo: si se
 * quitara antes, la tarjeta desaparecería de golpe a mitad de la salida. */
const LEAVE_MS = 260;

const DISMISSED_KEY = "vja:promo-dismissed";

export interface PromoPopupProps {
  /** Promociones publicadas. El calendario se evalúa acá, en el navegador. */
  promotions: Promotion[];
}

/** Cuánto esperar antes de desmontar.
 *
 * Quien pidió menos movimiento en su sistema recibe una transición de un
 * instante —así la recorta la regla global de `prefers-reduced-motion`— y
 * entonces seguir esperando los 260 ms dejaría la pantalla con el popup ya
 * invisible pero todavía bloqueando el scroll. */
function leaveDelay(): number {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : LEAVE_MS;
  } catch {
    return LEAVE_MS;
  }
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
  // Estado de la transición, separado del montaje: la tarjeta tiene que existir
  // un fotograma en su posición de partida para que el navegador tenga desde
  // dónde animar, y tiene que seguir existiendo mientras se repliega.
  const [shown, setShown] = useState(false);
  const leaveTimer = useRef<number | null>(null);
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

  // Entrada: un fotograma pintado con la tarjeta abajo y transparente, y recién
  // después el estado final. Dos `requestAnimationFrame` porque el primero
  // todavía puede caer en el mismo pintado que el montaje, y entonces el salto
  // de clases no sería una transición sino un corte.
  useEffect(() => {
    if (!promotion) return;

    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setShown(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [promotion]);

  const close = useCallback(() => {
    // Un segundo clic en el fondo mientras se va no tiene que reiniciar la
    // cuenta del desmontaje.
    if (!promotion || leaveTimer.current !== null) return;

    rememberDismissal(promotion.id);
    setShown(false);
    leaveTimer.current = window.setTimeout(() => {
      leaveTimer.current = null;
      setPromotion(null);
    }, leaveDelay());
  }, [promotion]);

  useEffect(
    () => () => {
      if (leaveTimer.current !== null) clearTimeout(leaveTimer.current);
    },
    [],
  );

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
      className={cn(
        "fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-forest/45 p-5 backdrop-blur-[3px]",
        // El velo entra y sale con su propio ritmo, más corto que la tarjeta:
        // el fondo se oscurece mientras la tarjeta todavía está subiendo.
        "transition-opacity duration-300 ease-out motion-reduce:transition-none",
        shown ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      onClick={(event) => {
        // Sólo el fondo cierra: un clic dentro de la tarjeta no tiene por qué
        // hacerla desaparecer.
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          "w-full max-w-[420px] outline-none",
          // La tarjeta sube un poco y crece desde algo más chica. La curva es
          // casi un frenado puro: arranca rápido y se asienta sin rebote, que
          // en una promoción se leería como un sobresalto.
          "transition-[opacity,transform] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform motion-reduce:transition-none",
          // La salida es más corta que la entrada: irse rápido se siente
          // prolijo, llegar rápido se siente un golpe.
          shown
            ? "translate-y-0 scale-100 opacity-100 duration-[420ms]"
            : "translate-y-3 scale-[0.97] opacity-0 duration-[240ms]",
        )}
      >
        <PromoPopupCard promotion={promotion} onClose={close} />
      </div>
    </div>,
    document.body,
  );
}

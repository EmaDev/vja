"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AdminButton } from "@/components/atoms/AdminButton";
import { SegmentedControl } from "@/components/atoms/SegmentedControl";
import { QrLabelSheet } from "@/components/organisms/QrLabels/QrLabelSheet";
import {
  defaultQrLabelStyle,
  qrLabelStyles,
  siteUrlConfigured,
  type QrLabelStyleId,
} from "@/lib/cms/qr-labels";
import type { Product } from "@/lib/cms/catalog-types";

export interface QrPrintDialogProps {
  products: Product[];
  onClose: () => void;
}

/** Diálogo de impresión de etiquetas QR.
 *
 * Se monta en un portal colgado de `<body>` por una razón concreta: la hoja
 * impresa no puede heredar el layout del CMS (barra lateral, encabezado fijo,
 * scroll). Siendo hijo directo de `<body>`, la regla de impresión en
 * `globals.css` oculta todo lo demás con un solo selector, sin importar desde
 * qué pantalla se abrió. */
export function QrPrintDialog({ products, onClose }: QrPrintDialogProps) {
  const [style, setStyle] = useState<QrLabelStyleId>(defaultQrLabelStyle);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // El scroll del fondo se congela mientras el diálogo está abierto; si no, la
  // rueda del mouse mueve el listado de atrás en vez de la vista previa.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // El diálogo sólo se monta al tocar "Imprimir", o sea después de la
  // hidratación, así que en la práctica `document` siempre existe. El guard
  // está para que renderizarlo desde el servidor devuelva null en vez de tirar.
  if (typeof document === "undefined") return null;

  const selected = qrLabelStyles.find((item) => item.id === style);

  return createPortal(
    <div id="qr-print-portal">
      <div
        className="qr-print-overlay fixed inset-0 z-50 flex flex-col items-center gap-4 overflow-auto bg-forest/40 p-6 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Imprimir etiquetas QR"
      >
        <div className="qr-print-chrome flex w-full max-w-[820px] flex-wrap items-center justify-between gap-3 rounded-[10px] bg-paper-light px-5 py-4">
          <div>
            <div className="font-display text-xl leading-[1.1] text-forest">Etiquetas QR</div>
            <div className="mt-0.5 text-[13px] text-stone">
              {products.length} {products.length === 1 ? "producto" : "productos"}
              {selected ? ` · ${selected.description}` : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <SegmentedControl
              options={qrLabelStyles.map((item) => ({ value: item.id, label: item.label }))}
              value={style}
              onChange={setStyle}
            />
            <AdminButton variant="outline" onClick={onClose}>
              Cerrar
            </AdminButton>
            <AdminButton
              variant="solid"
              disabled={!siteUrlConfigured}
              onClick={() => window.print()}
            >
              Imprimir
            </AdminButton>
          </div>
        </div>

        {siteUrlConfigured ? null : (
          <div
            role="alert"
            className="qr-print-chrome w-full max-w-[820px] rounded-[10px] border border-terracotta/40 bg-terracotta/10 px-5 py-4 text-sm leading-[1.5] text-terracotta"
          >
            Falta configurar <code>NEXT_PUBLIC_SITE_URL</code> con el dominio del sitio. Sin eso
            los QR apuntarían a una dirección inexistente, así que la impresión queda bloqueada.
          </div>
        )}

        <div className="qr-print-frame w-full max-w-[820px] overflow-hidden rounded-[10px] bg-white shadow-[0_16px_40px_rgba(23,48,31,0.22)]">
          <QrLabelSheet products={products} style={style} />
        </div>
      </div>
    </div>,
    document.body,
  );
}

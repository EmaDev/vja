"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AdminButton } from "@/components/atoms/AdminButton";
import { SegmentedControl } from "@/components/atoms/SegmentedControl";
import { QrLabelSheet } from "@/components/organisms/QrLabels/QrLabelSheet";
import {
  defaultQrLabelOptions,
  qrColors,
  qrDescriptions,
  qrLabelStyles,
  qrSizes,
  siteUrlConfigured,
  siteUrlInvalid,
  type QrColorId,
  type QrLabelOptions,
} from "@/lib/cms/qr-labels";
import type { Product } from "@/lib/cms/catalog-types";

export interface QrPrintDialogProps {
  products: Product[];
  onClose: () => void;
}

/** Una opción del panel, con su rótulo encima y no al costado: de costado, la
 * fila de cuatro opciones se desarma en pantallas angostas y los rótulos
 * quedan huérfanos de su control. */
function OptionField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[7px]">
      <span className="text-[11px] uppercase tracking-[0.14em] text-taupe">{label}</span>
      {children}
    </div>
  );
}

/** Muestras de color. Cada botón se pinta con el color que aplica, que dice más
 * que su nombre: lo que importa es cómo va a salir impreso. */
function ColorSwatches({
  value,
  onChange,
}: {
  value: QrColorId;
  onChange: (value: QrColorId) => void;
}) {
  return (
    <div role="group" aria-label="Color del QR" className="flex items-center gap-2">
      {qrColors.map((color) => {
        const active = color.id === value;
        return (
          <button
            key={color.id}
            type="button"
            aria-pressed={active}
            aria-label={color.label}
            title={color.label}
            onClick={() => onChange(color.id)}
            style={{ backgroundColor: color.hex }}
            className={
              active
                ? "size-[26px] rounded-full shadow-[0_0_0_2px_#FBF8F1,0_0_0_4px_#3F6B47] transition-shadow duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
                : "size-[26px] rounded-full shadow-[0_0_0_1px_#D8D2C4] transition-shadow duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
            }
          />
        );
      })}
    </div>
  );
}

/** Diálogo de impresión de etiquetas QR.
 *
 * Se monta en un portal colgado de `<body>` por una razón concreta: la hoja
 * impresa no puede heredar el layout del CMS (barra lateral, encabezado fijo,
 * scroll). Siendo hijo directo de `<body>`, la regla de impresión en
 * `globals.css` oculta todo lo demás con un solo selector, sin importar desde
 * qué pantalla se abrió. */
export function QrPrintDialog({ products, onClose }: QrPrintDialogProps) {
  const [options, setOptions] = useState<QrLabelOptions>(defaultQrLabelOptions);

  function update<K extends keyof QrLabelOptions>(key: K, value: QrLabelOptions[K]) {
    setOptions((previous) => ({ ...previous, [key]: value }));
  }

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

  const selected = qrLabelStyles.find((item) => item.id === options.style);

  return createPortal(
    <div id="qr-print-portal">
      <div
        className="qr-print-overlay fixed inset-0 z-50 flex flex-col items-center gap-4 overflow-auto bg-forest/40 p-6 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Imprimir etiquetas QR"
      >
        <div className="qr-print-chrome flex w-full max-w-[820px] flex-col gap-4 rounded-[10px] bg-paper-light px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-display text-xl leading-[1.1] text-forest">Etiquetas QR</div>
              <div className="mt-0.5 text-[13px] text-stone">
                {products.length} {products.length === 1 ? "producto" : "productos"}
                {selected ? ` · ${selected.description}` : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
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

          <div className="flex flex-wrap items-start gap-x-7 gap-y-4 border-t border-line-light pt-4">
            <OptionField label="Estilo">
              <SegmentedControl
                options={qrLabelStyles.map((item) => ({ value: item.id, label: item.label }))}
                value={options.style}
                onChange={(value) => update("style", value)}
              />
            </OptionField>

            <OptionField label="Tamaño del QR">
              <SegmentedControl
                options={qrSizes.map((item) => ({
                  value: item.id,
                  label: `${item.label} · ${item.mm}mm`,
                }))}
                value={options.size}
                onChange={(value) => update("size", value)}
              />
            </OptionField>

            <OptionField label="Color del QR">
              <ColorSwatches value={options.color} onChange={(value) => update("color", value)} />
            </OptionField>

            <OptionField label="Descripción">
              <SegmentedControl
                options={qrDescriptions.map((item) => ({ value: item.id, label: item.label }))}
                value={options.description}
                onChange={(value) => update("description", value)}
              />
            </OptionField>
          </div>
        </div>

        {siteUrlConfigured ? null : (
          <div
            role="alert"
            className="qr-print-chrome w-full max-w-[820px] rounded-[10px] border border-terracotta/40 bg-terracotta/10 px-5 py-4 text-sm leading-[1.5] text-terracotta"
          >
            {siteUrlInvalid ? (
              <>
                El valor de <code>NEXT_PUBLIC_SITE_URL</code> no se entiende como dirección: tiene
                que ser el dominio del sitio, por ejemplo <code>https://vjaplantas.com.ar</code>.
              </>
            ) : (
              <>
                Falta configurar <code>NEXT_PUBLIC_SITE_URL</code> con el dominio del sitio.
              </>
            )}{" "}
            Sin eso los QR apuntarían a una dirección inexistente, así que la impresión queda
            bloqueada.
          </div>
        )}

        <div className="qr-print-frame w-full max-w-[820px] overflow-hidden rounded-[10px] bg-white shadow-[0_16px_40px_rgba(23,48,31,0.22)]">
          <QrLabelSheet products={products} options={options} />
        </div>
      </div>
    </div>,
    document.body,
  );
}

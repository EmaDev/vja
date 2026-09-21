"use client";

import { useEffect, useState } from "react";
import { AdminButton } from "@/components/atoms/AdminButton";
import { CloseIcon } from "@/components/atoms/icons";
import { VariantPickerCard } from "@/components/molecules/VariantPickerCard/VariantPickerCard";
import type { WireKind } from "@/components/molecules/VariantWireframe/VariantWireframe";

export interface VariantPickerOption<T extends string> {
  id: T;
  code: string;
  label: string;
  description: string;
  wireKind: WireKind;
}

export interface VariantPickerPanelProps<T extends string> {
  intro: string;
  options: VariantPickerOption<T>[];
  selected: T;
  onSelect: (id: T) => void;
  /** Renderiza la variante elegida a tamaño real, dentro del overlay de "Abrir en tamaño real". */
  renderPreview: (id: T) => React.ReactNode;
}

export function VariantPickerPanel<T extends string>({
  intro,
  options,
  selected,
  onSelect,
  renderPreview,
}: VariantPickerPanelProps<T>) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const current = options.find((option) => option.id === selected);

  useEffect(() => {
    if (!previewOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setPreviewOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [previewOpen]);

  return (
    <div className="flex flex-col gap-[26px]">
      <p className="max-w-[620px] text-base leading-[1.6] text-ink">{intro}</p>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
        {options.map((option) => (
          <VariantPickerCard
            key={option.id}
            id={option.code}
            name={option.label}
            description={option.description}
            wireKind={option.wireKind}
            active={option.id === selected}
            onSelect={() => onSelect(option.id)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-5 rounded-[10px] border border-line-light bg-[#EFE9DA] px-[22px] py-5">
        <div>
          <div className="text-[13px] uppercase tracking-[0.14em] text-taupe">Selección actual</div>
          <div className="mt-1 font-display text-2xl text-forest">
            {current ? `${current.label} · ${current.code}` : ""}
          </div>
        </div>
        <AdminButton variant="outline" onClick={() => setPreviewOpen(true)}>
          Abrir en tamaño real →
        </AdminButton>
      </div>

      {previewOpen ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-paper">
          <button
            type="button"
            onClick={() => setPreviewOpen(false)}
            aria-label="Cerrar vista previa"
            className="fixed right-6 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-forest/85 text-paper shadow-lg backdrop-blur transition-colors hover:bg-forest"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
          {renderPreview(selected)}
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { HeroSection } from "@/lib/cms/types";
import { Input, Textarea } from "lib-kit-components";
import { heroVariants, type HeroVariantId } from "@/lib/cms/hero-variants";
import { CloseIcon } from "@/components/atoms/icons";
import { ImageUploader } from "@/components/molecules/ImageUploader/ImageUploader";

interface HeroEditorProps {
  section: HeroSection;
  onChange: (section: HeroSection) => void;
}

const PREVIEW_NATIVE_WIDTH = 1440;
const PREVIEW_NATIVE_HEIGHT = 760;
const PREVIEW_BOX_WIDTH = 284;
const PREVIEW_SCALE = PREVIEW_BOX_WIDTH / PREVIEW_NATIVE_WIDTH;
const PREVIEW_BOX_HEIGHT = PREVIEW_NATIVE_HEIGHT * PREVIEW_SCALE;

export function HeroEditor({ section, onChange }: HeroEditorProps) {
  const [previewId, setPreviewId] = useState<HeroVariantId | null>(null);

  useEffect(() => {
    if (!previewId) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setPreviewId(null);
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [previewId]);

  const previewVariant = heroVariants.find((variant) => variant.id === previewId);
  const PreviewComponent = previewVariant?.Component;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-3 text-xs font-medium text-zinc-600">Estilo de hero</p>
        <div className="flex flex-wrap gap-4">
          {heroVariants.map((variant) => {
            const active = section.variant === variant.id;
            const Preview = variant.Component;
            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => {
                  onChange({ ...section, variant: variant.id });
                  setPreviewId(variant.id);
                }}
                aria-pressed={active}
                className={`flex w-75 flex-col gap-2 rounded-xl border-2 p-2 text-left transition-colors ${
                  active ? "border-primary bg-primary/5" : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div
                  className="relative overflow-hidden rounded-lg border border-zinc-200 bg-white"
                  style={{ width: PREVIEW_BOX_WIDTH, height: PREVIEW_BOX_HEIGHT }}
                >
                  <div
                    className="pointer-events-none origin-top-left"
                    style={{ width: PREVIEW_NATIVE_WIDTH, transform: `scale(${PREVIEW_SCALE})` }}
                  >
                    <Preview />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 px-1">
                  <span className={`text-sm font-medium ${active ? "text-primary" : "text-zinc-700"}`}>
                    {variant.label}
                  </span>
                  {active ? <span className="text-xs font-medium text-primary">Seleccionado</span> : null}
                </div>
                <p className="px-1 text-xs text-zinc-400">{variant.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <Input
        label="Título"
        value={section.title}
        onChange={(event) => onChange({ ...section, title: event.target.value })}
      />
      <Textarea
        label="Subtítulo"
        rows={3}
        value={section.subtitle}
        onChange={(event) => onChange({ ...section, subtitle: event.target.value })}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Texto del botón"
          value={section.ctaLabel}
          onChange={(event) => onChange({ ...section, ctaLabel: event.target.value })}
        />
        <Input
          label="Link del botón"
          value={section.ctaHref}
          onChange={(event) => onChange({ ...section, ctaHref: event.target.value })}
        />
      </div>
      <ImageUploader
        imageUrl={section.imageUrl}
        imageAlt={section.imageAlt}
        onChange={({ imageUrl, imageAlt }) => onChange({ ...section, imageUrl, imageAlt })}
      />

      {previewVariant && PreviewComponent ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
          <button
            type="button"
            onClick={() => setPreviewId(null)}
            aria-label="Cerrar vista previa"
            className="fixed right-6 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900/80 text-white shadow-lg backdrop-blur transition-colors hover:bg-zinc-900"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
          <PreviewComponent {...previewVariant.getProps(section)} />
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { useRef } from "react";
import { Button, ProgressBar } from "lib-kit-components";
import { AdminButton } from "@/components/atoms/AdminButton";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import { TextField } from "@/components/atoms/TextField";
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, TrashIcon } from "@/components/atoms/icons";
import { useImageUpload } from "@/lib/cms/use-image-upload";
import { cn } from "@/lib/utils";
import type { ProductPhoto } from "@/lib/cms/catalog-types";

export interface ProductPhotosEditorProps {
  photos: ProductPhoto[];
  onChange: (photos: ProductPhoto[]) => void;
  /** Nombre del producto: sirve de texto alternativo por defecto, para que subir
   * una foto no empiece siempre por redactar. */
  productName: string;
  max?: number;
}

const DEFAULT_MAX = 8;

function MoveButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="flex h-7 w-7 items-center justify-center rounded-md bg-paper-light/95 text-ink shadow-[0_2px_6px_rgba(23,48,31,0.15)] transition-colors hover:text-sage disabled:opacity-40 disabled:hover:text-ink"
    >
      {children}
    </button>
  );
}

/** Galería del producto: subir, reordenar y borrar fotos.
 *
 * El orden es el de la ficha y la primera hace de portada, así que se reordena
 * con flechas en vez de arrastrar: funciona con teclado y con lector de
 * pantalla, y es el mismo gesto que el resto de las listas del panel.
 *
 * La subida pasa por `useImageUpload`, que comprime antes de guardar. El estado
 * de progreso es uno solo para toda la galería porque se sube de a una foto. */
export function ProductPhotosEditor({
  photos,
  onChange,
  productName,
  max = DEFAULT_MAX,
}: ProductPhotosEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { status, progress, error, busy, upload, remove } = useImageUpload();

  async function addFile(file: File) {
    // El alt definitivo se edita abajo de cada foto; el nombre del producto es
    // un punto de partida razonable y evita que la subida falle por un alt vacío.
    const alt = productName.trim() || "Foto del producto";
    const uploaded = await upload(file, alt);
    if (!uploaded) return;

    onChange([
      ...photos,
      { id: crypto.randomUUID(), imageUrl: uploaded.imageUrl, imageAlt: alt },
    ]);
  }

  async function removePhoto(photo: ProductPhoto) {
    if (await remove(photo.imageUrl)) {
      onChange(photos.filter((item) => item.id !== photo.id));
    }
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= photos.length) return;
    const next = [...photos];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function setAlt(id: string, imageAlt: string) {
    onChange(photos.map((photo) => (photo.id === id ? { ...photo, imageAlt } : photo)));
  }

  return (
    <>
      <div className="-mt-2 mb-1 flex items-baseline justify-between gap-3">
        <span className="text-[13px] text-taupe">
          {photos.length === 0
            ? "Todavía no hay fotos"
            : `${photos.length} de ${max} · la primera es la portada`}
        </span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,190px),1fr))] gap-3">
        {photos.map((photo, index) => (
          <div key={photo.id} className="flex flex-col gap-2">
            <div
              className={cn(
                "relative h-[200px] overflow-hidden rounded-lg border-2",
                index === 0 ? "border-sage" : "border-line-light",
              )}
            >
              <ImagePlaceholder src={photo.imageUrl} alt={photo.imageAlt} />

              {index === 0 ? (
                <span className="pointer-events-none absolute left-2.5 top-2.5 rounded-full bg-sage px-2.5 py-1 text-[11px] uppercase tracking-[0.1em] text-paper">
                  Portada
                </span>
              ) : null}

              <div className="absolute right-2 top-2 flex gap-1">
                <MoveButton
                  label="Mover antes"
                  onClick={() => move(index, -1)}
                  disabled={index === 0 || busy}
                >
                  <ChevronUpIcon className="h-[15px] w-[15px]" />
                </MoveButton>
                <MoveButton
                  label="Mover después"
                  onClick={() => move(index, 1)}
                  disabled={index === photos.length - 1 || busy}
                >
                  <ChevronDownIcon className="h-[15px] w-[15px]" />
                </MoveButton>
                <Button
                  type="button"
                  size="icon"
                  variant="danger"
                  aria-label={`Eliminar foto ${index + 1}`}
                  onClick={() => removePhoto(photo)}
                  disabled={busy}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TextField
              value={photo.imageAlt}
              onChange={(event) => setAlt(photo.id, event.target.value)}
              placeholder="Texto alternativo"
              aria-label={`Texto alternativo de la foto ${index + 1}`}
              className="text-[13px]"
            />
          </div>
        ))}

        {photos.length < max ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
            className="flex h-[200px] flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#CFC6B0] bg-paper-light text-taupe transition-colors hover:border-sage hover:bg-[#F4F6F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage disabled:opacity-60"
          >
            <PlusIcon className="h-6 w-6 text-[#A09D8B]" />
            <span className="text-[13px]">{busy ? "Subiendo…" : "Agregar imagen"}</span>
          </button>
        ) : null}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void addFile(file);
        }}
      />

      {status === "uploading" ? <ProgressBar value={progress} max={100} showValue label="Subiendo…" /> : null}
      {status === "compressing" ? <p className="text-[13px] text-taupe">Comprimiendo imagen…</p> : null}
      {status === "saving" ? <p className="text-[13px] text-taupe">Guardando…</p> : null}
      {error ? <p className="text-[13px] text-terracotta">{error}</p> : null}

      <p className="text-[13px] leading-[1.5] text-taupe">
        Se reescalan y se convierten a WebP en tu computadora antes de subirse, así que podés cargar
        la foto tal como sale del celular. Con las flechas elegís cuál va de portada.
      </p>

      {photos.length >= max ? (
        <AdminButton variant="outline" disabled className="w-fit">
          Llegaste al máximo de {max} fotos
        </AdminButton>
      ) : null}
    </>
  );
}

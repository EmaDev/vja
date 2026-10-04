"use client";

import { useRef } from "react";
import { Button, ProgressBar } from "lib-kit-components";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import { TextField } from "@/components/atoms/TextField";
import { AdminButton } from "@/components/atoms/AdminButton";
import { TrashIcon } from "@/components/atoms/icons";
import { useImageUpload } from "@/lib/cms/use-image-upload";
import type { MediaFormat } from "@/lib/cms/image-compression";

interface ImageUploaderProps {
  imageUrl: string;
  imageAlt: string;
  onChange: (next: { imageUrl: string; imageAlt: string }) => void;
  /** Texto del recuadro mientras no hay foto. */
  placeholderLabel?: string;
  /** Formato con el que se guarda. El del ícono del sitio es `png`, porque se
   * vuelve a dibujar en el servidor; el resto va en `webp`. */
  format?: MediaFormat;
  /** Ayuda bajo el texto alternativo. Por defecto habla de SEO y lectores de
   * pantalla, que es para lo que se usa en las fotos de la landing. */
  altHint?: string;
  /** Miniatura cuadrada, para las imágenes que el sitio va a recortar así. */
  square?: boolean;
}

/** Campo de imagen del CMS: texto alternativo, miniatura y botón de subida.
 *
 * La subida en sí —comprimir, pedir la URL firmada, registrar el archivo— vive
 * en `useImageUpload`, que es lo que comparten todos los módulos del panel. */
export function ImageUploader({
  imageUrl,
  imageAlt,
  onChange,
  placeholderLabel = "Sin imagen",
  format = "webp",
  altHint = "Describe la imagen para lectores de pantalla y SEO. Obligatorio para subir una foto.",
  square,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { status, progress, error, busy, upload, remove } = useImageUpload({ format });

  async function handleFile(file: File) {
    const uploaded = await upload(file, imageAlt);
    if (uploaded) onChange({ imageUrl: uploaded.imageUrl, imageAlt });
  }

  async function handleRemove() {
    if (await remove(imageUrl)) onChange({ imageUrl: "", imageAlt });
  }

  /* La miniatura va al costado de los controles, no encima: apilados, cada foto
     ocupaba media pantalla de alto y las listas de imágenes —la galería, las
     cards de servicios— quedaban larguísimas.
     La decisión es por consulta de contenedor (`@container`) y no por ancho de
     pantalla: el mismo uploader se usa suelto en una tarjeta ancha y dentro de
     una celda angosta de la grilla de fotos, y ahí al lado no entra. */
  return (
    <div className="@container flex flex-col gap-3 @[26rem]:flex-row @[26rem]:items-start @[26rem]:gap-4">
      <div
        className={
          square
            ? "relative h-[124px] w-[124px] shrink-0 overflow-hidden rounded-lg border border-line-light"
            : "relative h-[132px] w-full shrink-0 overflow-hidden rounded-lg border border-line-light @[26rem]:h-[124px] @[26rem]:w-[168px]"
        }
      >
        <ImagePlaceholder src={imageUrl || undefined} alt={imageAlt} label={placeholderLabel} />
        {imageUrl ? (
          <Button
            type="button"
            size="icon"
            variant="danger"
            aria-label="Eliminar imagen"
            onClick={handleRemove}
            loading={status === "deleting"}
            disabled={busy}
            className="absolute right-2 top-2"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <TextField
          label="Texto alternativo"
          value={imageAlt}
          onChange={(event) => onChange({ imageUrl, imageAlt: event.target.value })}
        />
        <p className="text-xs leading-[1.45] text-taupe">{altHint}</p>

        {status === "uploading" ? <ProgressBar value={progress} max={100} showValue label="Subiendo…" /> : null}
        {status === "compressing" ? <p className="text-xs text-taupe">Comprimiendo imagen…</p> : null}
        {status === "saving" ? <p className="text-xs text-taupe">Guardando…</p> : null}
        {error ? <p className="text-sm text-terracotta">{error}</p> : null}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void handleFile(file);
          }}
        />
        <AdminButton
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={!imageAlt.trim() || busy}
          className="w-fit"
        >
          {imageUrl ? "Cambiar imagen" : "Subir imagen"}
        </AdminButton>
      </div>
    </div>
  );
}

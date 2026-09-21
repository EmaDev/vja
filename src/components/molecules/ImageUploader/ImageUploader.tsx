"use client";

import { useRef, useState } from "react";
import { Button, ProgressBar } from "lib-kit-components";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import { TextField } from "@/components/atoms/TextField";
import { AdminButton } from "@/components/atoms/AdminButton";
import { TrashIcon } from "@/components/atoms/icons";
import { deleteMediaAction, saveMediaAction } from "@/lib/cms/media-actions";

const MAX_SOURCE_BYTES = 20 * 1024 * 1024; // 20 MB — generosa para una foto de celular sin comprimir
const MAX_DIMENSION = 2000;
const WEBP_QUALITY = 0.82;
const BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

type Status = "idle" | "compressing" | "uploading" | "saving" | "deleting" | "error";

interface ImageUploaderProps {
  imageUrl: string;
  imageAlt: string;
  onChange: (next: { imageUrl: string; imageAlt: string }) => void;
}

function storagePathFromPublicUrl(url: string): string | null {
  const prefix = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/`;
  if (!url.startsWith(prefix)) return null;

  const encodedPath = url.slice(prefix.length).split("?")[0];
  try {
    return decodeURIComponent(encodedPath);
  } catch {
    return null;
  }
}

async function compressToWebp(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const longSide = Math.max(bitmap.width, bitmap.height);
  const scale = Math.min(1, MAX_DIMENSION / longSide);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", WEBP_QUALITY));
  if (!blob) throw new Error("No se pudo convertir la imagen a WebP.");

  return { blob, width, height };
}

function uploadWithProgress(url: string, blob: Blob, onProgress: (pct: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", "image/webp");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error("La subida a Storage falló."));
    };
    xhr.onerror = () => reject(new Error("La subida a Storage falló."));
    xhr.send(blob);
  });
}

export function ImageUploader({ imageUrl, imageAlt, onChange }: ImageUploaderProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const busy = status === "compressing" || status === "uploading" || status === "saving" || status === "deleting";

  async function handleFile(file: File) {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Elegí un archivo de imagen.");
      return;
    }
    if (file.size > MAX_SOURCE_BYTES) {
      setError("La imagen pesa más de 20 MB.");
      return;
    }

    try {
      setStatus("compressing");
      const { blob, width, height } = await compressToWebp(file);

      setStatus("uploading");
      setProgress(0);
      const response = await fetch("/api/media/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: "image/webp" }),
      });
      if (!response.ok) throw new Error("No se pudo iniciar la subida.");

      const { mediaId, storagePath, uploadUrl, publicUrl } = (await response.json()) as {
        mediaId: string;
        storagePath: string;
        uploadUrl: string;
        publicUrl: string;
      };

      await uploadWithProgress(uploadUrl, blob, setProgress);

      setStatus("saving");
      const result = await saveMediaAction({
        mediaId,
        storagePath,
        publicUrl,
        alt: imageAlt,
        width,
        height,
        bytes: blob.size,
      });
      if (!result.ok) throw new Error(result.error);

      onChange({ imageUrl: publicUrl, imageAlt });
      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen.");
      setStatus("error");
    }
  }

  async function handleRemove() {
    const storagePath = storagePathFromPublicUrl(imageUrl);
    if (!storagePath) {
      onChange({ imageUrl: "", imageAlt });
      return;
    }

    setError(null);
    setStatus("deleting");
    const result = await deleteMediaAction(storagePath);
    if (!result.ok) {
      setError(result.error);
      setStatus("error");
      return;
    }

    onChange({ imageUrl: "", imageAlt });
    setStatus("idle");
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-[7px]">
        <TextField
          label="Texto alternativo"
          value={imageAlt}
          onChange={(event) => onChange({ imageUrl, imageAlt: event.target.value })}
        />
        <p className="text-xs text-taupe">
          Describe la imagen para lectores de pantalla y SEO. Obligatorio para subir una foto.
        </p>
      </div>

      <div className="relative h-40 w-full overflow-hidden rounded-lg border border-line-light">
        <ImagePlaceholder src={imageUrl || undefined} alt={imageAlt} label="Sin imagen" />
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
  );
}

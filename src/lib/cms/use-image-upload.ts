"use client";

import { useCallback, useState } from "react";
import {
  compressToSquarePng,
  compressToWebp,
  ImageCompressionError,
  MEDIA_CONTENT_TYPE,
  type MediaFormat,
} from "./image-compression";
import { deleteMediaAction, saveMediaAction } from "./media-actions";

export type ImageUploadStatus =
  | "idle"
  | "compressing"
  | "uploading"
  | "saving"
  | "deleting"
  | "error";

export interface UploadedImage {
  imageUrl: string;
  width: number;
  height: number;
  /** Peso final, ya comprimido. */
  bytes: number;
  /** Peso del archivo que eligió el usuario, antes de comprimir. */
  sourceBytes: number;
}

const BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

/** La ruta dentro del bucket que corresponde a una URL pública nuestra.
 *
 * Devuelve `null` para cualquier otra cosa —una URL pegada a mano, una imagen de
 * otro dominio—, y entonces el borrado se limita a soltar la referencia en vez
 * de pedirle a Storage que borre un archivo que no es suyo. */
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

function putWithProgress(
  url: string,
  blob: Blob,
  contentType: string,
  onProgress: (pct: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    // El mismo tipo con el que se firmó la URL: Storage rechaza la subida si el
    // encabezado no coincide con lo que se pidió.
    xhr.setRequestHeader("Content-Type", contentType);
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

export interface UseImageUploadOptions {
  /** En qué formato se guarda la imagen. `webp` —el de las fotos del sitio—
   * pesa la mitad; `png` es para el ícono del sitio, que además se recorta al
   * cuadrado. Ver `image-compression.ts`. */
  format?: MediaFormat;
}

export interface UseImageUpload {
  status: ImageUploadStatus;
  /** Porcentaje de la subida en curso, 0–100. */
  progress: number;
  error: string | null;
  /** Hay una operación en curso: quien lo use debería deshabilitar sus botones. */
  busy: boolean;
  /** Comprime, sube y registra la imagen. Devuelve `null` si algo falló, y en ese
   * caso `error` explica qué pasó. */
  upload: (file: File, alt: string) => Promise<UploadedImage | null>;
  /** Borra el archivo de Storage y su registro. Devuelve `true` si quien llama
   * puede soltar la referencia, incluso cuando el archivo no era nuestro. */
  remove: (imageUrl: string) => Promise<boolean>;
  clearError: () => void;
}

/** Subida de imágenes del CMS, de punta a punta: comprimir, pedir la URL
 * firmada, subir con progreso y registrar el archivo en `media/`.
 *
 * La compresión es un paso del hook y no una decisión de cada formulario: así
 * ningún módulo puede guardar la foto sin pasar por acá, que es justamente el
 * problema cuando cada pantalla arma su propia subida. Todos los módulos del
 * panel —secciones, productos, categorías, promociones— lo usan.
 *
 * El alta es en dos tiempos: primero el archivo va a Storage con una URL firmada
 * (no pasa por el servidor, que no tiene que bancarse varios MB por request) y
 * recién después una Server Action escribe el documento en `media/`. */
export function useImageUpload({ format = "webp" }: UseImageUploadOptions = {}): UseImageUpload {
  const [status, setStatus] = useState<ImageUploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const upload = useCallback(
    async (file: File, alt: string): Promise<UploadedImage | null> => {
      setError(null);

      // El texto alternativo se exige acá y no sólo en el botón: es lo que
      // valida el servidor al registrar el archivo, y sin él la subida ya se
      // hizo pero el registro falla.
      if (!alt.trim()) {
        setError("Escribí el texto alternativo antes de subir la imagen.");
        setStatus("error");
        return null;
      }

      const contentType = MEDIA_CONTENT_TYPE[format];

      try {
        setStatus("compressing");
        const { blob, width, height, sourceBytes } =
          format === "png" ? await compressToSquarePng(file) : await compressToWebp(file);

        setStatus("uploading");
        setProgress(0);
        const response = await fetch("/api/media/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contentType }),
        });
        if (!response.ok) throw new Error("No se pudo iniciar la subida.");

        const { mediaId, storagePath, uploadUrl, publicUrl } = (await response.json()) as {
          mediaId: string;
          storagePath: string;
          uploadUrl: string;
          publicUrl: string;
        };

        await putWithProgress(uploadUrl, blob, contentType, setProgress);

        setStatus("saving");
        const result = await saveMediaAction({
          mediaId,
          storagePath,
          publicUrl,
          alt,
          width,
          height,
          bytes: blob.size,
        });
        if (!result.ok) throw new Error(result.error);

        setStatus("idle");
        return { imageUrl: publicUrl, width, height, bytes: blob.size, sourceBytes };
      } catch (err) {
        const message =
          err instanceof ImageCompressionError || err instanceof Error
            ? err.message
            : "No se pudo subir la imagen.";
        setError(message);
        setStatus("error");
        return null;
      }
    },
    [format],
  );

  const remove = useCallback(
    async (imageUrl: string): Promise<boolean> => {
      setError(null);

      const storagePath = storagePathFromPublicUrl(imageUrl);
      if (!storagePath) return true;

      setStatus("deleting");
      const result = await deleteMediaAction(storagePath);
      if (!result.ok) {
        setError(result.error);
        setStatus("error");
        return false;
      }

      setStatus("idle");
      return true;
    },
    [],
  );

  return {
    status,
    progress,
    error,
    busy: status === "compressing" || status === "uploading" || status === "saving" || status === "deleting",
    upload,
    remove,
    clearError,
  };
}

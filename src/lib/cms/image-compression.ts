/** Compresión de imágenes en el navegador, antes de subirlas.
 *
 * Una foto de celular pesa varios MB y mide 4000 px de lado. Subirla tal cual
 * gasta el plan de Storage, tarda en el ancho de banda del local y después
 * obliga al visitante a descargar eso mismo. Se reescala y se pasa a WebP acá,
 * en la máquina de quien la carga: al bucket nunca llega el original. */

/** Tope del archivo de entrada. Generoso a propósito: es una foto de celular sin
 * comprimir, y el recorte real lo hace la conversión. */
export const MAX_SOURCE_BYTES = 20 * 1024 * 1024;

/** Lado más largo después de reescalar. Alcanza para una foto a pantalla
 * completa en una pantalla retina sin guardar el doble de píxeles. */
export const MAX_DIMENSION = 2000;

export const WEBP_QUALITY = 0.82;

export interface CompressedImage {
  blob: Blob;
  width: number;
  height: number;
  /** Tamaño del archivo original, para poder contar cuánto se ahorró. */
  sourceBytes: number;
}

/** Error con un mensaje que se le puede mostrar tal cual a quien está cargando
 * la foto, en vez de un detalle técnico del canvas. */
export class ImageCompressionError extends Error {}

/** Reescala a `MAX_DIMENSION` y convierte a WebP.
 *
 * `createImageBitmap` con `imageOrientation: "from-image"` aplica la rotación
 * EXIF: sin eso, una foto sacada en vertical con el celular se sube acostada,
 * porque el canvas ignora ese metadato. */
export async function compressToWebp(file: File): Promise<CompressedImage> {
  if (!file.type.startsWith("image/")) {
    throw new ImageCompressionError("Elegí un archivo de imagen.");
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new ImageCompressionError(
      `La imagen pesa más de ${Math.round(MAX_SOURCE_BYTES / 1024 / 1024)} MB.`,
    );
  }

  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const longSide = Math.max(bitmap.width, bitmap.height);
  // `min(1, …)`: una foto más chica que el tope se deja como está en vez de
  // agrandarse, que sólo sumaría peso sin sumar detalle.
  const scale = Math.min(1, MAX_DIMENSION / longSide);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new ImageCompressionError("No se pudo procesar la imagen.");
  }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", WEBP_QUALITY),
  );
  if (!blob) throw new ImageCompressionError("No se pudo convertir la imagen a WebP.");

  return { blob, width, height, sourceBytes: file.size };
}

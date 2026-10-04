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

/** Lado del ícono del sitio. 192 px es múltiplo de 48 —la medida que pide
 * Google para el redondelito del resultado— y es también el tamaño que usa
 * Android cuando alguien agrega el sitio a la pantalla de inicio. */
export const ICON_DIMENSION = 192;

/** Los dos formatos que acepta el bucket. El resto de las imágenes del panel va
 * en WebP, que pesa la mitad; el ícono del sitio va en PNG porque se termina de
 * dibujar dentro de `ImageResponse` y Satori no sabe leer WebP (ver
 * `lib/seo/remote-image.ts`). */
export type MediaFormat = "webp" | "png";

export const MEDIA_CONTENT_TYPE: Record<MediaFormat, string> = {
  webp: "image/webp",
  png: "image/png",
};

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

/** Valida el archivo y lo decodifica.
 *
 * `imageOrientation: "from-image"` aplica la rotación EXIF: sin eso, una foto
 * sacada en vertical con el celular se sube acostada, porque el canvas ignora
 * ese metadato. */
async function readBitmap(file: File): Promise<ImageBitmap> {
  if (!file.type.startsWith("image/")) {
    throw new ImageCompressionError("Elegí un archivo de imagen.");
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new ImageCompressionError(
      `La imagen pesa más de ${Math.round(MAX_SOURCE_BYTES / 1024 / 1024)} MB.`,
    );
  }

  return createImageBitmap(file, { imageOrientation: "from-image" });
}

function newCanvas(width: number, height: number): CanvasRenderingContext2D {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new ImageCompressionError("No se pudo procesar la imagen.");
  return context;
}

async function encode(
  canvas: HTMLCanvasElement,
  format: MediaFormat,
  quality?: number,
): Promise<Blob> {
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, MEDIA_CONTENT_TYPE[format], quality),
  );
  if (!blob) {
    throw new ImageCompressionError(`No se pudo convertir la imagen a ${format.toUpperCase()}.`);
  }
  return blob;
}

/** Reescala a `MAX_DIMENSION` y convierte a WebP. */
export async function compressToWebp(file: File): Promise<CompressedImage> {
  const bitmap = await readBitmap(file);
  const longSide = Math.max(bitmap.width, bitmap.height);
  // `min(1, …)`: una foto más chica que el tope se deja como está en vez de
  // agrandarse, que sólo sumaría peso sin sumar detalle.
  const scale = Math.min(1, MAX_DIMENSION / longSide);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const context = newCanvas(width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await encode(context.canvas, "webp", WEBP_QUALITY);
  return { blob, width, height, sourceBytes: file.size };
}

/** Recorta al cuadrado y convierte a PNG, para el ícono del sitio.
 *
 * Recorta en vez de deformar: el ícono se dibuja siempre en un cuadrado, y
 * estirar un logo horizontal para que entre lo deja irreconocible. Se toma el
 * cuadrado del centro, que es donde está la marca en cualquier logo.
 *
 * A diferencia de las fotos, acá sí se agranda una imagen más chica que el
 * tope: el ícono se declara de un tamaño fijo en el `<link>` del HTML, así que
 * tiene que medir lo que dice medir. */
export async function compressToSquarePng(
  file: File,
  side: number = ICON_DIMENSION,
): Promise<CompressedImage> {
  const bitmap = await readBitmap(file);
  const crop = Math.min(bitmap.width, bitmap.height);
  const left = (bitmap.width - crop) / 2;
  const top = (bitmap.height - crop) / 2;

  const context = newCanvas(side, side);
  context.drawImage(bitmap, left, top, crop, crop, 0, 0, side, side);
  bitmap.close();

  const blob = await encode(context.canvas, "png");
  return { blob, width: side, height: side, sourceBytes: file.size };
}

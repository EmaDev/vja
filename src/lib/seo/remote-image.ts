import "server-only";

/** Baja una imagen del bucket y la devuelve como `data:` URI, o `undefined` si
 * no se puede usar.
 *
 * Se baja en vez de pasarle la URL al `<img>` para que un error de red no tire
 * la ruta: estas imágenes se generan en el build de páginas estáticas, así que
 * una foto que no responde rompería el deploy entero. Quien llama cae en su
 * versión sin imagen.
 *
 * Satori —el motor de `ImageResponse`— sólo entiende PNG, APNG, JPEG, GIF y
 * SVG. WebP, que es a lo que el panel convierte todas las fotos, no está en esa
 * lista y hace fallar el render con "Unsupported image type". De ahí las dos
 * decisiones del proyecto alrededor de esto: el ícono del sitio se sube en PNG
 * (ver `cms/image-compression.ts`), y acá se descarta cualquier tipo que no se
 * pueda dibujar, para que una foto en un formato inesperado degrade la tarjeta
 * en vez de devolver un 500. */
const SATORI_IMAGE_TYPES = new Set([
  "image/png",
  "image/apng",
  "image/jpeg",
  "image/gif",
  "image/svg+xml",
]);

export async function toDataUri(url: string): Promise<string | undefined> {
  if (!url) return undefined;

  try {
    const response = await fetch(url);
    if (!response.ok) return undefined;

    const type = response.headers.get("content-type")?.split(";")[0].trim() ?? "image/jpeg";
    if (!SATORI_IMAGE_TYPES.has(type)) return undefined;

    const base64 = Buffer.from(await response.arrayBuffer()).toString("base64");
    return `data:${type};base64,${base64}`;
  } catch {
    return undefined;
  }
}

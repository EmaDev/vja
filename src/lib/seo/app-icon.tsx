import { ImageResponse } from "next/og";
import { iconColor, iconLetter, DEFAULT_ICON_BACKGROUND, DEFAULT_ICON_FOREGROUND } from "@/lib/cms/favicon";
import { loadPublished, pickSection } from "@/lib/cms/published";
import { toDataUri } from "./remote-image";
import { siteName } from "./metadata";

/** El ícono del sitio, dibujado una sola vez para las dos rutas que lo sirven:
 * `app/icon.tsx` (la pestaña y el resultado de Google) y `app/apple-icon.tsx`
 * (el "Agregar a inicio" de iOS). Lo único que cambia entre ellas es el lado
 * del cuadrado, que cada ruta declara en su `size` y pasa acá.
 *
 * Lo que se dibuja sale de "Ícono del sitio" en el panel: la imagen que cargó
 * el cliente o, si no cargó ninguna, su inicial sobre un color. Nunca queda sin
 * ícono, que es cuando el navegador dibuja una hoja en blanco y Google un globo
 * gris.
 *
 * Las dos rutas siguen siendo estáticas: el contenido se lee con la caché
 * etiquetada de `getPublishedCached`, así que el ícono se regenera al publicar
 * —`publishAction` invalida la etiqueta— y no en cada visita. */
export async function renderAppIcon(side: number): Promise<ImageResponse> {
  const sections = await loadPublished();
  const favicon = pickSection(sections, "favicon");

  const uploaded = await toDataUri(favicon?.imageUrl?.trim() ?? "");
  const size = { width: side, height: side };

  if (uploaded) {
    return new ImageResponse(
      (
        /* eslint-disable-next-line @next/next/no-img-element -- Satori sólo
           entiende <img>; `next/image` no corre dentro de `ImageResponse`. */
        <img
          src={uploaded}
          alt=""
          width={side}
          height={side}
          // El PNG se sube cuadrado (ver `cms/image-compression.ts`), así que
          // `cover` acá no recorta nada: está para que un archivo cargado antes
          // de esa regla tampoco salga deformado.
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ),
      size,
    );
  }

  const letter = iconLetter(favicon?.letter ?? "", siteName(sections));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: iconColor(favicon?.background ?? "", DEFAULT_ICON_BACKGROUND),
          color: iconColor(favicon?.foreground ?? "", DEFAULT_ICON_FOREGROUND),
          // Dos letras tienen que entrar a lo ancho; una sola se dibuja tan
          // grande como el cuadrado la aguante, porque a 48 px cada píxel que
          // sobra es legibilidad.
          fontSize: Math.round(side * (letter.length > 1 ? 0.46 : 0.7)),
          fontWeight: 600,
          lineHeight: 1,
          // Compensa el hueco que una letra como la V deja abajo y la centra a
          // la vista, no al alto de la caja.
          paddingBottom: Math.round(side * 0.04),
        }}
      >
        {letter}
      </div>
    ),
    size,
  );
}

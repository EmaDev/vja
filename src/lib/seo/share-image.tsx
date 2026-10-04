import { ImageResponse } from "next/og";
import { productCover } from "@/lib/cms/catalog-types";
import type { Product } from "@/lib/cms/catalog-types";
import { loadPublished, pickSection } from "@/lib/cms/published";
import { toDataUri } from "./remote-image";
import { siteName } from "./metadata";

/** La imagen que se ve cuando alguien pega un link del sitio en WhatsApp, en
 * una historia de Instagram o en un chat.
 *
 * Es el único lugar donde se decide esa imagen. Las páginas no declaran
 * `openGraph.images`: Next toma esta ruta por convención de archivo y completa
 * `og:image` y `twitter:image` con ella, siempre a 1200×630, que es la medida
 * que las tres plataformas recortan sin cortar nada.
 *
 * Cuando el cliente cargó una foto en "SEO y social", es esa foto la que se ve,
 * con el título encima. Cuando no, la tarjeta tipográfica: siempre sale algo
 * del vivero y nunca el rectángulo gris de "sin vista previa".
 *
 * Sobre la tipografía: acá se usa la fuente que trae `next/og`, no la del
 * sitio. Cargar Instrument Serif pediría tener el `.ttf` en el repo y leerlo en
 * cada render; se puede hacer más adelante dejando el archivo en `assets/` y
 * pasándolo por la opción `fonts`. */

export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 };
export const SHARE_IMAGE_CONTENT_TYPE = "image/png";

/** `alt` de la convención de archivo tiene que ser una constante del módulo, así
 * que no puede salir del CMS. Describe la tarjeta, que es lo que siempre hay. */
export const SHARE_IMAGE_ALT = "Vivero VJA Plantas";

const FOREST = "#17301f";
const PAPER = "#f6f1e7";
const LEAF = "#6fa06a";
const SAND = "#e4dcc8";

/** Marca del vivero, arriba a la izquierda. Es lo que hace reconocible la
 * tarjeta cuando pasa por un chat sin que nadie lea el título. */
function Wordmark({ name, tone }: { name: string; tone: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontSize: 24,
        letterSpacing: 4,
        textTransform: "uppercase",
        color: tone,
      }}
    >
      <div style={{ width: 44, height: 2, background: LEAF }} />
      {name}
    </div>
  );
}

/** Tarjeta sobre la foto que cargó el cliente.
 *
 * El degradado no es decorativo: sin él, un título claro sobre una foto clara
 * no se lee, y no hay manera de saber de antemano qué foto va a subir. */
function PhotoCard({
  image,
  name,
  title,
}: {
  image: string;
  name: string;
  title: string;
}) {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%", position: "relative" }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Satori sólo
          entiende <img>; `next/image` no corre dentro de `ImageResponse`. */}
      <img
        src={image}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, rgba(23,48,31,0.35) 0%, rgba(23,48,31,0.15) 40%, rgba(23,48,31,0.92) 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 68,
        }}
      >
        <Wordmark name={name} tone={PAPER} />
        <div
          style={{
            display: "flex",
            fontSize: 72,
            lineHeight: 1.05,
            color: PAPER,
            maxWidth: 940,
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}

/** Tarjeta tipográfica, para cuando no hay foto cargada. */
function TextCard({
  name,
  title,
  description,
}: {
  name: string;
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 68,
        background: PAPER,
      }}
    >
      <Wordmark name={name} tone={FOREST} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 76, lineHeight: 1.04, color: FOREST }}>
          {title}
        </div>
        {description ? (
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 30,
              lineHeight: 1.4,
              color: "#4b4b41",
              maxWidth: 880,
            }}
          >
            {description}
          </div>
        ) : null}
      </div>
      <div style={{ display: "flex", height: 8, background: SAND }} />
    </div>
  );
}

/** Tarjeta del sitio: portada, catálogo y cualquier ruta que no tenga una
 * propia. */
export async function renderSiteShareImage(): Promise<ImageResponse> {
  const sections = await loadPublished();
  const seo = pickSection(sections, "seo");
  const name = siteName(sections);

  const title = seo?.metaTitle?.trim() || name;
  const description = seo?.metaDescription?.trim() ?? "";
  const photo = await toDataUri(seo?.shareImageUrl?.trim() ?? "");

  return new ImageResponse(
    photo ? (
      <PhotoCard image={photo} name={name} title={title} />
    ) : (
      <TextCard name={name} title={title} description={description} />
    ),
    SHARE_IMAGE_SIZE,
  );
}

/** Tarjeta de una planta: su propia foto y su nombre.
 *
 * Es la que más se comparte —un link de ficha mandado por WhatsApp— y la que
 * más gana con tener la foto real en lugar de la genérica del vivero. */
export async function renderProductShareImage(product: Product): Promise<ImageResponse> {
  const sections = await loadPublished();
  const name = siteName(sections);
  const photo = await toDataUri(productCover(product)?.imageUrl ?? "");

  return new ImageResponse(
    photo ? (
      <PhotoCard image={photo} name={name} title={product.name} />
    ) : (
      <TextCard
        name={name}
        title={product.name}
        description={product.latin.trim() || product.short.trim()}
      />
    ),
    SHARE_IMAGE_SIZE,
  );
}

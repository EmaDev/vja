import type { Metadata } from "next";
import { JsonLd } from "@/components/atoms/JsonLd";
import { PromoPopup } from "@/components/organisms/PromoPopup/PromoPopup";
import { SiteChrome } from "@/components/organisms/SiteChrome/SiteChrome";
import { WhatsAppButton } from "@/components/organisms/WhatsAppButton/WhatsAppButton";
import { loadPublished, pickSection } from "@/lib/cms/published";
import { loadLivePromotions } from "@/lib/cms/promo-repository";
import { loadLiveProducts } from "@/lib/cms/catalog-repository";
import { heroTone } from "@/lib/cms/hero-variants";
import { renderSection, type RenderContext } from "@/lib/cms/renderers";
import { publicMetadata, siteName } from "@/lib/seo/metadata";
import { siteGraph } from "@/lib/seo/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const sections = await loadPublished();
  const seo = pickSection(sections, "seo");
  const name = siteName(sections);

  return publicMetadata({
    sections,
    // El título que cargó el cliente va tal cual, sin sufijo: en la portada ya
    // es el nombre del vivero lo que se quiere leer primero en Google.
    title: seo?.metaTitle?.trim() || name,
    description: seo?.metaDescription?.trim() ?? "",
    canonical: "/",
  });
}

/** Mientras no se publique nada desde el CMS, `getPublished()` devuelve un array
 * vacío. Mejor una portada sobria que un error de build. */
function EmptyState() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-6 text-center">
      <h1 className="font-display text-[44px] leading-[1.05] text-forest sm:text-[60px]">
        Estamos preparando el sitio
      </h1>
      <p className="max-w-[420px] text-base leading-[1.6] text-ink">
        En breve vas a poder ver acá el catálogo completo del vivero.
      </p>
    </main>
  );
}

export default async function HomePage() {
  const [sections, promotions] = await Promise.all([loadPublished(), loadLivePromotions()]);
  if (sections.length === 0) return <EmptyState />;

  const header = pickSection(sections, "header");
  const hero = pickSection(sections, "hero");
  const footer = pickSection(sections, "footer");
  const contact = pickSection(sections, "contact");

  // La card “Favorita” del hero editorial muestra la planta elegida en el panel.
  // Se resuelve contra el catálogo publicado —la misma lectura cacheada que usa
  // la grilla— así que una planta despublicada o borrada deja el hero sin card.
  const featuredProduct = hero?.featuredProductId
    ? (await loadLiveProducts()).find((product) => product.id === hero.featuredProductId)
    : undefined;

  // “Verificá tu zona” se dibuja como segunda columna de “Visitanos”: las dos
  // contestan lo mismo —cómo llegar al local, o cómo llega lo que comprás— y
  // juntas llenan el ancho que antes quedaba vacío cuando no hay mapa cargado.
  // Si alguna de las dos está apagada en el CMS, envíos vuelve a su propia franja.
  const visit = pickSection(sections, "visit");
  const shipping = pickSection(sections, "shipping");
  const pairShipping = Boolean(visit?.visible && shipping?.visible);

  const context: RenderContext = {
    contact,
    featuredProduct,
    shipping: pairShipping ? shipping : undefined,
  };

  // Las secciones apagadas no entran al JSON-LD: declarar la zona de reparto
  // cuando la franja de envíos está oculta sería afirmarle a Google algo que no
  // está en la página, y eso lo lee como dato inflado.
  const businessGraph = siteGraph({
    header,
    contact,
    footer,
    seo: pickSection(sections, "seo"),
    visit: visit?.visible ? visit : undefined,
    shipping: shipping?.visible ? shipping : undefined,
  });
  // El header envuelve la página y el footer va fuera del `<main>`; el resto se
  // dibuja en el orden en que quedaron guardadas las secciones.
  const body = sections.filter(
    (section) =>
      section.kind !== "header" &&
      section.kind !== "footer" &&
      section.kind !== "seo" &&
      !(pairShipping && section.kind === "shipping"),
  );

  const content = (
    <>
      {/* El vivero como negocio físico: dirección, teléfono, horarios y zona de
          reparto, todo tomado de lo que el cliente cargó en el panel. Es lo que
          Google necesita para mostrarlo como local y no como una web más. Va
          una sola vez, en la portada: las demás páginas lo referencian por su
          `@id`. */}
      <JsonLd data={businessGraph} />
      <main className="min-w-0">
        {body.map((section) => (
          <div key={section.id}>{renderSection(section, context)}</div>
        ))}
      </main>
      {footer ? renderSection(footer, context) : null}
      {/* Flota sobre toda la página, así que va fuera del `<main>` y del registro
          de secciones: no ocupa un lugar en el flujo del documento. */}
      {contact ? <WhatsAppButton section={contact} /> : null}
      {/* Llegan todas las publicadas y el propio popup decide cuál corre hoy: la
          landing está cacheada y no puede resolver el calendario por su cuenta. */}
      {promotions.length > 0 ? <PromoPopup promotions={promotions} /> : null}
    </>
  );

  if (!header) return content;

  return (
    <SiteChrome
      header={header}
      contact={contact}
      heroTone={hero ? heroTone[hero.variant] : "light"}
    >
      {content}
    </SiteChrome>
  );
}

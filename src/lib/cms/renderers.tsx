import type { ReactNode } from "react";
import { AboutBlock } from "@/components/organisms/AboutBlock/AboutBlock";
import { CareNotes } from "@/components/organisms/CareNotes/CareNotes";
import { ContactBlock } from "@/components/organisms/ContactBlock/ContactBlock";
import { FaqBlock } from "@/components/organisms/FaqBlock/FaqBlock";
import { GalleryGrid } from "@/components/organisms/GalleryGrid/GalleryGrid";
import { ProductCatalog } from "@/components/organisms/ProductCatalog/ProductCatalog";
import { ServicesGrid } from "@/components/organisms/ServicesGrid/ServicesGrid";
import { ShippingChecker } from "@/components/organisms/ShippingChecker/ShippingChecker";
import { SiteFooter } from "@/components/organisms/SiteFooter/SiteFooter";
import { VisitBlock } from "@/components/organisms/VisitBlock/VisitBlock";
import { heroVariants } from "./hero-variants";
import type {
  AboutSection,
  CardsSection,
  CareSection,
  CmsSection,
  ContactSection,
  FaqSection,
  FooterSection,
  GallerySection,
  HeroSection,
  ServicesSection,
  ShippingSection,
  VisitSection,
} from "./types";

/** Lo que una sección necesita saber del resto de la página. El footer, por
 * ejemplo, no guarda casilla de correo propia y usa la de contacto. */
export interface RenderContext {
  contact?: ContactSection;
}

type SectionRenderer<S extends CmsSection> = (section: S, context: RenderContext) => ReactNode;

/** El número al que escriben los bloques que ofrecen consultar algo. Devuelve
 * `""` si el botón de WhatsApp está apagado, y entonces cada sección decide no
 * mostrar su enlace en vez de abrir una conversación que el local no mira. */
function whatsappPhone(context: RenderContext): string {
  const { contact } = context;
  return contact?.whatsappEnabled ? contact.whatsappPhone : "";
}

function renderHero(section: HeroSection): ReactNode {
  const variant = heroVariants.find((candidate) => candidate.id === section.variant);
  if (!variant) return null;

  const { Component } = variant;
  // `showHeader={false}`: el header lo monta `SiteChrome` con la variante elegida
  // en el CMS, que no tiene por qué ser la que trae el mockup de este hero.
  return <Component {...variant.getProps(section)} showHeader={false} />;
}

function renderAbout(section: AboutSection): ReactNode {
  return <AboutBlock section={section} />;
}

function renderCards(section: CardsSection): ReactNode {
  return <ProductCatalog variant={section.variant} />;
}

function renderServices(section: ServicesSection, context: RenderContext): ReactNode {
  return <ServicesGrid section={section} contact={context.contact} />;
}

function renderGallery(section: GallerySection): ReactNode {
  return <GalleryGrid section={section} />;
}

function renderCare(section: CareSection): ReactNode {
  return <CareNotes section={section} />;
}

function renderVisit(section: VisitSection, context: RenderContext): ReactNode {
  return <VisitBlock section={section} contact={context.contact} />;
}

function renderShipping(section: ShippingSection, context: RenderContext): ReactNode {
  return <ShippingChecker section={section} whatsappPhone={whatsappPhone(context)} />;
}

function renderFaq(section: FaqSection, context: RenderContext): ReactNode {
  return <FaqBlock section={section} whatsappPhone={whatsappPhone(context)} />;
}

function renderContact(section: ContactSection): ReactNode {
  return <ContactBlock section={section} />;
}

function renderFooter(section: FooterSection, context: RenderContext): ReactNode {
  return <SiteFooter section={section} contact={context.contact} />;
}

/** Registro `kind → componente`, gemelo del registro de editores del CMS.
 *
 * `header` y `seo` devuelven `null` a propósito: el header envuelve a toda la
 * página (lo resuelve `SiteChrome`) y el SEO alimenta `generateMetadata`, no el
 * árbol visible. Quedan en el mapa igual para que agregar un `kind` nuevo a
 * `CmsSection` rompa la compilación acá hasta que se decida cómo se dibuja. */
const sectionRenderers: { [K in CmsSection["kind"]]: SectionRenderer<Extract<CmsSection, { kind: K }>> } = {
  header: () => null,
  hero: renderHero,
  about: renderAbout,
  cards: renderCards,
  services: renderServices,
  gallery: renderGallery,
  care: renderCare,
  visit: renderVisit,
  shipping: renderShipping,
  faq: renderFaq,
  contact: renderContact,
  footer: renderFooter,
  seo: () => null,
};

/** Las secciones que el cliente puede apagar desde el CMS. Una sección sin este
 * campo —el hero, el catálogo, el contacto— siempre se dibuja. */
function isHidden(section: CmsSection): boolean {
  return "visible" in section && !section.visible;
}

/** Dibuja una sección publicada. Devuelve `null` si el `kind` no tiene renderer,
 * para que una sección vieja o incompleta no tire abajo la landing entera. */
export function renderSection(section: CmsSection, context: RenderContext): ReactNode {
  if (isHidden(section)) return null;

  const renderer = sectionRenderers[section.kind] as SectionRenderer<CmsSection> | undefined;
  if (!renderer) return null;
  return renderer(section, context);
}

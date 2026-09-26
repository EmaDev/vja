import type { ReactNode } from "react";
import { ContactBlock } from "@/components/organisms/ContactBlock/ContactBlock";
import { ProductCatalog } from "@/components/organisms/ProductCatalog/ProductCatalog";
import { SiteFooter } from "@/components/organisms/SiteFooter/SiteFooter";
import { heroVariants } from "./hero-variants";
import type {
  CardsSection,
  CmsSection,
  ContactSection,
  FooterSection,
  HeroSection,
} from "./types";

/** Lo que una sección necesita saber del resto de la página. El footer, por
 * ejemplo, no guarda casilla de correo propia y usa la de contacto. */
export interface RenderContext {
  contact?: ContactSection;
}

type SectionRenderer<S extends CmsSection> = (section: S, context: RenderContext) => ReactNode;

function renderHero(section: HeroSection): ReactNode {
  const variant = heroVariants.find((candidate) => candidate.id === section.variant);
  if (!variant) return null;

  const { Component } = variant;
  // `showHeader={false}`: el header lo monta `SiteChrome` con la variante elegida
  // en el CMS, que no tiene por qué ser la que trae el mockup de este hero.
  return <Component {...variant.getProps(section)} showHeader={false} />;
}

function renderCards(section: CardsSection): ReactNode {
  return <ProductCatalog variant={section.variant} />;
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
  cards: renderCards,
  contact: renderContact,
  footer: renderFooter,
  seo: () => null,
};

/** Dibuja una sección publicada. Devuelve `null` si el `kind` no tiene renderer,
 * para que una sección vieja o incompleta no tire abajo la landing entera. */
export function renderSection(section: CmsSection, context: RenderContext): ReactNode {
  const renderer = sectionRenderers[section.kind] as SectionRenderer<CmsSection> | undefined;
  if (!renderer) return null;
  return renderer(section, context);
}

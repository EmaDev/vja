import type { HeroVariantId } from "./hero-variants";
import type { HeaderVariantId } from "./header-variants";
import type { CardVariantId } from "./card-variants";

export interface NavLink {
  id: string;
  label: string;
  href: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: NavLink[];
}

interface BaseSection {
  id: string;
}

export interface HeaderSection extends BaseSection {
  kind: "header";
  variant: HeaderVariantId;
  logoText: string;
  navLinks: NavLink[];
}

export interface HeroSection extends BaseSection {
  kind: "hero";
  variant: HeroVariantId;
  /** Línea chica sobre el titular. Vacío lo oculta. */
  eyebrow: string;
  title: string;
  /** Segunda línea del titular, la que cada variante destaca en itálica o color.
   * Vacío deja el titular en una sola línea. */
  titleHighlight: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  /** Acción secundaria. Vacío la oculta; la variante cinemática no la usa. */
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  imageUrl: string;
  imageAlt: string;
}

export interface CardsSection extends BaseSection {
  kind: "cards";
  variant: CardVariantId;
}

export interface ContactSection extends BaseSection {
  kind: "contact";
  storeName: string;
  phone: string;
  address: string;
  email: string;
  hours: string;
  /** Botón flotante de WhatsApp, visible en toda la landing. */
  whatsappEnabled: boolean;
  /** Puede ser distinto de `phone`: el fijo del local no suele recibir mensajes. */
  whatsappPhone: string;
  whatsappLabel: string;
  /** Texto con el que arranca la conversación cuando el visitante toca el botón. */
  whatsappMessage: string;
}

export type FooterBackground = "forest" | "paper";

export interface FooterSection extends BaseSection {
  kind: "footer";
  closingPhrase: string;
  legalText: string;
  background: FooterBackground;
  columns: FooterColumn[];
  instagram: string;
  pinterest: string;
  newsletterEnabled: boolean;
}

export interface SeoSection extends BaseSection {
  kind: "seo";
  metaTitle: string;
  metaDescription: string;
  shareImageUrl: string;
  shareImageAlt: string;
}

export type CmsSection =
  | HeaderSection
  | HeroSection
  | CardsSection
  | ContactSection
  | FooterSection
  | SeoSection;

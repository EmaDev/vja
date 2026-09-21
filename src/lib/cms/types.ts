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

export type ContactFieldRequirement = "Obligatorio" | "Opcional" | "Lista desplegable";

export interface ContactField {
  id: string;
  label: string;
  requirement: ContactFieldRequirement;
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
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
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
  formRecipientEmail: string;
  thankYouMessage: string;
  fields: ContactField[];
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

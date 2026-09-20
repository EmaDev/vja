import type { HeroVariantId } from "./hero-variants";

export interface NavLink {
  id: string;
  label: string;
  href: string;
}

interface BaseSection {
  id: string;
  name: string;
  visible: boolean;
}

export interface HeaderSection extends BaseSection {
  kind: "header";
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
}

export interface FooterSection extends BaseSection {
  kind: "footer";
  text: string;
  socialLinks: NavLink[];
}

export interface CustomSection extends BaseSection {
  kind: "custom";
  templateLabel: string;
  title: string;
  content: string;
}

export type CmsSection = HeaderSection | HeroSection | FooterSection | CustomSection;

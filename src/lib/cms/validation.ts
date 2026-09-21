import { heroVariants } from "./hero-variants";
import { headerVariants } from "./header-variants";
import { cardVariants } from "./card-variants";
import type {
  CardsSection,
  CmsSection,
  ContactField,
  ContactSection,
  FooterColumn,
  FooterSection,
  HeaderSection,
  HeroSection,
  NavLink,
  SeoSection,
} from "./types";

const HERO_VARIANT_IDS = new Set<string>(heroVariants.map((variant) => variant.id));
const HEADER_VARIANT_IDS = new Set<string>(headerVariants.map((variant) => variant.id));
const CARD_VARIANT_IDS = new Set<string>(cardVariants.map((variant) => variant.id));
const CONTACT_REQUIREMENTS = new Set(["Obligatorio", "Opcional", "Lista desplegable"]);
const FOOTER_BACKGROUNDS = new Set(["forest", "paper"]);

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isNavLink(value: unknown): value is NavLink {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return isString(record.id) && isString(record.label) && isString(record.href);
}

function isNavLinkArray(value: unknown): value is NavLink[] {
  return Array.isArray(value) && value.every(isNavLink);
}

function isContactField(value: unknown): value is ContactField {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    isString(record.id) &&
    isString(record.label) &&
    isString(record.requirement) &&
    CONTACT_REQUIREMENTS.has(record.requirement)
  );
}

function isFooterColumn(value: unknown): value is FooterColumn {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return isString(record.id) && isString(record.title) && isNavLinkArray(record.links);
}

function hasBaseFields(record: Record<string, unknown>): boolean {
  return isString(record.id);
}

function isHeaderSection(record: Record<string, unknown>): record is HeaderSection & Record<string, unknown> {
  return (
    hasBaseFields(record) &&
    isString(record.variant) &&
    HEADER_VARIANT_IDS.has(record.variant) &&
    isString(record.logoText) &&
    isNavLinkArray(record.navLinks)
  );
}

function isHeroSection(record: Record<string, unknown>): record is HeroSection & Record<string, unknown> {
  return (
    hasBaseFields(record) &&
    isString(record.variant) &&
    HERO_VARIANT_IDS.has(record.variant) &&
    isString(record.title) &&
    isString(record.subtitle) &&
    isString(record.ctaLabel) &&
    isString(record.ctaHref) &&
    isString(record.imageUrl) &&
    isString(record.imageAlt)
  );
}

function isCardsSection(record: Record<string, unknown>): record is CardsSection & Record<string, unknown> {
  return hasBaseFields(record) && isString(record.variant) && CARD_VARIANT_IDS.has(record.variant);
}

function isContactSection(record: Record<string, unknown>): record is ContactSection & Record<string, unknown> {
  return (
    hasBaseFields(record) &&
    isString(record.storeName) &&
    isString(record.phone) &&
    isString(record.address) &&
    isString(record.email) &&
    isString(record.hours) &&
    isString(record.formRecipientEmail) &&
    isString(record.thankYouMessage) &&
    Array.isArray(record.fields) &&
    (record.fields as unknown[]).every(isContactField)
  );
}

function isFooterSection(record: Record<string, unknown>): record is FooterSection & Record<string, unknown> {
  return (
    hasBaseFields(record) &&
    isString(record.closingPhrase) &&
    isString(record.legalText) &&
    isString(record.background) &&
    FOOTER_BACKGROUNDS.has(record.background) &&
    Array.isArray(record.columns) &&
    (record.columns as unknown[]).every(isFooterColumn) &&
    isString(record.instagram) &&
    isString(record.pinterest) &&
    isBoolean(record.newsletterEnabled)
  );
}

function isSeoSection(record: Record<string, unknown>): record is SeoSection & Record<string, unknown> {
  return (
    hasBaseFields(record) &&
    isString(record.metaTitle) &&
    isString(record.metaDescription) &&
    isString(record.shareImageUrl) &&
    isString(record.shareImageAlt)
  );
}

export function isCmsSection(value: unknown): value is CmsSection {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;

  switch (record.kind) {
    case "header":
      return isHeaderSection(record);
    case "hero":
      return isHeroSection(record);
    case "cards":
      return isCardsSection(record);
    case "contact":
      return isContactSection(record);
    case "footer":
      return isFooterSection(record);
    case "seo":
      return isSeoSection(record);
    default:
      return false;
  }
}

export function isCmsSectionArray(value: unknown): value is CmsSection[] {
  if (!Array.isArray(value) || value.length === 0) return false;
  if (!value.every(isCmsSection)) return false;

  const ids = new Set(value.map((section) => (section as CmsSection).id));
  return ids.size === value.length;
}

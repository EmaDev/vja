import { heroVariants } from "./hero-variants";
import { headerVariants } from "./header-variants";
import { cardVariants } from "./card-variants";
import type {
  AboutSection,
  AboutStat,
  AnnouncementItem,
  CardsSection,
  CareNote,
  CareSection,
  CmsSection,
  ContactSection,
  FaqItem,
  FaqSection,
  FooterColumn,
  FooterSection,
  HeaderSection,
  HeroSection,
  NavLink,
  SeoSection,
  ServiceCard,
  ServicesSection,
  ShippingSection,
  ShippingZone,
  VisitHours,
  VisitSection,
} from "./types";

const HERO_VARIANT_IDS = new Set<string>(heroVariants.map((variant) => variant.id));
const HEADER_VARIANT_IDS = new Set<string>(headerVariants.map((variant) => variant.id));
const CARD_VARIANT_IDS = new Set<string>(cardVariants.map((variant) => variant.id));
const FOOTER_BACKGROUNDS = new Set(["forest", "paper"]);

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

/** Guard para un item de lista del CMS: un objeto con `id` y el resto de sus
 * campos de texto. Las secciones nuevas son casi todas listas repetibles
 * (categorías, servicios, fotos, horarios, preguntas) y todas tienen esta forma,
 * así que el molde se arma una vez en vez de copiarse en cada guard. */
function isTextRecord<T>(keys: readonly string[]) {
  return function guard(value: unknown): value is T {
    if (typeof value !== "object" || value === null) return false;
    const record = value as Record<string, unknown>;
    return isString(record.id) && keys.every((key) => isString(record[key]));
  };
}

function isArrayOf<T>(guard: (value: unknown) => value is T) {
  return function arrayGuard(value: unknown): value is T[] {
    return Array.isArray(value) && value.every(guard);
  };
}

const isNavLink = isTextRecord<NavLink>(["label", "href"]);
const isNavLinkArray = isArrayOf(isNavLink);
const isAnnouncementArray = isArrayOf(isTextRecord<AnnouncementItem>(["text"]));

const isAboutStatArray = isArrayOf(isTextRecord<AboutStat>(["value", "label"]));
const isServiceCardArray = isArrayOf(
  isTextRecord<ServiceCard>(["tag", "title", "body", "whatsappSubject", "imageUrl", "imageAlt"]),
);
const isCareNoteArray = isArrayOf(
  isTextRecord<CareNote>(["tag", "title", "summary", "href", "imageUrl", "imageAlt"]),
);
const isVisitHoursArray = isArrayOf(isTextRecord<VisitHours>(["days", "time"]));
const isShippingZoneArray = isArrayOf(isTextRecord<ShippingZone>(["postalCode", "locality"]));
const isFaqItemArray = isArrayOf(isTextRecord<FaqItem>(["question", "answer"]));

function isFooterColumn(value: unknown): value is FooterColumn {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return isString(record.id) && isString(record.title) && isNavLinkArray(record.links);
}

function hasBaseFields(record: Record<string, unknown>): boolean {
  return isString(record.id);
}

/** Base de las secciones que el cliente puede apagar desde el CMS. */
function hasToggleableFields(record: Record<string, unknown>): boolean {
  return hasBaseFields(record) && isBoolean(record.visible);
}

function isHeaderSection(record: Record<string, unknown>): record is HeaderSection & Record<string, unknown> {
  return (
    hasBaseFields(record) &&
    isString(record.variant) &&
    HEADER_VARIANT_IDS.has(record.variant) &&
    isString(record.logoText) &&
    isString(record.logoImageUrl) &&
    isString(record.logoImageAlt) &&
    isNavLinkArray(record.navLinks) &&
    isAnnouncementArray(record.announcements)
  );
}

function isHeroSection(record: Record<string, unknown>): record is HeroSection & Record<string, unknown> {
  return (
    hasBaseFields(record) &&
    isString(record.variant) &&
    HERO_VARIANT_IDS.has(record.variant) &&
    isString(record.eyebrow) &&
    isString(record.title) &&
    isString(record.titleHighlight) &&
    isString(record.subtitle) &&
    isString(record.ctaLabel) &&
    isString(record.ctaHref) &&
    isString(record.secondaryCtaLabel) &&
    isString(record.secondaryCtaHref) &&
    isString(record.imageUrl) &&
    isString(record.imageAlt) &&
    isString(record.featuredProductId)
  );
}

function isCardsSection(record: Record<string, unknown>): record is CardsSection & Record<string, unknown> {
  return hasBaseFields(record) && isString(record.variant) && CARD_VARIANT_IDS.has(record.variant);
}

function isAboutSection(record: Record<string, unknown>): record is AboutSection & Record<string, unknown> {
  return (
    hasToggleableFields(record) &&
    isString(record.eyebrow) &&
    isString(record.title) &&
    isString(record.titleHighlight) &&
    isString(record.bodyFirst) &&
    isString(record.bodySecond) &&
    isAboutStatArray(record.stats) &&
    isString(record.imageUrl) &&
    isString(record.imageAlt) &&
    isString(record.accentImageUrl) &&
    isString(record.accentImageAlt) &&
    isString(record.badgeLabel)
  );
}

function isServicesSection(
  record: Record<string, unknown>,
): record is ServicesSection & Record<string, unknown> {
  return (
    hasToggleableFields(record) &&
    isString(record.eyebrow) &&
    isString(record.title) &&
    isString(record.subtitle) &&
    isServiceCardArray(record.items)
  );
}

function isCareSection(record: Record<string, unknown>): record is CareSection & Record<string, unknown> {
  return (
    hasToggleableFields(record) &&
    isString(record.eyebrow) &&
    isString(record.title) &&
    isString(record.subtitle) &&
    isCareNoteArray(record.items)
  );
}

function isVisitSection(record: Record<string, unknown>): record is VisitSection & Record<string, unknown> {
  return (
    hasToggleableFields(record) &&
    isString(record.eyebrow) &&
    isString(record.title) &&
    isString(record.titleHighlight) &&
    isString(record.subtitle) &&
    isVisitHoursArray(record.hours) &&
    isString(record.mapEmbedUrl) &&
    isString(record.directionsUrl) &&
    isString(record.ctaLabel)
  );
}

function isShippingSection(
  record: Record<string, unknown>,
): record is ShippingSection & Record<string, unknown> {
  return (
    hasToggleableFields(record) &&
    isString(record.eyebrow) &&
    isString(record.title) &&
    isString(record.subtitle) &&
    isShippingZoneArray(record.zones) &&
    isString(record.coveredNote) &&
    isString(record.notCoveredNote) &&
    isString(record.ctaLabel)
  );
}

function isFaqSection(record: Record<string, unknown>): record is FaqSection & Record<string, unknown> {
  return (
    hasToggleableFields(record) &&
    isString(record.eyebrow) &&
    isString(record.title) &&
    isString(record.titleHighlight) &&
    isString(record.searchPlaceholder) &&
    isFaqItemArray(record.items)
  );
}

function isContactSection(record: Record<string, unknown>): record is ContactSection & Record<string, unknown> {
  return (
    hasBaseFields(record) &&
    isString(record.storeName) &&
    isString(record.phone) &&
    isString(record.address) &&
    isString(record.email) &&
    isString(record.hours) &&
    isBoolean(record.whatsappEnabled) &&
    isString(record.whatsappPhone) &&
    isString(record.whatsappLabel) &&
    isString(record.whatsappMessage)
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
    isString(record.pinterest)
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
    case "about":
      return isAboutSection(record);
    case "cards":
      return isCardsSection(record);
    case "services":
      return isServicesSection(record);
    case "care":
      return isCareSection(record);
    case "visit":
      return isVisitSection(record);
    case "shipping":
      return isShippingSection(record);
    case "faq":
      return isFaqSection(record);
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

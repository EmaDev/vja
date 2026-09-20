import { heroVariants } from "./hero-variants";
import type { CmsSection, CustomSection, FooterSection, HeaderSection, HeroSection, NavLink } from "./types";

const HERO_VARIANT_IDS = new Set<string>(heroVariants.map((variant) => variant.id));

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNavLink(value: unknown): value is NavLink {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return isString(record.id) && isString(record.label) && isString(record.href);
}

function isNavLinkArray(value: unknown): value is NavLink[] {
  return Array.isArray(value) && value.every(isNavLink);
}

function hasBaseFields(record: Record<string, unknown>): boolean {
  return isString(record.id) && isString(record.name) && typeof record.visible === "boolean";
}

function isHeaderSection(record: Record<string, unknown>): record is HeaderSection & Record<string, unknown> {
  return hasBaseFields(record) && isString(record.logoText) && isNavLinkArray(record.navLinks);
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
    isString(record.imageUrl)
  );
}

function isFooterSection(record: Record<string, unknown>): record is FooterSection & Record<string, unknown> {
  return hasBaseFields(record) && isString(record.text) && isNavLinkArray(record.socialLinks);
}

function isCustomSection(record: Record<string, unknown>): record is CustomSection & Record<string, unknown> {
  return (
    hasBaseFields(record) && isString(record.templateLabel) && isString(record.title) && isString(record.content)
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
    case "footer":
      return isFooterSection(record);
    case "custom":
      return isCustomSection(record);
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

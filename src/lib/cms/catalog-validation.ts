import type { CatalogStatus, Category, Product, ProductPhoto } from "./catalog-types";

/** Los payloads llegan desde el cliente, así que el servidor no puede confiar en
 * el tipo: se validan igual que las secciones en `validation.ts`. */

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function isCatalogStatus(value: unknown): value is CatalogStatus {
  return value === "live" || value === "draft";
}

function isProductPhoto(value: unknown): value is ProductPhoto {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return isString(record.id) && isString(record.imageUrl) && isString(record.imageAlt);
}

export function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;

  return (
    isString(record.id) &&
    isString(record.name) &&
    isString(record.latin) &&
    isString(record.category) &&
    isCatalogStatus(record.status) &&
    Array.isArray(record.photos) &&
    record.photos.every(isProductPhoto) &&
    isString(record.short) &&
    isString(record.long) &&
    Array.isArray(record.tags) &&
    record.tags.every(isString) &&
    isBoolean(record.featured)
  );
}

export function isCategory(value: unknown): value is Category {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;

  return (
    isString(record.id) &&
    isString(record.name) &&
    isString(record.slug) &&
    isString(record.short) &&
    isString(record.description) &&
    isCatalogStatus(record.status) &&
    isBoolean(record.featured) &&
    isString(record.imageUrl) &&
    isString(record.imageAlt)
  );
}

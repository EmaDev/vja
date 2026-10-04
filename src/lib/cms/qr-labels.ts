import { SITE_URL, siteUrlConfigured, siteUrlInvalid } from "@/lib/site-url";
import { productHref, type Product } from "./catalog-types";
import { markdownToPlain } from "./markdown";

/** El dominio público y sus banderas de configuración viven en
 * `@/lib/site-url`: los necesitan también el canónico, el sitemap y los datos
 * estructurados. Se reexportan porque el panel los importa desde acá. */
export { SITE_URL, siteUrlConfigured, siteUrlInvalid };

/** URL absoluta de la ficha, o `null` si todavía no hay dominio configurado o
 * si el producto no se guardó (sin id no hay ruta que apuntar). */
export function productQrUrl(product: Product): string | null {
  if (!siteUrlConfigured || !product.id) return null;

  try {
    return new URL(productHref(product), SITE_URL).toString();
  } catch {
    // `NEXT_PUBLIC_SITE_URL` mal escrita: mejor sin QR que con uno roto.
    return null;
  }
}

export type QrLabelStyleId = "minimal" | "nursery";

export interface QrLabelStyle {
  id: QrLabelStyleId;
  label: string;
  description: string;
}

export const qrLabelStyles: QrLabelStyle[] = [
  {
    id: "minimal",
    label: "Mínima",
    description: "QR y nombre. Entra en un colgante de maceta.",
  },
  {
    id: "nursery",
    label: "Vivero",
    description: "Nombre científico arriba y leyenda para escanear.",
  },
];

export const defaultQrLabelStyle: QrLabelStyleId = "nursery";

export type QrColorId = "black" | "forest" | "ink" | "sage";

export interface QrColor {
  id: QrColorId;
  label: string;
  hex: string;
}

/** Paleta para los módulos del QR.
 *
 * Es una lista cerrada y no un selector libre de color porque un QR claro no
 * se lee: el estándar pide módulos oscuros sobre fondo claro, y el lector de
 * un celular cualquiera en un pasillo de vivero tiene menos luz que una
 * pantalla. El criterio para entrar es contraste ≥ 6:1 sobre blanco, medido
 * con la fórmula de luminancia relativa de WCAG. Por eso están el negro
 * (21:1), el verde del sitio (14,2:1), la tinta (8,8:1) y el salvia (6,2:1),
 * y quedan afuera la terracota (4:1) y el taupe (3,6:1), que en papel dan
 * lecturas intermitentes. */
export const qrColors: QrColor[] = [
  { id: "black", label: "Negro", hex: "#000000" },
  { id: "forest", label: "Bosque", hex: "#17301F" },
  { id: "ink", label: "Tinta", hex: "#4B4B41" },
  { id: "sage", label: "Salvia", hex: "#3F6B47" },
];

export const defaultQrColor: QrColorId = "black";

export function qrColorHex(id: QrColorId): string {
  return qrColors.find((color) => color.id === id)?.hex ?? "#000000";
}

export type QrSizeId = "sm" | "md" | "lg";

export interface QrSize {
  id: QrSizeId;
  label: string;
  /** Lado del QR impreso, en milímetros. */
  mm: number;
}

/** Tamaños del QR, en milímetros porque el destino es papel.
 *
 * El piso lo marca el módulo (el cuadradito): una URL de ficha arma un QR de
 * 33 módulos más la zona de silencio, así que a 24 mm cada módulo mide
 * 0,58 mm, bastante arriba del mínimo de 0,33 mm que recomienda el estándar
 * para impresión. Por debajo de 24 mm la etiqueta empieza a depender de la
 * resolución de la impresora, y eso no se nota hasta tener las cien hojas
 * impresas. */
export const qrSizes: QrSize[] = [
  { id: "sm", label: "Chico", mm: 24 },
  { id: "md", label: "Medio", mm: 32 },
  { id: "lg", label: "Grande", mm: 42 },
];

export const defaultQrSize: QrSizeId = "md";

export function qrSizeMm(id: QrSizeId): number {
  return qrSizes.find((size) => size.id === id)?.mm ?? 32;
}

export type QrDescriptionId = "none" | "short" | "long";

export interface QrDescriptionOption {
  id: QrDescriptionId;
  label: string;
}

/** Qué descripción entra en la etiqueta. `short` es la bajada que se ve en la
 * card del catálogo y `long` el texto de la ficha pública: son dos campos
 * distintos del producto, no dos recortes del mismo. */
export const qrDescriptions: QrDescriptionOption[] = [
  { id: "none", label: "Ninguna" },
  { id: "short", label: "Corta" },
  { id: "long", label: "Extensa" },
];

export const defaultQrDescription: QrDescriptionId = "none";

/** Todo lo que se puede elegir en el diálogo de impresión. Va junto en un
 * objeto para que agregar una opción no sume un prop a cada etiqueta. */
export interface QrLabelOptions {
  style: QrLabelStyleId;
  color: QrColorId;
  size: QrSizeId;
  description: QrDescriptionId;
}

export const defaultQrLabelOptions: QrLabelOptions = {
  style: defaultQrLabelStyle,
  color: defaultQrColor,
  size: defaultQrSize,
  description: defaultQrDescription,
};

/** El texto que va en la etiqueta según lo elegido.
 *
 * `long` viene del editor markdown, así que se aplana antes de imprimirlo: en
 * papel, un `**negrita**` se lee con los asteriscos. `short` se escribe en un
 * campo de texto plano y va tal cual.
 *
 * Cada modo cae en el otro campo cuando el pedido está vacío, igual que los
 * metadatos de la ficha (`src/app/producto/[slug]/page.tsx`): si se pidió una
 * descripción, el otro texto es mejor que un hueco. */
export function productDescription(product: Product, mode: QrDescriptionId): string {
  if (mode === "none") return "";
  const long = markdownToPlain(product.long);
  return mode === "long" ? long || product.short : product.short || long;
}

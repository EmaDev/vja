import { productHref, type Product } from "./catalog-types";

/** Dominio público del sitio, para armar la URL absoluta que codifica el QR.
 *
 * No tiene valor por defecto a propósito. Un QR es papel: si se imprimen cien
 * etiquetas apuntando al dominio equivocado no hay forma de corregirlas a
 * distancia, así que es preferible que la pantalla se bloquee y lo pida a que
 * genere códigos que escanean a la nada. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";

export const siteUrlConfigured = SITE_URL !== "";

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
    description: "QR, nombre científico y la ficha de cuidados.",
  },
];

export const defaultQrLabelStyle: QrLabelStyleId = "nursery";

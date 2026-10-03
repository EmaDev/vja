import type { ComponentType } from "react";
import { HeroEditorialSplit } from "@/components/organisms/HeroEditorialSplit";
import { HeroCinematic } from "@/components/organisms/HeroCinematic";
import { HeroCollage } from "@/components/organisms/HeroCollage";
import { HeroAnnouncementArch } from "@/components/organisms/HeroAnnouncementArch";
import { HeroSidebarProduct } from "@/components/organisms/HeroSidebarProduct";
import type { WireKind } from "@/components/molecules/VariantWireframe/VariantWireframe";
import type { Product } from "./catalog-types";

export type HeroVariantId =
  | "editorial-split"
  | "cinematic"
  | "collage"
  | "announcement-arch"
  | "sidebar-product";

/** Campos genéricos que edita el CMS — misma forma que `HeroSection`, declarada
 * acá aparte (en vez de importarla de `./types`) para no generar un import
 * circular, ya que `types.ts` importa `HeroVariantId` de este archivo. */
export interface HeroContentData {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  imageUrl: string;
  imageAlt: string;
  featuredProductId: string;
  /** La planta de `featuredProductId` ya buscada en el catálogo. La resuelve
   * quien dibuja el hero —la landing contra lo publicado, el panel contra lo
   * que ve el cliente— porque este módulo no lee la base. */
  featuredProduct?: Product | null;
}

export interface HeroVariantDefinition {
  id: HeroVariantId;
  code: string;
  label: string;
  description: string;
  wireKind: WireKind;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: ComponentType<any>;
  /** Traduce los campos genéricos del CMS a las props puntuales de este hero. */
  getProps: (data: HeroContentData) => Record<string, unknown>;
}

/** Lo que todas las variantes reciben igual. Cada una le suma el mapeo de su
 * titular, que es lo único que cambia de nombre entre un diseño y otro.
 *
 * Los textos se pasan tal cual, incluso vacíos: si fueran `undefined` el componente
 * caería en el texto de ejemplo de su mockup, y borrar la volanta en el panel haría
 * aparecer "Temporada de interior" en el sitio publicado. Cada hero ya se encarga de
 * no dibujar lo que llega vacío. Los `href` sí van como `undefined`, porque ahí la
 * ausencia significa "botón sin link", no "texto vacío". */
function commonProps(data: HeroContentData): Record<string, unknown> {
  return {
    eyebrow: data.eyebrow,
    description: data.subtitle,
    primaryCtaLabel: data.ctaLabel,
    primaryCtaHref: data.ctaHref || undefined,
    secondaryCtaLabel: data.secondaryCtaLabel,
    secondaryCtaHref: data.secondaryCtaHref || undefined,
    image: data.imageUrl || undefined,
    imageAlt: data.imageAlt || undefined,
  };
}

export const heroVariants: HeroVariantDefinition[] = [
  {
    id: "editorial-split",
    code: "1a",
    label: "Split editorial",
    description: "Texto a la izquierda, foto vertical y card flotante.",
    wireKind: "split",
    Component: HeroEditorialSplit,
    getProps: (data) => ({
      ...commonProps(data),
      titleLine1: data.title,
      titleEmphasis: data.titleHighlight,
      // La única variante con card “Favorita”. El dato de cuidado hace de
      // bajada; si la planta no lo tiene cargado, cae en su categoría.
      featured: data.featuredProduct
        ? {
            eyebrow: "Favorita",
            title: data.featuredProduct.name,
            subtitle: data.featuredProduct.light || data.featuredProduct.category,
          }
        : null,
    }),
  },
  {
    id: "cinematic",
    code: "1b",
    label: "Full-bleed cinemático",
    description: "Foto a pantalla completa con titular sobre el degradado.",
    wireKind: "bleed",
    Component: HeroCinematic,
    getProps: (data) => ({
      ...commonProps(data),
      titleLine1: data.title,
      titleLine2: data.titleHighlight,
      // Esta variante no tiene botón sólido: su única acción es el link del pie.
      ctaLabel: data.ctaLabel,
      ctaHref: data.ctaHref || undefined,
    }),
  },
  {
    id: "collage",
    code: "1c",
    label: "Collage asimétrico",
    description: "Tres fotos desfasadas con titular superpuesto.",
    wireKind: "collage",
    Component: HeroCollage,
    getProps: (data) => ({
      ...commonProps(data),
      titleLine1: data.title,
      titleEmphasis: data.titleHighlight,
    }),
  },
  {
    id: "announcement-arch",
    code: "1d",
    label: "Arco con badges",
    description: "Imagen en arco y etiquetas de cuidado flotantes.",
    wireKind: "arch",
    Component: HeroAnnouncementArch,
    getProps: (data) => ({
      ...commonProps(data),
      titleLine1: data.title,
      titleLine2: data.titleHighlight,
    }),
  },
  {
    id: "sidebar-product",
    code: "1e",
    label: "Oscuro con destacados",
    description: "Fondo verde profundo y fila de productos abajo.",
    wireKind: "dark",
    Component: HeroSidebarProduct,
    getProps: (data) => ({
      ...commonProps(data),
      titleLine1: data.title,
      titleEmphasis: data.titleHighlight,
    }),
  },
];

export const defaultHeroVariant: HeroVariantId = "editorial-split";

/** Fondo del hero, para que el header flotante elija su contraste. */
export const heroTone: Record<HeroVariantId, "light" | "dark"> = {
  "editorial-split": "light",
  cinematic: "dark",
  collage: "light",
  "announcement-arch": "light",
  "sidebar-product": "dark",
};

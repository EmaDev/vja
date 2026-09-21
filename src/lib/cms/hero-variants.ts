import type { ComponentType } from "react";
import { HeroEditorialSplit } from "@/components/organisms/HeroEditorialSplit";
import { HeroCinematic } from "@/components/organisms/HeroCinematic";
import { HeroCollage } from "@/components/organisms/HeroCollage";
import { HeroAnnouncementArch } from "@/components/organisms/HeroAnnouncementArch";
import { HeroSidebarProduct } from "@/components/organisms/HeroSidebarProduct";
import type { WireKind } from "@/components/molecules/VariantWireframe/VariantWireframe";

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
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl: string;
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

export const heroVariants: HeroVariantDefinition[] = [
  {
    id: "editorial-split",
    code: "1a",
    label: "Split editorial",
    description: "Texto a la izquierda, foto vertical y card flotante.",
    wireKind: "split",
    Component: HeroEditorialSplit,
    getProps: (data) => ({
      titleLine1: data.title,
      description: data.subtitle,
      primaryCtaLabel: data.ctaLabel,
      image: data.imageUrl || undefined,
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
      titleLine1: data.title,
      description: data.subtitle,
      ctaLabel: data.ctaLabel,
      image: data.imageUrl || undefined,
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
      titlePrefix: data.title,
      description: data.subtitle,
      primaryCtaLabel: data.ctaLabel,
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
      titleLine1: data.title,
      description: data.subtitle,
      primaryCtaLabel: data.ctaLabel,
      image: data.imageUrl || undefined,
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
      titleLine1: data.title,
      description: data.subtitle,
      primaryCtaLabel: data.ctaLabel,
    }),
  },
];

export const defaultHeroVariant: HeroVariantId = "editorial-split";

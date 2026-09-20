import type { ComponentType } from "react";
import { HeroEditorialSplit } from "@/components/organisms/HeroEditorialSplit";
import { HeroCinematic } from "@/components/organisms/HeroCinematic";
import { HeroCollage } from "@/components/organisms/HeroCollage";
import { HeroAnnouncementArch } from "@/components/organisms/HeroAnnouncementArch";
import { HeroSidebarProduct } from "@/components/organisms/HeroSidebarProduct";

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
  label: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: ComponentType<any>;
  /** Traduce los campos genéricos del CMS a las props puntuales de este hero. */
  getProps: (data: HeroContentData) => Record<string, unknown>;
}

export const heroVariants: HeroVariantDefinition[] = [
  {
    id: "editorial-split",
    label: "Editorial split",
    description: "Logo centrado, título tipográfico y foto vertical con dato destacado.",
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
    label: "Cinemático",
    description: "Foto a pantalla completa con header flotante y copy sobre la imagen.",
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
    label: "Collage",
    description: "Título enorme superpuesto a un collage asimétrico de fotos.",
    Component: HeroCollage,
    getProps: (data) => ({
      titlePrefix: data.title,
      description: data.subtitle,
      primaryCtaLabel: data.ctaLabel,
    }),
  },
  {
    id: "announcement-arch",
    label: "Anuncio + arco",
    description: "Barra de anuncios en marquesina y foto de producto en arco.",
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
    label: "Sidebar + producto",
    description: "Nav lateral fija, hero oscuro y carrusel de productos.",
    Component: HeroSidebarProduct,
    getProps: (data) => ({
      titleLine1: data.title,
      description: data.subtitle,
      primaryCtaLabel: data.ctaLabel,
    }),
  },
];

export const defaultHeroVariant: HeroVariantId = "editorial-split";

import type { ComponentType } from "react";
import { SiteHeaderCentered } from "@/components/molecules/SiteHeaderCentered";
import { FloatingHeader } from "@/components/molecules/FloatingHeader";
import { HeaderWithDot } from "@/components/molecules/HeaderWithDot";
import { HeaderWithAnnouncement } from "@/components/molecules/HeaderWithAnnouncement";
import { SidebarNav } from "@/components/molecules/SidebarNav";
import type { WireKind } from "@/components/molecules/VariantWireframe/VariantWireframe";

export type HeaderVariantId = "centered" | "floating" | "classic" | "announcement" | "side";

export interface HeaderVariantDefinition {
  id: HeaderVariantId;
  code: string;
  label: string;
  description: string;
  wireKind: WireKind;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: ComponentType<any>;
}

export const headerVariants: HeaderVariantDefinition[] = [
  {
    id: "centered",
    code: "1a",
    label: "Editorial centrado",
    description: "Logo al medio, navegación repartida a los costados.",
    wireKind: "center",
    Component: SiteHeaderCentered,
  },
  {
    id: "floating",
    code: "1b",
    label: "Flotante sobre foto",
    description: "Pill de navegación translúcida encima del hero.",
    wireKind: "float",
    Component: FloatingHeader,
  },
  {
    id: "classic",
    code: "1c",
    label: "Clásico a la izquierda",
    description: "Logo, menú y acciones en una sola línea.",
    wireKind: "left",
    Component: HeaderWithDot,
  },
  {
    id: "announcement",
    code: "1d",
    label: "Con barra de anuncio",
    description: "Franja de avisos animada sobre el menú.",
    wireKind: "strip",
    Component: HeaderWithAnnouncement,
  },
  {
    id: "side",
    code: "1e",
    label: "Lateral fija",
    description: "Navegación vertical siempre visible a la izquierda.",
    wireKind: "side",
    Component: SidebarNav,
  },
];

export const defaultHeaderVariant: HeaderVariantId = "classic";

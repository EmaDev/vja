import { defaultHeroVariant } from "./hero-variants";
import type { CmsSection } from "./types";

export const initialSections: CmsSection[] = [
  {
    id: "header",
    kind: "header",
    name: "Header",
    visible: true,
    logoText: "VJA Plantas",
    navLinks: [
      { id: "nav-1", label: "Inicio", href: "/" },
      { id: "nav-2", label: "Nosotros", href: "#nosotros" },
      { id: "nav-3", label: "Contacto", href: "#contacto" },
    ],
  },
  {
    id: "hero",
    kind: "hero",
    name: "Hero",
    visible: true,
    variant: defaultHeroVariant,
    title: "Plantas que transforman tu espacio",
    subtitle: "Cuidamos cada detalle para que tu jardín luzca siempre vivo.",
    ctaLabel: "Ver catálogo",
    ctaHref: "#catalogo",
    imageUrl: "",
  },
  {
    id: "footer",
    kind: "footer",
    name: "Footer",
    visible: true,
    text: "© VJA Plantas. Todos los derechos reservados.",
    socialLinks: [
      { id: "social-1", label: "Instagram", href: "https://instagram.com" },
      { id: "social-2", label: "WhatsApp", href: "https://wa.me/5490000000000" },
    ],
  },
];

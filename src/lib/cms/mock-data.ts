import { defaultHeaderVariant } from "./header-variants";
import { defaultHeroVariant } from "./hero-variants";
import { defaultCardVariant } from "./card-variants";
import type { CmsSection } from "./types";

/** Seed usado por `repository.ts` cuando `sites/vja-plantas` todavía no tiene un draft en Firestore. */
export const initialSections: CmsSection[] = [
  {
    id: "header",
    kind: "header",
    variant: defaultHeaderVariant,
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
    variant: defaultHeroVariant,
    eyebrow: "Temporada de interior",
    title: "Plantas que transforman",
    titleHighlight: "tu espacio",
    subtitle: "Cuidamos cada detalle para que tu jardín luzca siempre vivo.",
    ctaLabel: "Ver catálogo",
    ctaHref: "#catalogo",
    secondaryCtaLabel: "Escribinos",
    secondaryCtaHref: "#contacto",
    imageUrl: "",
    imageAlt: "",
  },
  {
    id: "cards",
    kind: "cards",
    variant: defaultCardVariant,
  },
  {
    id: "contact",
    kind: "contact",
    storeName: "VJA Plantas — Vivero",
    phone: "+54 11 4820-9931",
    address: "Av. Libertador 4820, Buenos Aires",
    email: "hola@vjaplantas.com.ar",
    hours: "Mar a Dom · 10 a 19 h",
    whatsappEnabled: true,
    whatsappPhone: "+54 9 11 4820-9931",
    whatsappLabel: "Escribinos",
    whatsappMessage: "¡Hola! Vengo de la web y quería hacerles una consulta.",
  },
  {
    id: "footer",
    kind: "footer",
    closingPhrase: "Cultivado aquí, cortado hoy.",
    legalText: "© 2026 VJA Plantas",
    background: "forest",
    columns: [
      { id: "col-1", title: "Tienda", links: [
        { id: "l-1", label: "Interior", href: "#" },
        { id: "l-2", label: "Exterior", href: "#" },
        { id: "l-3", label: "Flores", href: "#" },
        { id: "l-4", label: "Macetas", href: "#" },
      ] },
      { id: "col-2", title: "Ayuda", links: [
        { id: "l-5", label: "Cuidados", href: "#" },
        { id: "l-6", label: "Envíos", href: "#" },
        { id: "l-7", label: "Preguntas", href: "#" },
      ] },
      { id: "col-3", title: "Nosotros", links: [
        { id: "l-8", label: "El vivero", href: "#" },
        { id: "l-9", label: "Talleres", href: "#" },
        { id: "l-10", label: "Contacto", href: "#" },
      ] },
    ],
    instagram: "@vjaplantas",
    pinterest: "vjaplantas",
    newsletterEnabled: true,
  },
  {
    id: "seo",
    kind: "seo",
    metaTitle: "VJA Plantas · Vivero y floristería en Buenos Aires",
    metaDescription:
      "Plantas de interior, flores frescas y arreglos a medida. Vivero propio en Tigre y local en Av. Libertador.",
    shareImageUrl: "",
    shareImageAlt: "",
  },
];

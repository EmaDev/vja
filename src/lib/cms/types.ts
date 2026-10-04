import type { HeroVariantId } from "./hero-variants";
import type { HeaderVariantId } from "./header-variants";
import type { CardVariantId } from "./card-variants";

export interface NavLink {
  id: string;
  label: string;
  href: string;
}

export interface AnnouncementItem {
  id: string;
  text: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: NavLink[];
}

interface BaseSection {
  id: string;
}

/** Secciones que el cliente puede apagar sin perder lo que cargó. El header, el
 * hero, el catálogo, el contacto y el footer no la implementan: son la estructura
 * mínima de la landing y esconderlas dejaría una página sin salida. */
interface ToggleableSection extends BaseSection {
  visible: boolean;
}

export interface HeaderSection extends BaseSection {
  kind: "header";
  variant: HeaderVariantId;
  logoText: string;
  /** Logo cargado desde el CMS. Cuando hay uno, reemplaza al texto en las cinco
   * variantes; vacío, el header vuelve al wordmark. */
  logoImageUrl: string;
  logoImageAlt: string;
  navLinks: NavLink[];
  /** Avisos de la barra que corre arriba del menú. Sólo los dibuja la variante
   * “Con barra de anuncio”; sin ninguno cargado, esa variante no muestra la barra. */
  announcements: AnnouncementItem[];
}

export interface HeroSection extends BaseSection {
  kind: "hero";
  variant: HeroVariantId;
  /** Línea chica sobre el titular. Vacío lo oculta. */
  eyebrow: string;
  title: string;
  /** Segunda línea del titular, la que cada variante destaca en itálica o color.
   * Vacío deja el titular en una sola línea. */
  titleHighlight: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  /** Acción secundaria. Vacío la oculta; la variante cinemática no la usa. */
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  imageUrl: string;
  imageAlt: string;
  /** Planta de la card “Favorita”, por id de producto. Sólo la dibuja la
   * variante “Split editorial”; vacío —o apuntando a una planta despublicada—
   * deja el hero sin card. */
  featuredProductId: string;
}

export interface CardsSection extends BaseSection {
  kind: "cards";
  variant: CardVariantId;
}

export interface AboutStat {
  id: string;
  value: string;
  label: string;
}

export interface AboutSection extends ToggleableSection {
  kind: "about";
  eyebrow: string;
  title: string;
  /** Segunda línea del titular. Vacío lo deja en una sola línea. */
  titleHighlight: string;
  bodyFirst: string;
  bodySecond: string;
  stats: AboutStat[];
  imageUrl: string;
  imageAlt: string;
  /** Foto chica montada sobre la principal. Vacía deja la composición simple. */
  accentImageUrl: string;
  accentImageAlt: string;
  /** Cartel sobre la foto. Vacío lo oculta. */
  badgeLabel: string;
}

export interface ServiceCard {
  id: string;
  tag: string;
  title: string;
  body: string;
  /** Con qué consulta arranca el WhatsApp cuando alguien toca la card. Vacío la
   * deja como card informativa, sin enlace. */
  whatsappSubject: string;
  imageUrl: string;
  imageAlt: string;
}

export interface ServicesSection extends ToggleableSection {
  kind: "services";
  eyebrow: string;
  title: string;
  subtitle: string;
  items: ServiceCard[];
}

export interface CareNote {
  id: string;
  tag: string;
  title: string;
  summary: string;
  /** Dónde se lee la nota completa. Vacío la deja como tarjeta sin enlace. */
  href: string;
  imageUrl: string;
  imageAlt: string;
}

export interface CareSection extends ToggleableSection {
  kind: "care";
  eyebrow: string;
  title: string;
  subtitle: string;
  items: CareNote[];
}

/** El bloque "Visitanos": el mapa y el enlace a Maps.
 *
 * La dirección, el teléfono y los horarios no se repiten acá: salen de
 * `ContactSection`, el único lugar donde se cargan los datos del local. */
export interface VisitSection extends ToggleableSection {
  kind: "visit";
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  /** `src` del iframe de Google Maps. Vacío oculta el mapa. */
  mapEmbedUrl: string;
  /** Link de "Cómo llegar". Vacío oculta el botón. */
  directionsUrl: string;
  ctaLabel: string;
}

/** Un código postal dentro del área de reparto. */
export interface ShippingZone {
  id: string;
  postalCode: string;
  locality: string;
}

export interface ShippingSection extends ToggleableSection {
  kind: "shipping";
  eyebrow: string;
  title: string;
  subtitle: string;
  zones: ShippingZone[];
  /** Qué se le dice a quien sí está en zona y a quien no. */
  coveredNote: string;
  notCoveredNote: string;
  ctaLabel: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqSection extends ToggleableSection {
  kind: "faq";
  eyebrow: string;
  title: string;
  titleHighlight: string;
  searchPlaceholder: string;
  items: FaqItem[];
}

/** Un tramo del horario de atención: "Lunes a viernes" / "9:00 – 18:00". */
export interface BusinessHours {
  id: string;
  days: string;
  time: string;
}

/** Los datos del local, cargados una sola vez.
 *
 * Es la única fuente de la dirección, el teléfono y los horarios: "Visitanos",
 * el footer y el header lateral los leen de acá en vez de guardar una copia
 * propia que después queda vieja. */
export interface ContactSection extends BaseSection {
  kind: "contact";
  storeName: string;
  phone: string;
  address: string;
  email: string;
  hours: BusinessHours[];
  /** Botón flotante de WhatsApp, visible en toda la landing. */
  whatsappEnabled: boolean;
  /** Puede ser distinto de `phone`: el fijo del local no suele recibir mensajes. */
  whatsappPhone: string;
  whatsappLabel: string;
  /** Texto con el que arranca la conversación cuando el visitante toca el botón. */
  whatsappMessage: string;
}

export type FooterBackground = "forest" | "paper";

export interface FooterSection extends BaseSection {
  kind: "footer";
  closingPhrase: string;
  legalText: string;
  background: FooterBackground;
  columns: FooterColumn[];
  instagram: string;
  pinterest: string;
}

export interface SeoSection extends BaseSection {
  kind: "seo";
  metaTitle: string;
  metaDescription: string;
  shareImageUrl: string;
  shareImageAlt: string;
}

/** El ícono del sitio: la pestaña del navegador, el redondelito que Google
 * dibuja al lado del resultado en el celular y el ícono de "Agregar a inicio".
 *
 * Son dos caminos y el cliente elige uno sin saberlo: si cargó una imagen, el
 * ícono es esa imagen; si no, se dibuja la inicial sobre un fondo de color. La
 * inicial no es un capricho de diseño sino lo único legible a 48 px, que es el
 * tamaño al que se ve el ícono casi siempre.
 *
 * Los colores se guardan como `#rrggbb`: los dibuja `lib/seo/app-icon.tsx`
 * dentro de un `ImageResponse`, donde no existen las variables CSS del sitio. */
export interface FaviconSection extends BaseSection {
  kind: "favicon";
  /** PNG cuadrado subido desde el panel. Vacío, el ícono es la inicial. */
  imageUrl: string;
  imageAlt: string;
  /** Una o dos letras. Vacío, se usa la inicial del nombre del negocio. */
  letter: string;
  background: string;
  foreground: string;
}

export type CmsSection =
  | HeaderSection
  | HeroSection
  | AboutSection
  | CardsSection
  | ServicesSection
  | CareSection
  | VisitSection
  | ShippingSection
  | FaqSection
  | ContactSection
  | FooterSection
  | SeoSection
  | FaviconSection;

import type { ReactNode } from "react";
import { FloatingHeader } from "@/components/molecules/FloatingHeader";
import { HeaderWithAnnouncement } from "@/components/molecules/HeaderWithAnnouncement";
import { HeaderWithDot } from "@/components/molecules/HeaderWithDot";
import { SidebarNav } from "@/components/molecules/SidebarNav";
import { SiteHeaderCentered } from "@/components/molecules/SiteHeaderCentered";
import { hoursLines } from "@/lib/cms/contact-info";
import type { ContactSection, HeaderSection } from "@/lib/cms/types";

export interface SiteChromeProps {
  header: HeaderSection;
  /** Datos del local. Sólo los mira la variante lateral, que muestra la
   * dirección y los horarios al pie de la columna; los lee de Contacto en vez de
   * guardar una copia propia. */
  contact?: ContactSection;
  /** Claro u oscuro del hero que va justo debajo. Sólo lo mira la variante
   * flotante, que se apoya encima de él y necesita contrastar. */
  heroTone: "light" | "dark";
  /** `false` en las páginas interiores, que no abren con un hero a sangre. La
   * variante flotante se apoya sobre la foto del hero; sin hero se superpondría
   * al contenido, así que hay que reservarle el alto. El resto no cambia. */
  hasHero?: boolean;
  children: ReactNode;
}

/** Monta el header elegido en el CMS alrededor del contenido de la landing.
 *
 * Cada variante necesita un envoltorio distinto —la flotante se superpone, la
 * lateral ocupa una columna propia— así que la decisión vive acá y no en cada
 * sección. Los heros traen su propio header en los mockups del CMS; en la landing
 * se apaga con `showHeader={false}` para que mande el que eligió el cliente. */
export function SiteChrome({ header, contact, heroTone, hasHero = true, children }: SiteChromeProps) {
  const { logoText, logoImageUrl, logoImageAlt, navLinks } = header;
  // Las cinco variantes reciben lo mismo; cada una decide cómo lo dibuja.
  const logo = { logoText, logoImageUrl, logoImageAlt };
  const navItems = navLinks.map(({ label, href }) => ({ label, href }));
  const activeLabel = navItems[0]?.label;
  // La barra de anuncio sale de la misma sección: sólo la mira la variante que
  // la dibuja. Los avisos en blanco no se cuentan, para no dejar huecos.
  //
  // El `?? []` es por el contenido publicado antes de que existiera el campo:
  // `getPublishedCached` sigue sirviendo lo que quedó en caché hasta la próxima
  // publicación, sin pasar por el relleno contra el seed del repositorio.
  const announcements = (header.announcements ?? [])
    .map((item) => item.text.trim())
    .filter((text) => text.length > 0);

  switch (header.variant) {
    case "centered": {
      const half = Math.ceil(navItems.length / 2);
      return (
        <>
          <SiteHeaderCentered
            {...logo}
            navLeft={navItems.slice(0, half)}
            navRight={navItems.slice(half)}
          />
          {children}
        </>
      );
    }

    case "floating":
      return (
        <div className="relative">
          <FloatingHeader
            {...logo}
            navItems={navItems}
            activeLabel={activeLabel}
            tone={heroTone === "dark" ? "light" : "dark"}
          />
          {hasHero ? children : <div className="pt-[72px] md:pt-[94px]">{children}</div>}
        </div>
      );

    case "announcement":
      return (
        <>
          <HeaderWithAnnouncement {...logo} navLeft={navItems} announcements={announcements} />
          {children}
        </>
      );

    case "side":
      return (
        <div className="bg-forest lg:grid lg:grid-cols-[232px_1fr]">
          {/* Abajo de `lg` no hay lugar para una columna fija: cae al header clásico. */}
          <div className="lg:hidden">
            <HeaderWithDot
              {...logo}
              navItems={navItems.map((item, index) => ({ ...item, active: index === 0 }))}
            />
          </div>
          <div className="hidden lg:sticky lg:top-0 lg:block lg:h-screen">
            <SidebarNav
              {...logo}
              navItems={navItems.map((item, index) => ({ ...item, active: index === 0 }))}
              address={contact?.address}
              hours={hoursLines(contact)}
            />
          </div>
          <div className="min-w-0">{children}</div>
        </div>
      );

    case "classic":
    default:
      return (
        <>
          <HeaderWithDot
            {...logo}
            navItems={navItems.map((item, index) => ({ ...item, active: index === 0 }))}
          />
          {children}
        </>
      );
  }
}

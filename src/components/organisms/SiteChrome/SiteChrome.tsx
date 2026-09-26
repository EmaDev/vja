import type { ReactNode } from "react";
import { FloatingHeader } from "@/components/molecules/FloatingHeader";
import { HeaderWithAnnouncement } from "@/components/molecules/HeaderWithAnnouncement";
import { HeaderWithDot } from "@/components/molecules/HeaderWithDot";
import { SidebarNav } from "@/components/molecules/SidebarNav";
import { SiteHeaderCentered } from "@/components/molecules/SiteHeaderCentered";
import type { HeaderSection } from "@/lib/cms/types";

export interface SiteChromeProps {
  header: HeaderSection;
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
export function SiteChrome({ header, heroTone, hasHero = true, children }: SiteChromeProps) {
  const { logoText, navLinks } = header;
  const navItems = navLinks.map(({ label, href }) => ({ label, href }));
  const activeLabel = navItems[0]?.label;

  switch (header.variant) {
    case "centered": {
      const half = Math.ceil(navItems.length / 2);
      return (
        <>
          <SiteHeaderCentered
            logoText={logoText}
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
            logoText={logoText}
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
          <HeaderWithAnnouncement logoText={logoText} navLeft={navItems} />
          {children}
        </>
      );

    case "side":
      return (
        <div className="bg-forest lg:grid lg:grid-cols-[232px_1fr]">
          {/* Abajo de `lg` no hay lugar para una columna fija: cae al header clásico. */}
          <div className="lg:hidden">
            <HeaderWithDot
              logoText={logoText}
              navItems={navItems.map((item, index) => ({ ...item, active: index === 0 }))}
            />
          </div>
          <div className="hidden lg:sticky lg:top-0 lg:block lg:h-screen">
            <SidebarNav
              logoText={logoText}
              navItems={navItems.map((item, index) => ({ ...item, active: index === 0 }))}
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
            logoText={logoText}
            navItems={navItems.map((item, index) => ({ ...item, active: index === 0 }))}
          />
          {children}
        </>
      );
  }
}

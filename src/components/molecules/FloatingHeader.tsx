import { Logo } from "@/components/atoms/Logo";
import { NavLink, type NavItem } from "@/components/atoms/NavLink";
import { cn } from "@/lib/utils";

export type FloatingHeaderProps = {
  logoText?: string;
  logoImageUrl?: string;
  logoImageAlt?: string;
  navItems?: NavItem[];
  activeLabel?: string;
  /** `light` (por defecto) para flotar sobre una foto oscura; `dark` para hacerlo
   * sobre un hero claro, donde el texto en papel sería ilegible. */
  tone?: "light" | "dark";
};

const defaultNavItems: NavItem[] = [
  { label: "Inicio" },
  { label: "Tienda" },
  { label: "Suscripción" },
  { label: "Nosotros" },
];

/** Transparent glass header meant to float on top of a full-bleed hero photo. Mockup ref: 1b. */
export function FloatingHeader({
  logoText,
  logoImageUrl,
  logoImageAlt,
  navItems = defaultNavItems,
  activeLabel = "Inicio",
  tone = "light",
}: FloatingHeaderProps) {
  const light = tone === "light";

  return (
    <header className="site-gutter pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 py-4 md:py-[26px] lg:[--site-gutter:3rem]">
      <div className="pointer-events-auto">
        <Logo text={logoText} imageUrl={logoImageUrl} imageAlt={logoImageAlt} tone={light ? "light" : "dark"} size="sm" />
      </div>
      <nav
        className={cn(
          "pointer-events-auto hidden gap-1.5 rounded-full border p-[7px] backdrop-blur-[14px] lg:flex",
          light ? "border-paper/22 bg-paper/14" : "border-forest/15 bg-paper-light/70",
        )}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            href={item.href}
            tone={tone}
            pill
            active={item.label === activeLabel}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

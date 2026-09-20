import { CtaButton } from "@/components/atoms/CtaButton";
import { Logo } from "@/components/atoms/Logo";
import { NavLink, type NavItem } from "@/components/atoms/NavLink";

export type FloatingHeaderProps = {
  navItems?: NavItem[];
  activeLabel?: string;
  ctaLabel?: string;
};

const defaultNavItems: NavItem[] = [
  { label: "Inicio" },
  { label: "Tienda" },
  { label: "Suscripción" },
  { label: "Nosotros" },
];

/** Transparent glass header meant to float on top of a full-bleed hero photo. Mockup ref: 1b. */
export function FloatingHeader({
  navItems = defaultNavItems,
  activeLabel = "Inicio",
  ctaLabel = "Comprar ahora",
}: FloatingHeaderProps) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-12 py-[26px]">
      <div className="pointer-events-auto">
        <Logo tone="light" size="sm" />
      </div>
      <nav className="pointer-events-auto flex gap-1.5 rounded-full border border-paper/22 bg-paper/14 p-[7px] backdrop-blur-[14px]">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            href={item.href}
            tone="light"
            pill
            active={item.label === activeLabel}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="pointer-events-auto">
        <CtaButton tone="paper" size="sm">
          {ctaLabel}
        </CtaButton>
      </div>
    </header>
  );
}

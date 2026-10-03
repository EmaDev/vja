import Link from "next/link";
import { CtaButton } from "@/components/atoms/CtaButton";
import { Logo } from "@/components/atoms/Logo";
import type { NavItem } from "@/components/atoms/NavLink";

export type StandardHeaderProps = {
  logoText?: string;
  logoImageUrl?: string;
  logoImageAlt?: string;
  navLeft?: NavItem[];
  ctaLabel?: string;
};

const defaultNavLeft: NavItem[] = [
  { label: "Interior" },
  { label: "Exterior" },
  { label: "Flores" },
  { label: "Accesorios" },
];

const pillClasses = "border-[#CFC6B0] text-[#3A4A3C]";

/** Non-floating shop header with search/account pills and a contact CTA. Mockup ref: 1d.
 * En mobile el logo va primero y la navegación pasa a una fila con scroll horizontal. */
export function StandardHeader({
  logoText,
  logoImageUrl,
  logoImageAlt,
  navLeft = defaultNavLeft,
  ctaLabel = "Contacto",
}: StandardHeaderProps) {
  return (
    <header className="site-gutter flex flex-wrap items-center justify-between gap-y-3 border-b border-[#E2DAC7] bg-paper py-4 md:py-5">
      <nav className="order-3 -mx-5 flex w-screen gap-6 overflow-x-auto px-5 text-sm tracking-[0.03em] text-[#3A4A3C] md:order-none md:mx-0 md:w-auto md:flex-1 md:gap-7 md:overflow-visible md:px-0">
        {navLeft.map((item) => (
          <Link
            key={item.label}
            href={item.href ?? "#"}
            className="shrink-0 transition-colors hover:text-forest"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <Logo text={logoText} imageUrl={logoImageUrl} imageAlt={logoImageAlt} size="sm" />
      <div className="flex gap-2.5 md:flex-1 md:justify-end">
        <CtaButton tone="forest" variant="outline" shape="pill" size="sm" className={`hidden sm:inline-flex ${pillClasses}`}>
          Buscar
        </CtaButton>
        <CtaButton href="#contacto" tone="forest" shape="pill" size="sm" className="bg-sage">
          {ctaLabel}
        </CtaButton>
      </div>
    </header>
  );
}

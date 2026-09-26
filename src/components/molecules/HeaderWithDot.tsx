import Link from "next/link";
import { CtaButton } from "@/components/atoms/CtaButton";

export type HeaderWithDotNavItem = {
  label: string;
  href?: string;
  active?: boolean;
};

export type HeaderWithDotProps = {
  logoText?: string;
  navItems?: HeaderWithDotNavItem[];
  ctaLabel?: string;
};

const defaultNavItems: HeaderWithDotNavItem[] = [
  { label: "Plantas", active: true },
  { label: "Flores" },
  { label: "Regalos" },
  { label: "Taller" },
];

/** Header with a solid logo mark, underlined active tab and a boxed contact CTA. Mockup ref: 1c. */
export function HeaderWithDot({
  logoText = "VJA Plantas",
  navItems = defaultNavItems,
  ctaLabel = "Contacto",
}: HeaderWithDotProps) {
  return (
    <header className="site-gutter flex flex-wrap items-center justify-between gap-y-3 bg-paper-light py-4 md:py-6">
      <div className="flex items-center gap-3 md:gap-3.5">
        <div className="h-[26px] w-[26px] rounded-full bg-sage md:h-[34px] md:w-[34px]" />
        <span className="font-display text-[21px] text-forest md:text-[25px]">{logoText}</span>
      </div>
      <nav className="order-3 -mx-5 flex w-screen gap-6 overflow-x-auto px-5 pb-1 text-[15px] text-[#2F3A30] md:order-none md:mx-0 md:w-auto md:gap-[34px] md:overflow-visible md:px-0 md:pb-0">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href ?? "#"}
            className={
              item.active
                ? "shrink-0 border-b-2 border-terracotta pb-[3px]"
                : "shrink-0 transition-colors hover:text-forest"
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <CtaButton href="#contacto" tone="forest" variant="outline" shape="rounded" size="sm">
        {ctaLabel}
      </CtaButton>
    </header>
  );
}

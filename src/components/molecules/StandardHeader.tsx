import Link from "next/link";
import { CtaButton } from "@/components/atoms/CtaButton";
import { Logo } from "@/components/atoms/Logo";
import type { NavItem } from "@/components/molecules/SiteHeaderCentered";

export type StandardHeaderProps = {
  navLeft?: NavItem[];
  cartCount?: number;
};

const defaultNavLeft: NavItem[] = [
  { label: "Interior" },
  { label: "Exterior" },
  { label: "Flores" },
  { label: "Accesorios" },
];

/** Non-floating shop header with search/account pills and a cart CTA. Mockup ref: 1d. */
export function StandardHeader({ navLeft = defaultNavLeft, cartCount = 2 }: StandardHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-[#E2DAC7] bg-paper px-14 py-5">
      <nav className="flex flex-1 gap-7 text-sm tracking-[0.03em] text-[#3A4A3C]">
        {navLeft.map((item) => (
          <Link key={item.label} href={item.href ?? "#"}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Logo size="sm" />
      <div className="flex flex-1 justify-end gap-2.5">
        <CtaButton tone="forest" variant="outline" shape="pill" size="sm" className="border-[#CFC6B0] text-[#3A4A3C]">
          Buscar
        </CtaButton>
        <CtaButton tone="forest" variant="outline" shape="pill" size="sm" className="border-[#CFC6B0] text-[#3A4A3C]">
          Cuenta
        </CtaButton>
        <CtaButton tone="forest" shape="pill" size="sm" className="bg-sage">
          Carrito · {cartCount}
        </CtaButton>
      </div>
    </header>
  );
}

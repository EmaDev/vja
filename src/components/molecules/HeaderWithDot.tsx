import Link from "next/link";
import { CtaButton } from "@/components/atoms/CtaButton";

export type HeaderWithDotNavItem = {
  label: string;
  href?: string;
  active?: boolean;
};

export type HeaderWithDotProps = {
  navItems?: HeaderWithDotNavItem[];
  cartCount?: number;
};

const defaultNavItems: HeaderWithDotNavItem[] = [
  { label: "Plantas", active: true },
  { label: "Flores" },
  { label: "Regalos" },
  { label: "Taller" },
];

/** Header with a solid logo mark, underlined active tab and a boxed cart CTA. Mockup ref: 1c. */
export function HeaderWithDot({ navItems = defaultNavItems, cartCount = 2 }: HeaderWithDotProps) {
  return (
    <header className="flex items-center justify-between bg-paper-light px-14 py-6">
      <div className="flex items-center gap-3.5">
        <div className="h-[34px] w-[34px] rounded-full bg-sage" />
        <span className="font-display text-[25px] text-forest">Raíz &amp; Pétalo</span>
      </div>
      <nav className="flex gap-[34px] text-[15px] text-[#2F3A30]">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href ?? "#"}
            className={item.active ? "border-b-2 border-terracotta pb-[3px]" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-[18px]">
        <Link href="#" className="text-[15px] text-[#2F3A30]">
          Ingresar
        </Link>
        <CtaButton tone="forest" variant="outline" shape="rounded" size="sm">
          Carrito · {cartCount}
        </CtaButton>
      </div>
    </header>
  );
}

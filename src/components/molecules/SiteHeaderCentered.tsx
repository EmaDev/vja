import Link from "next/link";
import { Logo } from "@/components/atoms/Logo";
import type { NavItem } from "@/components/atoms/NavLink";

export type { NavItem };

export type SiteHeaderCenteredProps = {
  navLeft?: NavItem[];
  navRight?: NavItem[];
  cartCount?: number;
};

const defaultNavLeft: NavItem[] = [
  { label: "Plantas" },
  { label: "Ramos" },
  { label: "Macetas" },
];

const defaultNavRight: NavItem[] = [{ label: "Cuidados" }, { label: "Buscar" }];

/** Editorial header with the wordmark centered between two nav clusters. Mockup ref: 1a. */
export function SiteHeaderCentered({
  navLeft = defaultNavLeft,
  navRight = defaultNavRight,
  cartCount = 2,
}: SiteHeaderCenteredProps) {
  return (
    <header className="border-b border-line bg-paper">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-14 py-[22px]">
        <nav className="flex gap-[30px] text-sm tracking-[0.04em] text-[#3A4A3C]">
          {navLeft.map((item) => (
            <Link key={item.label} href={item.href ?? "#"}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Logo align="center" showTagline />
        <div className="flex justify-end gap-[26px] text-sm text-[#3A4A3C]">
          {navRight.map((item) => (
            <Link key={item.label} href={item.href ?? "#"}>
              {item.label}
            </Link>
          ))}
          <Link href="#" className="font-medium text-forest">
            Carrito ({cartCount})
          </Link>
        </div>
      </div>
    </header>
  );
}

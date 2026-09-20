import Link from "next/link";
import { CtaButton } from "@/components/atoms/CtaButton";
import { Logo } from "@/components/atoms/Logo";
import type { NavItem } from "@/components/molecules/SiteHeaderCentered";

export type SidebarNavProps = {
  navItems?: (NavItem & { active?: boolean })[];
  cartCount?: number;
  address?: string;
  hours?: string;
};

const defaultNavItems: (NavItem & { active?: boolean })[] = [
  { label: "Catálogo", active: true },
  { label: "Flores frescas" },
  { label: "Suscripción" },
  { label: "Cuidados" },
  { label: "Nosotros" },
];

/** Fixed dark sidebar navigation for full-height layouts. Mockup ref: 1e. */
export function SidebarNav({
  navItems = defaultNavItems,
  cartCount = 2,
  address = "Av. Libertador 4820",
  hours = "Mar–Dom · 10 a 19 h",
}: SidebarNavProps) {
  return (
    <aside className="flex flex-col justify-between border-r border-paper/16 px-[26px] py-8">
      <div>
        <Logo tone="light" stacked />
        <nav className="mt-[52px] flex flex-col gap-[3px]">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href ?? "#"}
              className={
                item.active
                  ? "rounded-md bg-paper/10 px-3 py-[10px] text-[15px] text-paper"
                  : "rounded-md px-3 py-[10px] text-[15px] text-[#C7CFC1]"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex flex-col gap-3">
        <CtaButton tone="paper" size="sm" className="text-center">
          Carrito · {cartCount}
        </CtaButton>
        <span className="text-xs leading-relaxed text-[#8FA68A]">
          {address}
          <br />
          {hours}
        </span>
      </div>
    </aside>
  );
}

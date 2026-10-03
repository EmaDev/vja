import Link from "next/link";
import { Logo } from "@/components/atoms/Logo";
import type { NavItem } from "@/components/atoms/NavLink";

export type { NavItem };

export type SiteHeaderCenteredProps = {
  logoText?: string;
  logoImageUrl?: string;
  logoImageAlt?: string;
  navLeft?: NavItem[];
  navRight?: NavItem[];
};

const defaultNavLeft: NavItem[] = [
  { label: "Plantas" },
  { label: "Ramos" },
  { label: "Macetas" },
];

const defaultNavRight: NavItem[] = [{ label: "Cuidados" }, { label: "Buscar" }];

function NavCluster({ items, className }: { items: NavItem[]; className?: string }) {
  return (
    <nav className={className}>
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href ?? "#"}
          className="shrink-0 transition-colors hover:text-forest"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

/** Editorial header with the wordmark centered between two nav clusters. Mockup ref: 1a.
 * Debajo de `md` los dos grupos de navegación se funden en una sola fila bajo el logo:
 * a ese ancho no entran tres zonas en la misma línea. */
export function SiteHeaderCentered({
  logoText,
  logoImageUrl,
  logoImageAlt,
  navLeft = defaultNavLeft,
  navRight = defaultNavRight,
}: SiteHeaderCenteredProps) {
  // Sin `flex` ni `gap` acá: cada cluster los declara, para no dejar dos
  // utilidades de la misma propiedad compitiendo en el mismo className.
  const baseNav = "text-sm tracking-[0.04em] text-[#3A4A3C]";

  return (
    <header className="border-b border-line bg-paper">
      <div className="site-gutter flex flex-col items-center gap-4 py-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-0 md:py-[22px]">
        <NavCluster items={navLeft} className={`${baseNav} hidden gap-[30px] md:flex`} />
        <Logo text={logoText} imageUrl={logoImageUrl} imageAlt={logoImageAlt} align="center" showTagline />
        <NavCluster
          items={navRight}
          className={`${baseNav} hidden justify-end gap-[26px] md:flex`}
        />
        <NavCluster
          items={[...navLeft, ...navRight]}
          className={`${baseNav} flex w-full flex-wrap justify-center gap-x-[30px] gap-y-2 md:hidden`}
        />
      </div>
    </header>
  );
}

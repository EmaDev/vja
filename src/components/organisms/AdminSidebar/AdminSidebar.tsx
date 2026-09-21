"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { SAVE_STATUS_LABEL, useCmsDraft } from "@/lib/cms/draft-context";
import { DESIGN_TABS, CONTENT_TABS, resolveTab, isDesignTab, isContentTab } from "@/lib/cms/tabs";
import { mockProducts } from "@/lib/cms/product-mock-data";
import { logout } from "@/lib/auth/actions";

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pb-[7px] text-[10px] uppercase tracking-[0.2em] text-[#6E8569]">{children}</div>
  );
}

function NavButton({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-md px-3 py-[10px] text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage",
        active ? "bg-paper/12 text-paper" : "text-[#C7CFC1] hover:text-paper",
      )}
    >
      {children}
    </Link>
  );
}

function SubNavButton({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-md py-[8px] pl-4 pr-3 text-[13px] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage",
        active ? "bg-paper/12 text-paper" : "text-[#AEB7A7] hover:text-paper",
      )}
    >
      {children}
    </Link>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { saveStatus } = useCmsDraft();

  const onCms = pathname === "/cms";
  const onProducts = pathname.startsWith("/cms/productos");
  const activeTab = resolveTab(searchParams.get("tab"));

  return (
    <aside className="flex flex-col gap-5 bg-forest px-5 py-5 lg:sticky lg:top-0 lg:h-screen lg:w-[252px] lg:shrink-0 lg:justify-between lg:py-[26px]">
      <div className="flex flex-col gap-5 lg:gap-[30px]">
        <Link
          href="/cms"
          className="flex items-center gap-[11px] rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
        >
          <div className="h-[30px] w-[30px] shrink-0 rounded-full bg-sage" />
          <div>
            <div className="font-display text-xl leading-[1.1] text-paper">Raíz &amp; Pétalo</div>
            <div className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-[#7E9479]">
              Editor del sitio
            </div>
          </div>
        </Link>

        <nav className="flex flex-row flex-wrap gap-x-7 gap-y-4 lg:flex-col lg:gap-[22px]">
          <div className="flex flex-col gap-[3px]">
            <GroupLabel>Catálogo</GroupLabel>
            <NavButton href="/cms/productos" active={onProducts}>
              Productos
            </NavButton>
            <NavButton href="/cms/productos" active={false}>
              Categorías
            </NavButton>
            <NavButton href="/cms/productos" active={false}>
              Biblioteca de medios
            </NavButton>
          </div>

          <div className="flex flex-col gap-[3px]">
            <GroupLabel>Sitio</GroupLabel>

            <NavButton href="/cms?tab=header" active={onCms && isDesignTab(activeTab)}>
              Diseño
            </NavButton>
            {onCms && isDesignTab(activeTab) ? (
              <div className="ml-3 flex flex-col gap-[2px] border-l border-paper/10 pl-2">
                {DESIGN_TABS.map((item) => (
                  <SubNavButton key={item.tab} href={`/cms?tab=${item.tab}`} active={activeTab === item.tab}>
                    {item.label}
                  </SubNavButton>
                ))}
              </div>
            ) : null}

            <NavButton href="/cms?tab=contacto" active={onCms && isContentTab(activeTab)}>
              Contenido
            </NavButton>
            {onCms && isContentTab(activeTab) ? (
              <div className="ml-3 flex flex-col gap-[2px] border-l border-paper/10 pl-2">
                {CONTENT_TABS.map((item) => (
                  <SubNavButton key={item.tab} href={`/cms?tab=${item.tab}`} active={activeTab === item.tab}>
                    {item.label}
                  </SubNavButton>
                ))}
              </div>
            ) : null}
          </div>
        </nav>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="rounded-lg border border-paper/16 bg-paper/[0.08] p-3.5">
          {onProducts ? (
            <>
              <div className="text-xs text-[#C7CFC1]">Catálogo publicado</div>
              <div className="mt-[3px] text-[13px] text-paper">
                {mockProducts.length} productos · {mockProducts.filter((p) => p.status === "draft").length} borradores
              </div>
            </>
          ) : (
            <>
              <div className="text-xs leading-[1.5] text-[#C7CFC1]">Último guardado</div>
              <div className="mt-[3px] text-[13px] text-paper">{SAVE_STATUS_LABEL[saveStatus]}</div>
            </>
          )}
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="px-3 text-[13px] text-[#8FA68A] transition-colors hover:text-paper"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}

"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { SAVE_STATUS_LABEL, useCmsDraft } from "@/lib/cms/draft-context";
import {
  DESIGN_TABS,
  SECTION_TABS,
  CONTENT_TABS,
  resolveTab,
  isDesignTab,
  isSectionTab,
  isContentTab,
} from "@/lib/cms/tabs";
import { logout } from "@/lib/auth/actions";
import {
  ChevronIcon,
  CloseIcon,
  ExternalIcon,
  LayersIcon,
  LeafIcon,
  LogoutIcon,
  MegaphoneIcon,
  MenuIcon,
  PaletteIcon,
  TagsIcon,
  TextIcon,
  type IconProps,
} from "./icons";

/** Totales del catálogo, calculados en el servidor. */
export interface CatalogTotals {
  total: number;
  drafts: number;
}

/** Promociones cargadas y cuántas de ellas corren hoy. El conteo de activas se
 * hace en el servidor: la barra lateral sólo informa, no decide nada. */
export interface PromotionTotals {
  total: number;
  active: number;
}

export interface AdminSidebarProps {
  products: CatalogTotals;
  categories: CatalogTotals;
  promotions: PromotionTotals;
}

type GroupId = "diseno" | "secciones" | "contenido";

const SAVE_STATUS_DOT: Record<string, string> = {
  saved: "bg-sage",
  pending: "bg-terracotta",
  saving: "bg-[#D6A24A]",
  error: "bg-terracotta",
};

/* ── Piezas de la navegación ─────────────────────────────────────────────── */

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pb-2 pt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#728A6D]">
      {children}
    </div>
  );
}

/** Barra de color sobre el borde izquierdo de la fila activa. Es el indicador
 * que sobrevive a un modo de contraste forzado, donde el fondo translúcido del
 * pill puede perderse del todo. */
function ActiveBar() {
  return (
    <span
      aria-hidden
      className="absolute left-0 top-1/2 h-[18px] w-[3px] -translate-y-1/2 rounded-r-full bg-terracotta"
    />
  );
}

function CountBadge({ value, muted }: { value: number; muted?: boolean }) {
  return (
    <span
      className={cn(
        "ml-auto shrink-0 rounded-full px-[7px] py-[1px] text-[11px] leading-[17px] tabular-nums",
        muted ? "text-[#8BA085]" : "bg-paper/10 text-[#C2CCBC]",
      )}
    >
      {value}
    </span>
  );
}

/** Fila simple: un destino, sin hijos. */
function NavRow({
  href,
  active,
  icon: Icon,
  label,
  badge,
  drafts,
  onNavigate,
}: {
  href: string;
  active: boolean;
  icon: (props: IconProps) => React.ReactNode;
  label: string;
  badge?: number;
  drafts?: number;
  onNavigate: () => void;
}) {
  return (
    <li className="relative">
      {active ? <ActiveBar /> : null}
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-2.5 rounded-[10px] py-[9px] pl-3 pr-2.5 text-sm transition-colors duration-150",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage",
          active
            ? "bg-paper/[0.1] font-medium text-paper"
            : "text-[#C2CCBC] hover:bg-paper/[0.05] hover:text-paper",
        )}
      >
        <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-paper" : "text-[#8FA68A]")} />
        <span className="truncate">{label}</span>
        {typeof badge === "number" ? <CountBadge value={badge} /> : null}
        {drafts ? (
          <span
            title={`${drafts} sin publicar`}
            className="h-[6px] w-[6px] shrink-0 rounded-full bg-terracotta"
          />
        ) : null}
      </Link>
    </li>
  );
}

/** Cabecera de un grupo desplegable.
 *
 * Son dos controles en una sola fila a propósito: el texto navega al primer
 * editor del grupo y el chevron sólo abre o cierra. Así el clic obvio —sobre el
 * nombre— sigue llevando a algún lado, y quien quiera espiar el contenido sin
 * moverse de donde está tiene un botón explícito para hacerlo. */
function GroupToggle({
  href,
  active,
  open,
  panelId,
  icon: Icon,
  label,
  count,
  onNavigate,
  onToggle,
}: {
  href: string;
  active: boolean;
  open: boolean;
  panelId: string;
  icon: (props: IconProps) => React.ReactNode;
  label: string;
  count: number;
  onNavigate: () => void;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center rounded-[10px] pr-1 transition-colors duration-150",
        active ? "bg-paper/[0.1]" : "hover:bg-paper/[0.05]",
      )}
    >
      {active ? <ActiveBar /> : null}
      <Link
        href={href}
        onClick={onNavigate}
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2.5 rounded-[10px] py-[9px] pl-3 pr-1 text-sm transition-colors duration-150",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage",
          active ? "font-medium text-paper" : "text-[#C2CCBC] hover:text-paper",
        )}
      >
        <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-paper" : "text-[#8FA68A]")} />
        <span className="truncate">{label}</span>
      </Link>
      {open ? null : <CountBadge value={count} muted />}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${open ? "Contraer" : "Desplegar"} ${label}`}
        className={cn(
          "ml-1 grid h-7 w-7 shrink-0 place-items-center rounded-md transition-colors duration-150",
          "text-[#8FA68A] hover:bg-paper/10 hover:text-paper",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage",
        )}
      >
        <ChevronIcon className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-90")} />
      </button>
    </div>
  );
}

/** Contenido de un grupo. La animación va sobre `grid-template-rows` (0fr → 1fr)
 * y no sobre una altura fija: el panel crece o se encoge sin que nadie tenga
 * que medir nada, y no hay salto cuando cambia la cantidad de ítems. */
function GroupPanel({
  id,
  open,
  children,
}: {
  id: string;
  open: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className={cn(
        "grid transition-[grid-template-rows] duration-200 ease-out",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
    >
      {/* `inert` saca del orden de tabulación los enlaces de un grupo cerrado:
          siguen en el DOM —es lo que permite animar el alto— pero el teclado ya
          no cae dentro de una caja de 0px de alto. */}
      <div className="overflow-hidden" inert={!open}>
        <ul className="ml-[21px] mt-[3px] flex flex-col gap-[2px] border-l border-paper/[0.14] pb-1 pl-2">
          {children}
        </ul>
      </div>
    </div>
  );
}

function SubRow({
  href,
  active,
  label,
  onNavigate,
}: {
  href: string;
  active: boolean;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-2 rounded-[8px] py-[7px] pl-2 pr-2.5 text-[13px] transition-colors duration-150",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage",
          active
            ? "bg-paper/[0.1] font-medium text-paper"
            : "text-[#A8B4A2] hover:bg-paper/[0.05] hover:text-paper",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "h-[5px] w-[5px] shrink-0 rounded-full transition-colors",
            active ? "bg-terracotta" : "bg-paper/25",
          )}
        />
        <span className="truncate">{label}</span>
      </Link>
    </li>
  );
}

/* ── Barra lateral ───────────────────────────────────────────────────────── */

export function AdminSidebar({ products, categories, promotions }: AdminSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { saveStatus } = useCmsDraft();
  const panelIdBase = useId();
  const sidebarId = `${panelIdBase}-sidebar`;

  const [mobileOpen, setMobileOpen] = useState(false);
  /** Sólo guarda los grupos que la persona abrió o cerró a mano. Lo que no está
   * acá se deduce de la ruta, así que el grupo de la pantalla actual aparece
   * abierto sin necesidad de un efecto que sincronice estado con la URL. */
  const [overrides, setOverrides] = useState<Partial<Record<GroupId, boolean>>>({});

  const onCms = pathname === "/cms";
  const onProducts = pathname.startsWith("/cms/productos");
  const onCategories = pathname.startsWith("/cms/categorias");
  const onPromotions = pathname.startsWith("/cms/promociones");
  const activeTab = resolveTab(searchParams.get("tab"));

  const groupActive: Record<GroupId, boolean> = {
    diseno: onCms && isDesignTab(activeTab),
    secciones: onCms && isSectionTab(activeTab),
    contenido: onCms && isContentTab(activeTab),
  };

  const isOpen = (id: GroupId) => overrides[id] ?? groupActive[id];
  const toggle = (id: GroupId) =>
    setOverrides((current) => ({ ...current, [id]: !(current[id] ?? groupActive[id]) }));

  // El cajón de mobile se cierra solo al navegar, incluso con el botón "atrás"
  // del navegador. El ajuste va durante el render y no en un efecto: así no hay
  // un frame con el cajón abierto sobre la pantalla nueva. Se compara la URL
  // serializada porque el objeto de `useSearchParams` cambia de identidad en
  // cada render.
  const navKey = `${pathname}?${searchParams.toString()}`;
  const [lastNavKey, setLastNavKey] = useState(navKey);
  if (lastNavKey !== navKey) {
    setLastNavKey(navKey);
    if (mobileOpen) setMobileOpen(false);

    // El grupo de la pantalla a la que se llega olvida que lo habían cerrado a
    // mano. Si no, al volver a un editor de ese grupo la fila aparecería
    // marcada como activa pero plegada, sin mostrar en cuál de sus pantallas
    // está parada la persona.
    const nowActive = (Object.keys(groupActive) as GroupId[]).find((id) => groupActive[id]);
    if (nowActive && overrides[nowActive] === false) {
      setOverrides((current) => {
        const next = { ...current };
        delete next[nowActive];
        return next;
      });
    }
  }

  useEffect(() => {
    if (!mobileOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const brand = (
    <Link
      href="/cms"
      onClick={closeMobile}
      className="flex min-w-0 items-center gap-[11px] rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
    >
      <span className="grid h-[32px] w-[32px] shrink-0 place-items-center rounded-full bg-sage text-paper">
        <LeafIcon className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-display text-xl leading-[1.1] text-paper">VJA Plantas</span>
        <span className="mt-0.5 block text-[10px] uppercase tracking-[0.22em] text-[#7E9479]">
          Editor del sitio
        </span>
      </span>
    </Link>
  );

  const nav = (
    <nav aria-label="Secciones del panel" className="flex flex-col gap-5">
      <div>
        <GroupLabel>Catálogo</GroupLabel>
        <ul className="flex flex-col gap-[2px]">
          <NavRow
            href="/cms/productos"
            active={onProducts}
            icon={LeafIcon}
            label="Productos"
            badge={products.total}
            drafts={products.drafts}
            onNavigate={closeMobile}
          />
          <NavRow
            href="/cms/categorias"
            active={onCategories}
            icon={TagsIcon}
            label="Categorías"
            badge={categories.total}
            drafts={categories.drafts}
            onNavigate={closeMobile}
          />
        </ul>
      </div>

      <div>
        <GroupLabel>Sitio</GroupLabel>
        <ul className="flex flex-col gap-[2px]">
          <NavRow
            href="/cms/promociones"
            active={onPromotions}
            icon={MegaphoneIcon}
            label="Promocional"
            badge={promotions.total}
            onNavigate={closeMobile}
          />

          <li>
            <GroupToggle
              href="/cms?tab=header"
              active={groupActive.diseno}
              open={isOpen("diseno")}
              panelId={`${panelIdBase}-diseno`}
              icon={PaletteIcon}
              label="Diseño"
              count={DESIGN_TABS.length}
              onNavigate={closeMobile}
              onToggle={() => toggle("diseno")}
            />
            <GroupPanel id={`${panelIdBase}-diseno`} open={isOpen("diseno")}>
              {DESIGN_TABS.map((item) => (
                <SubRow
                  key={item.tab}
                  href={`/cms?tab=${item.tab}`}
                  active={onCms && activeTab === item.tab}
                  label={item.label}
                  onNavigate={closeMobile}
                />
              ))}
            </GroupPanel>
          </li>

          <li>
            <GroupToggle
              href="/cms?tab=nosotros"
              active={groupActive.secciones}
              open={isOpen("secciones")}
              panelId={`${panelIdBase}-secciones`}
              icon={LayersIcon}
              label="Secciones"
              count={SECTION_TABS.length}
              onNavigate={closeMobile}
              onToggle={() => toggle("secciones")}
            />
            <GroupPanel id={`${panelIdBase}-secciones`} open={isOpen("secciones")}>
              {SECTION_TABS.map((item) => (
                <SubRow
                  key={item.tab}
                  href={`/cms?tab=${item.tab}`}
                  active={onCms && activeTab === item.tab}
                  label={item.label}
                  onNavigate={closeMobile}
                />
              ))}
            </GroupPanel>
          </li>

          <li>
            <GroupToggle
              href="/cms?tab=contacto"
              active={groupActive.contenido}
              open={isOpen("contenido")}
              panelId={`${panelIdBase}-contenido`}
              icon={TextIcon}
              label="Contenido"
              count={CONTENT_TABS.length}
              onNavigate={closeMobile}
              onToggle={() => toggle("contenido")}
            />
            <GroupPanel id={`${panelIdBase}-contenido`} open={isOpen("contenido")}>
              {CONTENT_TABS.map((item) => (
                <SubRow
                  key={item.tab}
                  href={`/cms?tab=${item.tab}`}
                  active={onCms && activeTab === item.tab}
                  label={item.label}
                  onNavigate={closeMobile}
                />
              ))}
            </GroupPanel>
          </li>
        </ul>
      </div>
    </nav>
  );

  const statusCard = onPromotions ? (
    <>
      <div className="text-[11px] uppercase tracking-[0.14em] text-[#8FA68A]">Promociones</div>
      <div className="mt-1 text-[13px] leading-[1.45] text-paper">
        {promotions.total} cargadas · {promotions.active} activa
        {promotions.active === 1 ? "" : "s"} hoy
      </div>
    </>
  ) : onCategories ? (
    <>
      <div className="text-[11px] uppercase tracking-[0.14em] text-[#8FA68A]">Catálogo agrupado</div>
      <div className="mt-1 text-[13px] leading-[1.45] text-paper">
        {categories.total} categorías · {categories.drafts} borradores
      </div>
    </>
  ) : onProducts ? (
    <>
      <div className="text-[11px] uppercase tracking-[0.14em] text-[#8FA68A]">Catálogo publicado</div>
      <div className="mt-1 text-[13px] leading-[1.45] text-paper">
        {products.total} productos · {products.drafts} borradores
      </div>
    </>
  ) : (
    <>
      <div className="text-[11px] uppercase tracking-[0.14em] text-[#8FA68A]">Último guardado</div>
      <div className="mt-1 flex items-center gap-2 text-[13px] leading-[1.45] text-paper">
        <span
          aria-hidden
          className={cn(
            "h-[7px] w-[7px] shrink-0 rounded-full",
            SAVE_STATUS_DOT[saveStatus] ?? "bg-sage",
            saveStatus === "saving" && "animate-pulse",
          )}
        />
        {SAVE_STATUS_LABEL[saveStatus]}
      </div>
    </>
  );

  const footer = (
    <div className="flex flex-col gap-2.5">
      <div className="rounded-xl border border-paper/[0.14] bg-paper/[0.07] px-3.5 py-3">{statusCard}</div>
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-[7px] rounded-md px-2 py-1.5 text-[13px] text-[#8FA68A] transition-colors hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
        >
          <ExternalIcon className="h-4 w-4" />
          Ver sitio
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="inline-flex items-center gap-[7px] rounded-md px-2 py-1.5 text-[13px] text-[#8FA68A] transition-colors hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
          >
            <LogoutIcon className="h-4 w-4" />
            Salir
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Barra superior de mobile: fija, para que el menú esté a un toque sin
          importar cuánto se haya bajado en la página. El `pt-14` del `<main>`
          en el layout le hace lugar. */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-paper/10 bg-forest px-4 lg:hidden">
        {brand}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú del panel"
          aria-expanded={mobileOpen}
          aria-controls={sidebarId}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-paper transition-colors hover:bg-paper/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>

      {mobileOpen ? (
        <div
          onClick={closeMobile}
          aria-hidden
          className="fixed inset-0 z-40 bg-forest-deep/60 backdrop-blur-[2px] lg:hidden"
        />
      ) : null}

      <aside
        id={sidebarId}
        aria-label="Navegación del panel"
        className={cn(
          "flex flex-col bg-forest",
          // Hasta `lg` es un cajón: todo lo que lo posiciona va bajo `max-lg:`,
          // así en escritorio esas reglas ni se emiten y no hace falta anular
          // un `inset` o un `translate` con otra utilidad que lo pise.
          "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-50 max-lg:w-[86vw] max-lg:max-w-[300px]",
          // `visibility` entra en la transición junto al `transform` porque es
          // lo que saca del orden de tabulación al cajón cerrado: sin eso los
          // enlaces siguen siendo enfocables fuera de la pantalla. Al cerrarse
          // se mantiene visible durante toda la animación —así se comporta
          // `visibility` al interpolar— y recién al final desaparece.
          "max-lg:transition-[transform,visibility] max-lg:duration-200 max-lg:ease-out",
          mobileOpen
            ? "max-lg:visible max-lg:translate-x-0 max-lg:shadow-[0_0_60px_rgba(0,0,0,0.45)]"
            : "max-lg:invisible max-lg:-translate-x-full",
          // En escritorio es una columna más de la grilla del layout: pegada
          // arriba y tan alta como la ventana.
          "lg:sticky lg:top-0 lg:h-screen",
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 px-5 pb-4 pt-5 lg:pt-[26px]">
          {brand}
          <button
            type="button"
            onClick={closeMobile}
            aria-label="Cerrar menú del panel"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[#8FA68A] transition-colors hover:bg-paper/10 hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage lg:hidden"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* El único tramo que scrollea. Antes la barra entera era `h-screen` sin
            overflow: con los tres grupos abiertos el pie y los últimos enlaces
            quedaban fuera de la pantalla, sin forma de llegar a ellos. */}
        <div className="cms-sidebar-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-1">
          {nav}
        </div>

        <div className="shrink-0 border-t border-paper/10 px-5 pb-5 pt-4">{footer}</div>
      </aside>
    </>
  );
}

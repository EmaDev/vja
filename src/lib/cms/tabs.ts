export type DesignTab = "header" | "hero" | "cards";
export type ContentTab = "contacto" | "footer" | "seo";
export type CmsTab = DesignTab | ContentTab;

export const DESIGN_TABS: { tab: DesignTab; label: string }[] = [
  { tab: "header", label: "Header" },
  { tab: "hero", label: "Hero" },
  { tab: "cards", label: "Cards de producto" },
];

export const CONTENT_TABS: { tab: ContentTab; label: string }[] = [
  { tab: "contacto", label: "Datos de contacto" },
  { tab: "footer", label: "Footer" },
  { tab: "seo", label: "SEO y social" },
];

export const DEFAULT_TAB: CmsTab = "header";

const DESIGN_TAB_SET = new Set<string>(DESIGN_TABS.map((t) => t.tab));
const CONTENT_TAB_SET = new Set<string>(CONTENT_TABS.map((t) => t.tab));

export function isDesignTab(tab: string): tab is DesignTab {
  return DESIGN_TAB_SET.has(tab);
}

export function isContentTab(tab: string): tab is ContentTab {
  return CONTENT_TAB_SET.has(tab);
}

export function resolveTab(value: string | null): CmsTab {
  if (value && (isDesignTab(value) || isContentTab(value))) return value;
  return DEFAULT_TAB;
}

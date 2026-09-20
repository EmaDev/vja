"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Button, Dropdown, type DropdownItem } from "lib-kit-components";
import type { CmsSection } from "@/lib/cms/types";
import { sectionTemplates } from "@/lib/cms/section-templates";
import { HeaderIcon, HeroIcon, FooterIcon, LayersIcon, PlusIcon } from "@/components/atoms/icons";

interface CmsSidebarProps {
  sections: CmsSection[];
  activeId: string;
  onSelect: (id: string) => void;
  onAddSection: (templateId: string) => void;
}

const iconByKind: Record<CmsSection["kind"], ReactNode> = {
  header: <HeaderIcon className="h-4 w-4" />,
  hero: <HeroIcon className="h-4 w-4" />,
  footer: <FooterIcon className="h-4 w-4" />,
  custom: <LayersIcon className="h-4 w-4" />,
};

export function CmsSidebar({ sections, activeId, onSelect, onAddSection }: CmsSidebarProps) {
  const dropdownItems: DropdownItem[] = sectionTemplates.map((template) => ({
    label: template.label,
    onClick: () => onAddSection(template.id),
  }));

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-1 border-r border-zinc-200 bg-white p-4">
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
        Secciones
      </p>
      {sections.map((section) => {
        const active = section.id === activeId;
        return (
          <div key={section.id} className="relative">
            {active ? (
              <motion.span
                layoutId="cms-sidebar-active"
                className="absolute inset-0 rounded-lg bg-primary/10"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            ) : null}
            <Button
              type="button"
              variant="ghost"
              fullWidth
              leftIcon={iconByKind[section.kind]}
              onClick={() => onSelect(section.id)}
              className={`relative z-10 justify-start! ${active ? "text-primary" : "text-zinc-600"}`}
            >
              {section.name}
            </Button>
          </div>
        );
      })}
      <div className="mt-4 border-t border-zinc-100 pt-4">
        <Dropdown
          trigger={
            <Button variant="secondary" fullWidth leftIcon={<PlusIcon className="h-4 w-4" />}>
              Agregar sección
            </Button>
          }
          items={dropdownItems}
        />
      </div>
    </aside>
  );
}

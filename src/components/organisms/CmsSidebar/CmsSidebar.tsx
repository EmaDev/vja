"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Button, Dropdown, type DropdownItem } from "lib-kit-components";
import type { CmsSection } from "@/lib/cms/types";
import { sectionTemplates } from "@/lib/cms/section-templates";
import {
  HeaderIcon,
  HeroIcon,
  FooterIcon,
  LayersIcon,
  PlusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@/components/atoms/icons";

interface CmsSidebarProps {
  sections: CmsSection[];
  activeId: string;
  onSelect: (id: string) => void;
  onAddSection: (templateId: string) => void;
  onMoveSection: (id: string, direction: "up" | "down") => void;
}

const iconByKind: Record<CmsSection["kind"], ReactNode> = {
  header: <HeaderIcon className="h-4 w-4" />,
  hero: <HeroIcon className="h-4 w-4" />,
  footer: <FooterIcon className="h-4 w-4" />,
  custom: <LayersIcon className="h-4 w-4" />,
};

export function CmsSidebar({ sections, activeId, onSelect, onAddSection, onMoveSection }: CmsSidebarProps) {
  const dropdownItems: DropdownItem[] = sectionTemplates.map((template) => ({
    label: template.label,
    onClick: () => onAddSection(template.id),
  }));

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-1 border-r border-zinc-200 bg-white p-4">
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
        Secciones
      </p>
      {sections.map((section, index) => {
        const active = section.id === activeId;
        return (
          <div key={section.id} className="relative flex items-center gap-0.5">
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
              className={`relative z-10 flex-1 justify-start! ${active ? "text-primary" : "text-zinc-600"}`}
            >
              {section.name}
            </Button>
            <div className="relative z-10 flex flex-col">
              <button
                type="button"
                onClick={() => onMoveSection(section.id, "up")}
                disabled={index === 0}
                aria-label="Subir sección"
                className="flex h-4 w-5 items-center justify-center rounded text-zinc-400 transition-colors hover:text-zinc-700 disabled:opacity-30 disabled:hover:text-zinc-400"
              >
                <ChevronUpIcon className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => onMoveSection(section.id, "down")}
                disabled={index === sections.length - 1}
                aria-label="Bajar sección"
                className="flex h-4 w-5 items-center justify-center rounded text-zinc-400 transition-colors hover:text-zinc-700 disabled:opacity-30 disabled:hover:text-zinc-400"
              >
                <ChevronDownIcon className="h-3 w-3" />
              </button>
            </div>
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

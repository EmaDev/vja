"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Switch } from "lib-kit-components";
import { CmsSidebar } from "@/components/organisms/CmsSidebar/CmsSidebar";
import { HeroEditor } from "@/components/organisms/SectionEditors/HeroEditor";
import { HeaderEditor } from "@/components/organisms/SectionEditors/HeaderEditor";
import { FooterEditor } from "@/components/organisms/SectionEditors/FooterEditor";
import { CustomSectionEditor } from "@/components/organisms/SectionEditors/CustomSectionEditor";
import { TrashIcon } from "@/components/atoms/icons";
import { initialSections } from "@/lib/cms/mock-data";
import { sectionTemplates } from "@/lib/cms/section-templates";
import type { CmsSection } from "@/lib/cms/types";

export function CmsWorkspace() {
  const [sections, setSections] = useState<CmsSection[]>(initialSections);
  const [activeId, setActiveId] = useState<string>(initialSections[0].id);

  const activeSection = sections.find((section) => section.id === activeId) ?? sections[0];

  function updateSection(updated: CmsSection) {
    setSections((current) => current.map((section) => (section.id === updated.id ? updated : section)));
  }

  function toggleVisible(id: string) {
    setSections((current) =>
      current.map((section) => (section.id === id ? { ...section, visible: !section.visible } : section)),
    );
  }

  function addSection(templateId: string) {
    const template = sectionTemplates.find((item) => item.id === templateId);
    if (!template) return;

    const id = crypto.randomUUID();
    const newSection: CmsSection = {
      id,
      kind: "custom",
      name: template.label,
      visible: true,
      templateLabel: template.label,
      title: template.label,
      content: "",
    };

    setSections((current) => [...current, newSection]);
    setActiveId(id);
  }

  function removeSection(id: string) {
    setSections((current) => current.filter((section) => section.id !== id));
    setActiveId((current) => (current === id ? sections[0].id : current));
  }

  return (
    <div className="flex min-h-0 flex-1">
      <CmsSidebar
        sections={sections}
        activeId={activeSection.id}
        onSelect={setActiveId}
        onAddSection={addSection}
      />
      <div className="flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mx-auto max-w-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">{activeSection.name}</h2>
                <p className="text-sm text-zinc-400">
                  {activeSection.kind === "custom" ? activeSection.templateLabel : "Sección fija"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={activeSection.visible}
                  onChange={() => toggleVisible(activeSection.id)}
                  label="Visible"
                />
                {activeSection.kind === "custom" ? (
                  <Button
                    size="icon"
                    variant="danger"
                    aria-label="Eliminar sección"
                    onClick={() => removeSection(activeSection.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </div>

            {activeSection.kind === "header" ? (
              <HeaderEditor section={activeSection} onChange={updateSection} />
            ) : activeSection.kind === "hero" ? (
              <HeroEditor section={activeSection} onChange={updateSection} />
            ) : activeSection.kind === "footer" ? (
              <FooterEditor section={activeSection} onChange={updateSection} />
            ) : (
              <CustomSectionEditor section={activeSection} onChange={updateSection} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

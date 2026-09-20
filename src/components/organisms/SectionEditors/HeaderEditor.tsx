"use client";

import type { HeaderSection } from "@/lib/cms/types";
import { Input } from "lib-kit-components";
import { ListEditor } from "@/components/molecules/ListEditor/ListEditor";

interface HeaderEditorProps {
  section: HeaderSection;
  onChange: (section: HeaderSection) => void;
}

export function HeaderEditor({ section, onChange }: HeaderEditorProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Texto del logo"
        value={section.logoText}
        onChange={(event) => onChange({ ...section, logoText: event.target.value })}
      />
      <div>
        <p className="mb-1.5 text-xs font-medium text-zinc-600">Enlaces de navegación</p>
        <ListEditor
          items={section.navLinks}
          onChange={(navLinks) => onChange({ ...section, navLinks })}
          addLabel="Agregar enlace"
        />
      </div>
    </div>
  );
}

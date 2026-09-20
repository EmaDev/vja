"use client";

import type { CustomSection } from "@/lib/cms/types";
import { Input, Textarea } from "lib-kit-components";

interface CustomSectionEditorProps {
  section: CustomSection;
  onChange: (section: CustomSection) => void;
}

export function CustomSectionEditor({ section, onChange }: CustomSectionEditorProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Título"
        value={section.title}
        onChange={(event) => onChange({ ...section, title: event.target.value })}
      />
      <Textarea
        label="Contenido"
        rows={5}
        value={section.content}
        onChange={(event) => onChange({ ...section, content: event.target.value })}
      />
    </div>
  );
}

"use client";

import type { FooterSection } from "@/lib/cms/types";
import { Textarea } from "lib-kit-components";
import { ListEditor } from "@/components/molecules/ListEditor/ListEditor";

interface FooterEditorProps {
  section: FooterSection;
  onChange: (section: FooterSection) => void;
}

export function FooterEditor({ section, onChange }: FooterEditorProps) {
  return (
    <div className="flex flex-col gap-4">
      <Textarea
        label="Texto del footer"
        rows={2}
        value={section.text}
        onChange={(event) => onChange({ ...section, text: event.target.value })}
      />
      <div>
        <p className="mb-1.5 text-xs font-medium text-zinc-600">Redes sociales</p>
        <ListEditor
          items={section.socialLinks}
          onChange={(socialLinks) => onChange({ ...section, socialLinks })}
          addLabel="Agregar red social"
        />
      </div>
    </div>
  );
}

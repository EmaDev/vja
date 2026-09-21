"use client";

import type { HeaderSection } from "@/lib/cms/types";
import { TextField } from "@/components/atoms/TextField";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";
import { LinksEditor } from "@/components/molecules/LinksEditor/LinksEditor";

interface HeaderEditorProps {
  section: HeaderSection;
  onChange: (section: HeaderSection) => void;
}

export function HeaderEditor({ section, onChange }: HeaderEditorProps) {
  return (
    <FieldCard title="Texto y navegación">
      <TextField
        label="Texto del logo"
        value={section.logoText}
        onChange={(event) => onChange({ ...section, logoText: event.target.value })}
      />
      <div>
        <p className="mb-[7px] text-[13px] text-ink">Enlaces de navegación</p>
        <LinksEditor
          items={section.navLinks}
          onChange={(navLinks) => onChange({ ...section, navLinks })}
          addLabel="Agregar enlace"
        />
      </div>
    </FieldCard>
  );
}

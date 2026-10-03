"use client";

import { useState } from "react";
import type { FooterSection, NavLink } from "@/lib/cms/types";
import { TextField } from "@/components/atoms/TextField";
import { SelectField } from "@/components/atoms/SelectField";
import { AdminButton } from "@/components/atoms/AdminButton";
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from "@/components/atoms/icons";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";
import { LinksEditor } from "@/components/molecules/LinksEditor/LinksEditor";

interface FooterEditorProps {
  section: FooterSection;
  onChange: (section: FooterSection) => void;
}

export function FooterEditor({ section, onChange }: FooterEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function addColumn() {
    const id = crypto.randomUUID();
    onChange({
      ...section,
      columns: [...section.columns, { id, title: "Nueva columna", links: [] }],
    });
    setExpandedId(id);
  }

  function removeColumn(id: string) {
    onChange({ ...section, columns: section.columns.filter((col) => col.id !== id) });
  }

  function renameColumn(id: string, title: string) {
    onChange({
      ...section,
      columns: section.columns.map((col) => (col.id === id ? { ...col, title } : col)),
    });
  }

  function setColumnLinks(id: string, links: NavLink[]) {
    onChange({
      ...section,
      columns: section.columns.map((col) => (col.id === id ? { ...col, links } : col)),
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <FieldCard title="Texto y marca">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          <TextField
            label="Frase de cierre"
            wide
            value={section.closingPhrase}
            onChange={(event) => onChange({ ...section, closingPhrase: event.target.value })}
          />
          <TextField
            label="Leyenda legal"
            value={section.legalText}
            onChange={(event) => onChange({ ...section, legalText: event.target.value })}
          />
          <SelectField
            label="Fondo del footer"
            value={section.background}
            onChange={(event) =>
              onChange({ ...section, background: event.target.value as FooterSection["background"] })
            }
          >
            <option value="forest">Verde profundo</option>
            <option value="paper">Papel claro</option>
          </SelectField>
        </div>
      </FieldCard>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-5">
        <FieldCard title="Columnas de enlaces">
          <div className="-mt-2 flex items-center justify-between">
            <span />
            <AdminButton variant="outline" onClick={addColumn}>
              + Columna
            </AdminButton>
          </div>
          <div className="flex flex-col gap-2.5">
            {section.columns.map((col) => {
              const expanded = expandedId === col.id;
              return (
                <div key={col.id} className="rounded-lg border border-line-light bg-paper-light p-3.5">
                  <div className="flex items-center gap-3">
                    <TextField
                      value={col.title}
                      onChange={(event) => renameColumn(col.id, event.target.value)}
                      aria-label="Título de la columna"
                      className="flex-1 py-2"
                    />
                    <span className="shrink-0 text-xs text-taupe">{col.links.length} enlaces</span>
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : col.id)}
                      aria-expanded={expanded}
                      aria-label={expanded ? "Ocultar enlaces" : "Editar enlaces"}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-taupe transition-colors hover:bg-[#EFE9DA] hover:text-forest"
                    >
                      {expanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeColumn(col.id)}
                      aria-label="Eliminar columna"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-taupe transition-colors hover:bg-terracotta/10 hover:text-terracotta"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {expanded ? (
                    <div className="mt-3 border-t border-[#EDE6D6] pt-3">
                      <LinksEditor
                        items={col.links}
                        onChange={(links) => setColumnLinks(col.id, links)}
                        addLabel="Agregar enlace"
                      />
                    </div>
                  ) : col.links.length > 0 ? (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {col.links.map((link) => (
                        <span
                          key={link.id}
                          className="rounded-full bg-[#F0EADB] px-[11px] py-[5px] text-[13px] text-ink"
                        >
                          {link.label || "Sin título"}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2.5 text-[13px] text-taupe">Todavía sin enlaces.</p>
                  )}
                </div>
              );
            })}
          </div>
        </FieldCard>

        <FieldCard title="Redes">
          <TextField
            label="Instagram"
            value={section.instagram}
            onChange={(event) => onChange({ ...section, instagram: event.target.value })}
          />
          <TextField
            label="Pinterest"
            value={section.pinterest}
            onChange={(event) => onChange({ ...section, pinterest: event.target.value })}
          />
        </FieldCard>
      </div>
    </div>
  );
}

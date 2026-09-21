"use client";

import { TextField } from "@/components/atoms/TextField";
import { AdminButton } from "@/components/atoms/AdminButton";
import { PlusIcon, TrashIcon } from "@/components/atoms/icons";
import type { NavLink } from "@/lib/cms/types";

interface LinksEditorProps {
  items: NavLink[];
  onChange: (items: NavLink[]) => void;
  addLabel: string;
}

export function LinksEditor({ items, onChange, addLabel }: LinksEditorProps) {
  function updateItem(id: string, patch: Partial<NavLink>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  function addItem() {
    onChange([...items, { id: crypto.randomUUID(), label: "", href: "" }]);
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <TextField
            value={item.label}
            onChange={(event) => updateItem(item.id, { label: event.target.value })}
            placeholder="Texto"
            className="flex-1"
          />
          <TextField
            value={item.href}
            onChange={(event) => updateItem(item.id, { href: event.target.value })}
            placeholder="URL"
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label="Eliminar enlace"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-taupe transition-colors hover:bg-terracotta/10 hover:text-terracotta"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ))}
      <AdminButton variant="outline" onClick={addItem} className="w-fit gap-1.5">
        <PlusIcon className="h-4 w-4" />
        {addLabel}
      </AdminButton>
    </div>
  );
}

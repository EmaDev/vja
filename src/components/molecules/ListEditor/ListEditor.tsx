"use client";

import { Button, Input } from "lib-kit-components";
import { PlusIcon, TrashIcon } from "@/components/atoms/icons";

export interface LinkItem {
  id: string;
  label: string;
  href: string;
}

interface ListEditorProps {
  items: LinkItem[];
  onChange: (items: LinkItem[]) => void;
  addLabel: string;
}

export function ListEditor({ items, onChange, addLabel }: ListEditorProps) {
  function updateItem(id: string, patch: Partial<LinkItem>) {
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
          <Input
            value={item.label}
            onChange={(event) => updateItem(item.id, { label: event.target.value })}
            placeholder="Texto"
            className="flex-1"
          />
          <Input
            value={item.href}
            onChange={(event) => updateItem(item.id, { href: event.target.value })}
            placeholder="URL"
            className="flex-1"
          />
          <Button size="icon" variant="danger" aria-label="Eliminar" onClick={() => removeItem(item.id)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="secondary"
        leftIcon={<PlusIcon className="h-4 w-4" />}
        onClick={addItem}
        className="self-start"
      >
        {addLabel}
      </Button>
    </div>
  );
}

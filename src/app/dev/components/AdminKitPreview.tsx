"use client";

import { useState } from "react";
import { AdminButton } from "@/components/atoms/AdminButton";
import { SegmentedControl } from "@/components/atoms/SegmentedControl";
import { SelectField } from "@/components/atoms/SelectField";
import { StatusPill } from "@/components/atoms/StatusPill";
import { TextAreaField } from "@/components/atoms/TextAreaField";
import { TextField } from "@/components/atoms/TextField";
import { ToggleSwitch } from "@/components/atoms/ToggleSwitch";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";
import { VariantPickerCard } from "@/components/molecules/VariantPickerCard/VariantPickerCard";
import { headerVariants } from "@/lib/cms/header-variants";

/** Vitrina de los componentes del panel; vive acá porque necesitan estado. */
export function AdminKitPreview() {
  const [layout, setLayout] = useState<"grid" | "rows">("grid");
  const [featured, setFeatured] = useState(true);
  const [variant, setVariant] = useState(headerVariants[2].id);

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-wrap items-center gap-3">
        <AdminButton variant="solid">Publicar</AdminButton>
        <AdminButton variant="outline">Vista previa</AdminButton>
        <AdminButton variant="danger-outline">Eliminar producto</AdminButton>
        <AdminButton variant="outline" disabled>
          Deshabilitado
        </AdminButton>
        <SegmentedControl
          options={[
            { value: "grid", label: "Galería" },
            { value: "rows", label: "Lista" },
          ]}
          value={layout}
          onChange={setLayout}
        />
        <ToggleSwitch checked={featured} onChange={setFeatured} label="Destacar" />
        <StatusPill live />
        <StatusPill live={false} />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-start gap-5">
        <FieldCard title="Campos de formulario" subtitle="Mismo tratamiento que usa todo el panel.">
          <TextField label="Nombre del producto" defaultValue="Monstera Deliciosa" />
          <SelectField label="Categoría" defaultValue="Interior">
            <option>Interior</option>
            <option>Exterior</option>
          </SelectField>
          <TextAreaField label="Bajada corta" defaultValue="Interior · luz media · riego semanal" />
        </FieldCard>

        <FieldCard title="Panel lateral" tinted subtitle="Variante tintada, para columnas de apoyo.">
          <p className="text-[13px] leading-[1.55] text-stone">
            Vista actual: <strong className="font-medium text-forest">{layout}</strong> ·{" "}
            {featured ? "destacado" : "sin destacar"}.
          </p>
        </FieldCard>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
        {headerVariants.map((option) => (
          <VariantPickerCard
            key={option.id}
            id={option.code}
            name={option.label}
            description={option.description}
            wireKind={option.wireKind}
            active={option.id === variant}
            onSelect={() => setVariant(option.id)}
          />
        ))}
      </div>
    </div>
  );
}

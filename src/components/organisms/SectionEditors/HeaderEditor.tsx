"use client";

import type { HeaderSection } from "@/lib/cms/types";
import { TextField } from "@/components/atoms/TextField";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";
import { ImageUploader } from "@/components/molecules/ImageUploader/ImageUploader";
import { LinksEditor } from "@/components/molecules/LinksEditor/LinksEditor";

interface HeaderEditorProps {
  section: HeaderSection;
  onChange: (section: HeaderSection) => void;
}

export function HeaderEditor({ section, onChange }: HeaderEditorProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-start gap-5">
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

      <FieldCard
        title="Logo"
        subtitle="Reemplaza al texto en las cinco variantes de header. Sin logo cargado, el sitio sigue mostrando el texto de al lado."
      >
        <ImageUploader
          imageUrl={section.logoImageUrl}
          imageAlt={section.logoImageAlt}
          placeholderLabel="Sin logo"
          onChange={({ imageUrl, imageAlt }) =>
            onChange({ ...section, logoImageUrl: imageUrl, logoImageAlt: imageAlt })
          }
        />
        <p className="text-[13px] leading-[1.5] text-stone">
          Se muestra en un espacio de alto fijo y entra completo, sea apaisado o cuadrado. Conviene
          un PNG o WEBP con fondo transparente: el header es claro en casi todas las variantes y en
          la lateral es verde oscuro.
        </p>
        {section.logoImageUrl && !section.logoImageAlt.trim() ? (
          <p className="text-[13px] leading-[1.5] text-terracotta">
            Falta el texto alternativo. Mientras esté vacío, los lectores de pantalla van a leer el
            texto del logo en su lugar.
          </p>
        ) : null}
      </FieldCard>
    </div>
  );
}

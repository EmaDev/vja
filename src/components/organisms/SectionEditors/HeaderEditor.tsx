"use client";

import type { AnnouncementItem, HeaderSection } from "@/lib/cms/types";
import { TextField } from "@/components/atoms/TextField";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";
import { ImageUploader } from "@/components/molecules/ImageUploader/ImageUploader";
import { LinksEditor } from "@/components/molecules/LinksEditor/LinksEditor";
import { RepeatableList } from "@/components/molecules/RepeatableList/RepeatableList";

const MAX_ANNOUNCEMENTS = 6;

function emptyAnnouncement(): AnnouncementItem {
  return { id: crypto.randomUUID(), text: "" };
}

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

      <FieldCard
        title="Barra de anuncios"
        subtitle="Los avisos que corren sobre el menú. Sólo los muestra la variante “Con barra de anuncio”; con la lista vacía, la barra no aparece."
        className="sm:col-span-full"
      >
        <RepeatableList
          items={section.announcements}
          onChange={(announcements) => onChange({ ...section, announcements })}
          createItem={emptyAnnouncement}
          addLabel="Agregar aviso"
          max={MAX_ANNOUNCEMENTS}
          itemMinWidth={240}
          itemLabel={(item, index) => item.text || `Aviso ${index + 1}`}
          emptyLabel="Sin avisos cargados, esa variante de header no dibuja la barra."
          renderItem={(item, update) => (
            <TextField
              label="Texto"
              placeholder="Vivero abierto de martes a domingo"
              value={item.text}
              onChange={(event) => update({ text: event.target.value })}
            />
          )}
        />
      </FieldCard>
    </div>
  );
}

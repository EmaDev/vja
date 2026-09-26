"use client";

import { useState } from "react";
import { categorySlug, type CatalogStatus, type Category } from "@/lib/cms/catalog-types";
import { TextField } from "@/components/atoms/TextField";
import { TextAreaField } from "@/components/atoms/TextAreaField";
import { ToggleSwitch } from "@/components/atoms/ToggleSwitch";
import { SegmentedControl } from "@/components/atoms/SegmentedControl";
import { AdminButton } from "@/components/atoms/AdminButton";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";
import { AdminPageHeader } from "@/components/organisms/AdminPageHeader/AdminPageHeader";

interface CategoryEditFormProps {
  category: Category;
  /** Productos que hoy usan esta categoría: bloquea el borrado. */
  productCount: number;
  saving: boolean;
  error: string | null;
  onDiscard: () => void;
  onSave: (category: Category, status: CatalogStatus) => void;
  onDelete: (id: string) => void;
}

export function CategoryEditForm({
  category,
  productCount,
  saving,
  error,
  onDiscard,
  onSave,
  onDelete,
}: CategoryEditFormProps) {
  const [form, setForm] = useState<Category>(category);
  /** El slug sigue al nombre hasta que alguien lo edita a mano. */
  const [slugLocked, setSlugLocked] = useState(
    category.slug !== "" && category.slug !== categorySlug(category.name),
  );

  function set<K extends keyof Category>(key: K, value: Category[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function setName(name: string) {
    setForm((current) => ({
      ...current,
      name,
      slug: slugLocked ? current.slug : categorySlug(name),
    }));
  }

  return (
    <>
      <AdminPageHeader
        crumb="Catálogo / Categorías / Editar"
        title={form.name}
        actions={
          <>
            <AdminButton variant="outline" onClick={onDiscard} disabled={saving}>
              Descartar
            </AdminButton>
            <AdminButton variant="outline" onClick={() => onSave(form, "draft")} disabled={saving}>
              {saving ? "Guardando…" : "Guardar borrador"}
            </AdminButton>
            <AdminButton variant="solid" onClick={() => onSave(form, "live")} disabled={saving}>
              Publicar
            </AdminButton>
          </>
        }
      />

      {error ? (
        <div
          role="alert"
          className="mx-6 mt-5 rounded-md border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta lg:mx-10"
        >
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] items-start gap-6 px-6 pb-20 pt-7 lg:px-10">
        <div className="flex flex-col gap-5">
          <FieldCard title="Identificación">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
              <TextField
                label="Nombre de la categoría"
                value={form.name}
                onChange={(e) => setName(e.target.value)}
              />
              <label className="flex flex-col gap-[7px]">
                <span className="text-[13px] text-ink">URL</span>
                <div className="flex items-center rounded-md border border-line bg-paper-light pl-[13px] focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-sage">
                  <span className="shrink-0 text-[15px] text-taupe">vjaplantas.com.ar/categoria/</span>
                  <input
                    value={form.slug}
                    onChange={(e) => {
                      setSlugLocked(true);
                      set("slug", categorySlug(e.target.value));
                    }}
                    aria-label="Segmento de URL"
                    className="min-w-0 flex-1 border-0 bg-transparent py-[11px] pr-[13px] text-[15px] text-forest outline-none"
                  />
                </div>
              </label>
            </div>
            <TextField
              label="Bajada corta · acompaña al título en la portada"
              value={form.short}
              onChange={(e) => set("short", e.target.value)}
            />
            <TextAreaField
              label="Descripción"
              rows={5}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </FieldCard>

          <FieldCard title="Imagen de portada">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
              <div className="h-[200px] overflow-hidden rounded-lg border-2 border-sage">
                <ImagePlaceholder label="Portada" />
              </div>
              <button
                type="button"
                className="flex h-[200px] flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#CFC6B0] bg-paper-light text-taupe transition-colors hover:border-sage hover:bg-[#F4F6F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
              >
                <span className="text-2xl leading-none text-[#A09D8B]">+</span>
                <span className="text-[13px]">Cambiar imagen</span>
              </button>
            </div>
            <p className="text-[13px] text-taupe">
              Se recorta apaisada en la portada del sitio. JPG o WEBP, mínimo 1600 px de ancho.
            </p>
          </FieldCard>
        </div>

        <div className="flex flex-col gap-5">
          <FieldCard title="Publicación" tinted>
            <div className="flex items-center justify-between gap-3.5">
              <span className="text-sm text-ink">Estado</span>
              <SegmentedControl
                options={[
                  { value: "draft", label: "Borrador" },
                  { value: "live", label: "Publicado" },
                ]}
                value={form.status}
                onChange={(status) => set("status", status)}
              />
            </div>
            <div className="flex items-center justify-between gap-3.5 border-t border-line-light pt-3.5">
              <div>
                <div className="text-sm text-forest">Mostrar en el menú</div>
                <div className="mt-0.5 text-[13px] text-stone">Aparece en la navegación del sitio</div>
              </div>
              <ToggleSwitch
                checked={form.featured}
                onChange={(featured) => set("featured", featured)}
                label="Mostrar en el menú"
              />
            </div>
          </FieldCard>

          <FieldCard title="Productos">
            <p className="-mt-2 text-[13px] leading-[1.5] text-stone">
              {productCount === 0
                ? "Todavía no hay productos en esta categoría."
                : `${productCount} ${productCount === 1 ? "producto usa" : "productos usan"} esta categoría.`}
            </p>
            <AdminButton href="/cms/productos" className="w-fit">
              Ver en el catálogo
            </AdminButton>
          </FieldCard>

          <FieldCard title="Zona de riesgo">
            <p className="-mt-2 text-[13px] leading-[1.5] text-stone">
              {productCount > 0
                ? `No se puede eliminar mientras ${productCount === 1 ? "haya un producto" : `haya ${productCount} productos`} usándola. Reasignalos primero desde el catálogo.`
                : "Eliminar la categoría la quita del sitio y del menú. No se puede deshacer."}
            </p>
            <AdminButton
              variant="danger-outline"
              disabled={saving || productCount > 0}
              onClick={() => onDelete(category.id)}
              className="w-fit"
            >
              Eliminar categoría
            </AdminButton>
          </FieldCard>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { productCover, productUrlPreview, type CatalogStatus, type Product } from "@/lib/cms/catalog-types";
import { productQrUrl, siteUrlInvalid } from "@/lib/cms/qr-labels";
import { QrCode } from "@/components/atoms/QrCode";
import { QrPrintDialog } from "@/components/organisms/QrLabels/QrPrintDialog";
import { TextField } from "@/components/atoms/TextField";
import { SelectField } from "@/components/atoms/SelectField";
import { ToggleSwitch } from "@/components/atoms/ToggleSwitch";
import { SegmentedControl } from "@/components/atoms/SegmentedControl";
import { AdminButton } from "@/components/atoms/AdminButton";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";
import { MarkdownEditor } from "@/components/molecules/MarkdownEditor/MarkdownEditor";
import { AdminPageHeader } from "@/components/organisms/AdminPageHeader/AdminPageHeader";
import { ProductPhotosEditor } from "./ProductPhotosEditor";

/** Ejemplo que ve quien abre un producto sin descripción: muestra de una el
 * formato que entiende el editor, que si no hay que ir a buscarlo. */
const PLACEHOLDER = [
  "Contá cómo es la planta, de dónde viene y para qué ambiente va bien.",
  "",
  "## Detalles",
  "- 🌱 **Origen:** selvas de Centroamérica",
  "- 📏 **Porte:** hasta 1,4 m en maceta",
  "- ✨ ++Se entrega ya aclimatada++",
].join("\n");

interface ProductEditFormProps {
  product: Product;
  /** Categorías cargadas en el CMS. */
  categoryNames: string[];
  saving: boolean;
  error: string | null;
  onDiscard: () => void;
  onSave: (product: Product, status: CatalogStatus) => void;
  onDelete: (id: string) => void;
}

export function ProductEditForm({
  product,
  categoryNames,
  saving,
  error,
  onDiscard,
  onSave,
  onDelete,
}: ProductEditFormProps) {
  const [form, setForm] = useState<Product>(product);
  const cover = productCover(form);
  const [newTag, setNewTag] = useState<string | null>(null);
  const [printing, setPrinting] = useState(false);

  // El QR sale del producto guardado, no del formulario: codifica la URL, y la
  // URL sólo existe una vez que el servidor asignó el id.
  const qrUrl = productQrUrl(product);

  /** Si el producto quedó en una categoría que ya no existe, se ofrece igual:
   * sin ella el `select` mostraría otra y el guardado lo reasignaría solo. */
  const categoryOptions = [...new Set([form.category, ...categoryNames])].filter(Boolean);

  function set<K extends keyof Product>(key: K, value: Product[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function addTag(value: string) {
    const tag = value.trim();
    if (tag && !form.tags.includes(tag)) set("tags", [...form.tags, tag]);
    setNewTag(null);
  }

  return (
    <>
      <AdminPageHeader
        crumb="Catálogo / Productos / Editar"
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
                label="Nombre del producto"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
              <TextField
                label="Nombre científico"
                value={form.latin}
                onChange={(e) => set("latin", e.target.value)}
                className="italic"
              />
              <TextField
                label="URL"
                value={productUrlPreview(form)}
                readOnly
                className="bg-paper-dark text-stone"
              />
              <SelectField label="Categoría" value={form.category} onChange={(e) => set("category", e.target.value)}>
                {categoryOptions.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </SelectField>
            </div>
          </FieldCard>

          <FieldCard title="Galería de imágenes">
            <ProductPhotosEditor
              photos={form.photos}
              onChange={(photos) => set("photos", photos)}
              productName={form.name}
            />
          </FieldCard>

          <FieldCard title="Descripción">
            <TextField
              label="Bajada corta · aparece en la card"
              value={form.short}
              onChange={(e) => set("short", e.target.value)}
            />
            <MarkdownEditor
              label="Texto completo · es lo que se lee en la ficha de la planta"
              value={form.long}
              onChange={(long) => set("long", long)}
              rows={12}
              placeholder={PLACEHOLDER}
            />
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
                <div className="text-sm text-forest">Destacar en la portada</div>
                <div className="mt-0.5 text-[13px] text-stone">Aparece en &quot;Lo más pedido&quot;</div>
              </div>
              <ToggleSwitch
                checked={form.featured}
                onChange={(featured) => set("featured", featured)}
                label="Destacar en la portada"
              />
            </div>
          </FieldCard>

          <FieldCard title="Etiquetas">
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 rounded-full bg-[#F0EADB] px-3 py-1.5 text-[13px] text-ink"
                >
                  {tag}
                  <button
                    type="button"
                    aria-label={`Quitar ${tag}`}
                    onClick={() => set("tags", form.tags.filter((t) => t !== tag))}
                    className="text-taupe transition-colors hover:text-terracotta"
                  >
                    ×
                  </button>
                </span>
              ))}
              {newTag === null ? (
                <button
                  type="button"
                  onClick={() => setNewTag("")}
                  className="rounded-full border border-dashed border-[#CFC6B0] px-3 py-1.5 text-[13px] text-taupe transition-colors hover:border-sage hover:text-forest"
                >
                  + Agregar
                </button>
              ) : (
                <input
                  autoFocus
                  value={newTag}
                  onChange={(event) => setNewTag(event.target.value)}
                  onBlur={(event) => addTag(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addTag(newTag);
                    }
                    if (event.key === "Escape") setNewTag(null);
                  }}
                  placeholder="Nueva etiqueta"
                  aria-label="Nueva etiqueta"
                  className="w-36 rounded-full border border-line bg-paper-light px-3 py-1.5 text-[13px] text-forest outline-none focus:outline-2 focus:outline-sage focus:outline-offset-1"
                />
              )}
            </div>
          </FieldCard>

          <FieldCard title="Vista previa de la card">
            <div className="overflow-hidden rounded-lg border border-line-light">
              <div className="h-[150px]">
                <ImagePlaceholder src={cover?.imageUrl} alt={cover?.imageAlt} label="Portada" />
              </div>
              <div className="bg-paper-light px-[15px] pb-[15px] pt-[13px]">
                <div className="font-display text-xl text-forest">{form.name}</div>
                <div className="mt-0.5 text-[13px] text-taupe">{form.short}</div>
              </div>
            </div>
            <p className="text-[13px] leading-[1.5] text-stone">
              Se muestra con la variante de card elegida en Diseño. Sin precio ni stock.
            </p>
          </FieldCard>

          <FieldCard title="Etiqueta QR">
            {qrUrl ? (
              <>
                <div className="flex items-center gap-3.5">
                  <QrCode value={qrUrl} size="72px" className="shrink-0 rounded border border-line-light" />
                  <p className="min-w-0 text-[13px] leading-[1.5] text-stone">
                    Lleva a la ficha pública de esta planta.
                    <span className="mt-1 block break-all text-taupe">{qrUrl}</span>
                  </p>
                </div>
                <AdminButton onClick={() => setPrinting(true)} className="w-fit">
                  Imprimir etiqueta
                </AdminButton>
              </>
            ) : (
              <p className="-mt-2 text-[13px] leading-[1.5] text-stone">
                {!product.id
                  ? "Guardá el producto primero: el QR necesita la URL definitiva de la ficha."
                  : siteUrlInvalid
                    ? "El valor de NEXT_PUBLIC_SITE_URL no se entiende como dirección. Tiene que ser el dominio del sitio, por ejemplo https://vjaplantas.com.ar."
                    : "Falta configurar NEXT_PUBLIC_SITE_URL con el dominio del sitio para poder generar el QR."}
              </p>
            )}
          </FieldCard>

          <FieldCard title="Zona de riesgo">
            <p className="-mt-2 text-[13px] leading-[1.5] text-stone">
              Eliminar el producto lo quita del sitio y del buscador. No se puede deshacer.
            </p>
            <AdminButton
              variant="danger-outline"
              disabled={saving}
              onClick={() => onDelete(product.id)}
              className="w-fit"
            >
              Eliminar producto
            </AdminButton>
          </FieldCard>
        </div>
      </div>

      {printing ? (
        <QrPrintDialog products={[product]} onClose={() => setPrinting(false)} />
      ) : null}
    </>
  );
}

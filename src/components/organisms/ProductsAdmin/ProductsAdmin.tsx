"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/organisms/AdminPageHeader/AdminPageHeader";
import { AdminButton } from "@/components/atoms/AdminButton";
import { TextField } from "@/components/atoms/TextField";
import { SelectField } from "@/components/atoms/SelectField";
import { SegmentedControl } from "@/components/atoms/SegmentedControl";
import { StatusPill } from "@/components/atoms/StatusPill";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import { ProductEditForm } from "@/components/organisms/ProductsAdmin/ProductEditForm";
import { QrPrintDialog } from "@/components/organisms/QrLabels/QrPrintDialog";
import { deleteProductAction, saveProductAction } from "@/lib/cms/catalog-actions";
import { productCover, type CatalogStatus, type Product } from "@/lib/cms/catalog-types";

const ALL_CATEGORIES = "all";
const ALL_STATUSES = "all";

/** Compara ignorando mayúsculas y tildes, para que "calathea" encuentre "Calathea". */
function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export interface ProductsAdminProps {
  products: Product[];
  /** Categorías cargadas, para el selector del formulario. */
  categoryNames: string[];
}

export function ProductsAdmin({ products: initialProducts, categoryNames }: ProductsAdminProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [view, setView] = useState<"list" | "edit">("list");
  const [layout, setLayout] = useState<"grid" | "rows">("grid");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [status, setStatus] = useState(ALL_STATUSES);
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [printing, setPrinting] = useState(false);

  const blankProduct = useMemo<Product>(
    () => ({
      id: "",
      name: "Nuevo producto",
      latin: "",
      category: categoryNames[0] ?? "",
      status: "draft",
      photos: [],
      short: "",
      long: "",
      tags: [],
      featured: false,
    }),
    [categoryNames],
  );

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort((a, b) => a.localeCompare(b, "es")),
    [products],
  );

  const visibleProducts = useMemo(() => {
    const needle = fold(query.trim());
    return products.filter((product) => {
      const matchesQuery =
        !needle || fold(product.name).includes(needle) || fold(product.latin).includes(needle);
      const matchesCategory = category === ALL_CATEGORIES || product.category === category;
      const matchesStatus = status === ALL_STATUSES || product.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [products, query, category, status]);

  const filtersActive = query.trim() !== "" || category !== ALL_CATEGORIES || status !== ALL_STATUSES;

  /** Se deriva de la lista y no del set: si un producto se elimina, su id deja
   * de resolver y sale solo de la selección. */
  const selectedProducts = products.filter((product) => selectedIds.has(product.id));
  const allVisibleSelected =
    visibleProducts.length > 0 && visibleProducts.every((product) => selectedIds.has(product.id));

  function toggleSelected(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }

  function toggleAllVisible() {
    setSelectedIds((current) => {
      const next = new Set(current);
      for (const product of visibleProducts) {
        if (allVisibleSelected) next.delete(product.id);
        else next.add(product.id);
      }
      return next;
    });
  }

  const editingProduct = editingId ? products.find((p) => p.id === editingId) ?? blankProduct : blankProduct;

  function openProduct(id: string) {
    setError(null);
    setEditingId(id);
    setView("edit");
  }

  function newProduct() {
    setError(null);
    setEditingId(null);
    setView("edit");
  }

  function clearFilters() {
    setQuery("");
    setCategory(ALL_CATEGORIES);
    setStatus(ALL_STATUSES);
  }

  /** El id de un producto nuevo lo decide el servidor (sale del nombre), así que
   * la lista se actualiza con lo que devuelve la acción, no con lo que se envió. */
  function save(product: Product, nextStatus: CatalogStatus) {
    setError(null);
    startSaving(async () => {
      const result = await saveProductAction(product, nextStatus);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      const saved = result.product;
      setProducts((current) =>
        current.some((p) => p.id === saved.id)
          ? current.map((p) => (p.id === saved.id ? saved : p))
          : [...current, saved],
      );
      setView("list");
      // Refresca los totales de la barra lateral, que se arman en el layout.
      router.refresh();
    });
  }

  function remove(id: string) {
    setError(null);

    // Un producto que todavía no se guardó no existe en la base: descartarlo es
    // simplemente volver al listado.
    if (!id) {
      setView("list");
      return;
    }

    startSaving(async () => {
      const result = await deleteProductAction(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      setProducts((current) => current.filter((p) => p.id !== id));
      setView("list");
      router.refresh();
    });
  }

  if (view === "edit") {
    return (
      <ProductEditForm
        key={editingId ?? "nuevo"}
        product={editingProduct}
        categoryNames={categoryNames}
        saving={saving}
        error={error}
        onDiscard={() => {
          setError(null);
          setView("list");
        }}
        onSave={save}
        onDelete={remove}
      />
    );
  }

  return (
    <>
      <AdminPageHeader
        crumb="Catálogo"
        title="Productos"
        actions={
          <AdminButton variant="solid" onClick={newProduct}>
            + Nuevo producto
          </AdminButton>
        }
      />

      <div className="flex flex-col gap-5 px-6 pb-20 pt-7 lg:px-10">
        <div className="flex flex-wrap items-center gap-2.5">
          <TextField
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre o nombre científico"
            aria-label="Buscar productos"
            className="min-w-[240px] flex-1 rounded-full"
          />
          <SelectField
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filtrar por categoría"
            className="rounded-full"
          >
            <option value={ALL_CATEGORIES}>Todas las categorías</option>
            {categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectField>
          <SelectField
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Filtrar por estado"
            className="rounded-full"
          >
            <option value={ALL_STATUSES}>Todos los estados</option>
            <option value="live">Publicado</option>
            <option value="draft">Borrador</option>
          </SelectField>
          <SegmentedControl
            options={[
              { value: "grid", label: "Galería" },
              { value: "rows", label: "Lista" },
            ]}
            value={layout}
            onChange={setLayout}
          />
        </div>

        {filtersActive ? (
          <p className="-mt-1 text-[13px] text-stone">
            {visibleProducts.length} de {products.length} productos
            <button
              type="button"
              onClick={clearFilters}
              className="ml-2 border-b border-line text-forest transition-colors hover:border-terracotta hover:text-terracotta"
            >
              Limpiar filtros
            </button>
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-2.5 rounded-[10px] border border-line-light bg-paper-light px-4 py-3">
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-ink">
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={toggleAllVisible}
              disabled={visibleProducts.length === 0}
              className="h-4 w-4 accent-forest"
            />
            Seleccionar {filtersActive ? "lo filtrado" : "todo"}
          </label>

          <span className="text-[13px] text-stone">
            {selectedProducts.length === 0
              ? "Elegí productos para imprimir sus etiquetas QR."
              : `${selectedProducts.length} seleccionado${selectedProducts.length === 1 ? "" : "s"}`}
          </span>

          <div className="ml-auto flex flex-wrap items-center gap-2.5">
            {selectedProducts.length > 0 ? (
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="border-b border-line text-[13px] text-forest transition-colors hover:border-terracotta hover:text-terracotta"
              >
                Limpiar selección
              </button>
            ) : null}
            <AdminButton
              variant="outline"
              disabled={selectedProducts.length === 0}
              onClick={() => setPrinting(true)}
            >
              Imprimir QR
            </AdminButton>
          </div>
        </div>

        {visibleProducts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-[10px] border border-dashed border-line bg-paper-light px-6 py-16 text-center">
            <p className="font-display text-2xl text-forest">
              {products.length === 0 ? "Todavía no hay productos" : "Ningún producto coincide"}
            </p>
            <p className="max-w-[420px] text-sm leading-[1.6] text-stone">
              {products.length === 0
                ? "Cargá la primera planta del catálogo para verla acá."
                : "Probá con otro nombre o quitá los filtros para ver el catálogo completo."}
            </p>
            {products.length === 0 ? (
              <AdminButton variant="solid" onClick={newProduct}>
                + Nuevo producto
              </AdminButton>
            ) : (
              <AdminButton variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </AdminButton>
            )}
          </div>
        ) : layout === "grid" ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[18px]">
            {/* El checkbox va como hermano del botón, no adentro: un control
                interactivo dentro de un <button> es HTML inválido y el click
                terminaría abriendo la ficha en vez de marcar el producto. */}
            {visibleProducts.map((product) => (
              <div key={product.id} className="relative">
                <button
                  type="button"
                  onClick={() => openProduct(product.id)}
                  className="flex w-full flex-col overflow-hidden rounded-[10px] border border-line-light bg-paper-light text-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(23,48,31,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
                >
                  <div className="relative h-[180px] bg-sand">
                    <ImagePlaceholder
                      src={productCover(product)?.imageUrl}
                      alt={productCover(product)?.imageAlt}
                      label={product.name}
                    />
                    <StatusPill live={product.status === "live"} className="absolute left-3 top-3" />
                  </div>
                  <div className="px-4 pb-4 pt-3.5">
                    <div className="font-display text-xl leading-[1.15] text-forest">{product.name}</div>
                    <div className="mt-0.5 text-[13px] text-taupe">{product.latin}</div>
                    <div className="mt-3 flex items-center justify-between border-t border-[#EDE6D6] pt-[11px]">
                      <span className="text-[13px] text-ink">{product.category}</span>
                      <span className="text-xs text-taupe">
                        {product.photos.length === 1 ? "1 foto" : `${product.photos.length} fotos`}
                      </span>
                    </div>
                  </div>
                </button>

                <label className="absolute right-3 top-3 flex cursor-pointer items-center rounded-md bg-paper-light/95 p-1.5 shadow-[0_2px_6px_rgba(23,48,31,0.15)]">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(product.id)}
                    onChange={() => toggleSelected(product.id)}
                    aria-label={`Seleccionar ${product.name}`}
                    className="h-4 w-4 accent-forest"
                  />
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[10px] border border-line-light bg-paper-light">
            <div className="grid min-w-[780px] grid-cols-[32px_56px_minmax(0,2.2fr)_minmax(0,1fr)_120px_92px] items-center gap-4 bg-[#F2EDE0] px-[18px] py-[13px] text-[11px] uppercase tracking-[0.14em] text-taupe">
              <span />
              <span />
              <span>Producto</span>
              <span>Categoría</span>
              <span>Estado</span>
              <span />
            </div>
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                className="grid min-w-[780px] grid-cols-[32px_56px_minmax(0,2.2fr)_minmax(0,1fr)_120px_92px] items-center gap-4 border-t border-[#EDE6D6] px-[18px] py-3 transition-colors hover:bg-white"
              >
                <label className="flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(product.id)}
                    onChange={() => toggleSelected(product.id)}
                    aria-label={`Seleccionar ${product.name}`}
                    className="h-4 w-4 accent-forest"
                  />
                </label>
                <div className="h-11 w-11 overflow-hidden rounded-md">
                  <ImagePlaceholder
                    src={productCover(product)?.imageUrl}
                    alt={productCover(product)?.imageAlt}
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-[15px] font-medium text-forest">{product.name}</div>
                  <div className="text-[13px] text-taupe">{product.latin}</div>
                </div>
                <span className="text-sm text-ink">{product.category}</span>
                <StatusPill live={product.status === "live"} className="justify-self-start" />
                <AdminButton variant="outline" onClick={() => openProduct(product.id)} className="justify-self-end">
                  Editar
                </AdminButton>
              </div>
            ))}
          </div>
        )}
      </div>

      {printing ? (
        <QrPrintDialog products={selectedProducts} onClose={() => setPrinting(false)} />
      ) : null}
    </>
  );
}

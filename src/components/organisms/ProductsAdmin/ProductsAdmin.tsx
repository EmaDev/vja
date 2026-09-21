"use client";

import { useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/organisms/AdminPageHeader/AdminPageHeader";
import { AdminButton } from "@/components/atoms/AdminButton";
import { TextField } from "@/components/atoms/TextField";
import { SelectField } from "@/components/atoms/SelectField";
import { SegmentedControl } from "@/components/atoms/SegmentedControl";
import { StatusPill } from "@/components/atoms/StatusPill";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import { ProductEditForm } from "@/components/organisms/ProductsAdmin/ProductEditForm";
import { mockProducts, type Product } from "@/lib/cms/product-mock-data";

const ALL_CATEGORIES = "all";
const ALL_STATUSES = "all";

const BLANK_PRODUCT: Product = {
  id: "",
  name: "Nuevo producto",
  latin: "",
  category: "Interior",
  light: "Luz indirecta",
  water: "Semanal",
  height: "",
  difficulty: "Fácil",
  pot: "Cerámica esmaltada",
  petSafe: "No",
  status: "draft",
  photos: 0,
  short: "",
  long: "",
  tags: [],
  featured: false,
};

/** Compara ignorando mayúsculas y tildes, para que "calathea" encuentre "Calathea". */
function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [view, setView] = useState<"list" | "edit">("list");
  const [layout, setLayout] = useState<"grid" | "rows">("grid");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [status, setStatus] = useState(ALL_STATUSES);

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

  const editingProduct = editingId ? products.find((p) => p.id === editingId) ?? BLANK_PRODUCT : BLANK_PRODUCT;

  function openProduct(id: string) {
    setEditingId(id);
    setView("edit");
  }

  function newProduct() {
    setEditingId(null);
    setView("edit");
  }

  function clearFilters() {
    setQuery("");
    setCategory(ALL_CATEGORIES);
    setStatus(ALL_STATUSES);
  }

  function save(product: Product, nextStatus: "draft" | "live") {
    const withId = product.id ? product : { ...product, id: crypto.randomUUID() };
    const next = { ...withId, status: nextStatus };
    setProducts((current) => {
      const exists = current.some((p) => p.id === next.id);
      return exists ? current.map((p) => (p.id === next.id ? next : p)) : [next, ...current];
    });
    setView("list");
  }

  function remove(id: string) {
    setProducts((current) => current.filter((p) => p.id !== id));
    setView("list");
  }

  if (view === "edit") {
    return (
      <ProductEditForm
        key={editingId ?? "nuevo"}
        product={editingProduct}
        onDiscard={() => setView("list")}
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
            {visibleProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => openProduct(product.id)}
                className="flex flex-col overflow-hidden rounded-[10px] border border-line-light bg-paper-light text-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(23,48,31,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
              >
                <div className="relative h-[180px] bg-sand">
                  <ImagePlaceholder label={product.name} />
                  <StatusPill live={product.status === "live"} className="absolute left-3 top-3" />
                </div>
                <div className="px-4 pb-4 pt-3.5">
                  <div className="font-display text-xl leading-[1.15] text-forest">{product.name}</div>
                  <div className="mt-0.5 text-[13px] text-taupe">{product.latin}</div>
                  <div className="mt-3 flex items-center justify-between border-t border-[#EDE6D6] pt-[11px]">
                    <span className="text-[13px] text-ink">{product.category}</span>
                    <span className="text-xs text-taupe">{product.photos} fotos</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[10px] border border-line-light bg-paper-light">
            <div className="grid min-w-[860px] grid-cols-[56px_minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,1.2fr)_120px_92px] items-center gap-4 bg-[#F2EDE0] px-[18px] py-[13px] text-[11px] uppercase tracking-[0.14em] text-taupe">
              <span />
              <span>Producto</span>
              <span>Categoría</span>
              <span>Luz / riego</span>
              <span>Estado</span>
              <span />
            </div>
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                className="grid min-w-[860px] grid-cols-[56px_minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,1.2fr)_120px_92px] items-center gap-4 border-t border-[#EDE6D6] px-[18px] py-3 transition-colors hover:bg-white"
              >
                <div className="h-11 w-11 overflow-hidden rounded-md">
                  <ImagePlaceholder />
                </div>
                <div className="min-w-0">
                  <div className="text-[15px] font-medium text-forest">{product.name}</div>
                  <div className="text-[13px] text-taupe">{product.latin}</div>
                </div>
                <span className="text-sm text-ink">{product.category}</span>
                <span className="text-sm text-ink">
                  {product.light} · {product.water}
                </span>
                <StatusPill live={product.status === "live"} className="justify-self-start" />
                <AdminButton variant="outline" onClick={() => openProduct(product.id)} className="justify-self-end">
                  Editar
                </AdminButton>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

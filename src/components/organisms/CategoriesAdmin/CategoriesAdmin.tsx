"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/organisms/AdminPageHeader/AdminPageHeader";
import { AdminButton } from "@/components/atoms/AdminButton";
import { TextField } from "@/components/atoms/TextField";
import { SelectField } from "@/components/atoms/SelectField";
import { StatusPill } from "@/components/atoms/StatusPill";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import { CategoryEditForm } from "@/components/organisms/CategoriesAdmin/CategoryEditForm";
import {
  deleteCategoryAction,
  reorderCategoriesAction,
  saveCategoryAction,
} from "@/lib/cms/catalog-actions";
import type { CatalogStatus, Category } from "@/lib/cms/catalog-types";

const ALL_STATUSES = "all";

const BLANK_CATEGORY: Category = {
  id: "",
  name: "Nueva categoría",
  slug: "",
  short: "",
  description: "",
  status: "draft",
  featured: false,
  imageUrl: "",
  imageAlt: "",
};

/** Compara ignorando mayúsculas y tildes, para que "flores" encuentre "Flores de corte". */
function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export interface CategoriesAdminProps {
  categories: Category[];
  /** Cuántos productos usa cada categoría, por nombre. */
  productCounts: Record<string, number>;
}

export function CategoriesAdmin({
  categories: initialCategories,
  productCounts,
}: CategoriesAdminProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [view, setView] = useState<"list" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(ALL_STATUSES);
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();

  const visibleCategories = useMemo(() => {
    const needle = fold(query.trim());
    return categories.filter((category) => {
      const matchesQuery =
        !needle || fold(category.name).includes(needle) || fold(category.short).includes(needle);
      const matchesStatus = status === ALL_STATUSES || category.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [categories, query, status]);

  const filtersActive = query.trim() !== "" || status !== ALL_STATUSES;

  const editingCategory = editingId
    ? categories.find((c) => c.id === editingId) ?? BLANK_CATEGORY
    : BLANK_CATEGORY;

  function openCategory(id: string) {
    setError(null);
    setEditingId(id);
    setView("edit");
  }

  function newCategory() {
    setError(null);
    setEditingId(null);
    setView("edit");
  }

  function clearFilters() {
    setQuery("");
    setStatus(ALL_STATUSES);
  }

  /** Mueve una categoría dentro del orden real, no del filtrado. El nuevo orden
   * se persiste entero: es el orden en que el sitio las muestra. */
  function move(id: string, direction: -1 | 1) {
    const from = categories.findIndex((c) => c.id === id);
    const to = from + direction;
    if (from === -1 || to < 0 || to >= categories.length) return;

    const next = [...categories];
    [next[from], next[to]] = [next[to], next[from]];
    setCategories(next);
    setError(null);

    startSaving(async () => {
      const result = await reorderCategoriesAction(next.map((c) => c.id));
      if (!result.ok) {
        // Volver al orden anterior es más honesto que dejar en pantalla uno que
        // la base no tiene.
        setCategories(categories);
        setError(result.error);
      }
    });
  }

  function save(category: Category, nextStatus: CatalogStatus) {
    setError(null);
    startSaving(async () => {
      const result = await saveCategoryAction(category, nextStatus);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      const saved = result.category;
      setCategories((current) =>
        current.some((c) => c.id === saved.id)
          ? current.map((c) => (c.id === saved.id ? saved : c))
          : [...current, saved],
      );
      setView("list");
      router.refresh();
    });
  }

  function remove(id: string) {
    setError(null);

    if (!id) {
      setView("list");
      return;
    }

    startSaving(async () => {
      const result = await deleteCategoryAction(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      setCategories((current) => current.filter((c) => c.id !== id));
      setView("list");
      router.refresh();
    });
  }

  if (view === "edit") {
    return (
      <CategoryEditForm
        key={editingId ?? "nueva"}
        category={editingCategory}
        productCount={productCounts[editingCategory.name] ?? 0}
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
        title="Categorías"
        actions={
          <AdminButton variant="solid" onClick={newCategory}>
            + Nueva categoría
          </AdminButton>
        }
      />

      <div className="flex flex-col gap-5 px-6 pb-20 pt-7 lg:px-10">
        {error ? (
          <div
            role="alert"
            className="rounded-md border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta"
          >
            {error}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2.5">
          <TextField
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre o bajada"
            aria-label="Buscar categorías"
            className="min-w-[240px] flex-1 rounded-full"
          />
          <SelectField
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Filtrar por estado"
            className="rounded-full"
          >
            <option value={ALL_STATUSES}>Todos los estados</option>
            <option value="live">Publicada</option>
            <option value="draft">Borrador</option>
          </SelectField>
        </div>

        <p className="-mt-1 text-[13px] text-stone">
          {filtersActive ? (
            <>
              {visibleCategories.length} de {categories.length} categorías
              <button
                type="button"
                onClick={clearFilters}
                className="ml-2 border-b border-line text-forest transition-colors hover:border-terracotta hover:text-terracotta"
              >
                Limpiar filtros
              </button>
            </>
          ) : (
            "El orden de esta lista es el orden en que se muestran en el sitio."
          )}
        </p>

        {visibleCategories.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-[10px] border border-dashed border-line bg-paper-light px-6 py-16 text-center">
            <p className="font-display text-2xl text-forest">
              {categories.length === 0 ? "Todavía no hay categorías" : "Ninguna categoría coincide"}
            </p>
            <p className="max-w-[420px] text-sm leading-[1.6] text-stone">
              {categories.length === 0
                ? "Creá la primera para poder agrupar el catálogo."
                : "Probá con otro nombre o quitá los filtros para ver todas."}
            </p>
            {categories.length === 0 ? (
              <AdminButton variant="solid" onClick={newCategory}>
                + Nueva categoría
              </AdminButton>
            ) : (
              <AdminButton variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </AdminButton>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[10px] border border-line-light bg-paper-light">
            <div className="grid min-w-[860px] grid-cols-[56px_minmax(0,2.2fr)_minmax(0,1.4fr)_110px_120px_150px] items-center gap-4 bg-[#F2EDE0] px-[18px] py-[13px] text-[11px] uppercase tracking-[0.14em] text-taupe">
              <span />
              <span>Categoría</span>
              <span>URL</span>
              <span>Productos</span>
              <span>Estado</span>
              <span className="justify-self-end">Orden</span>
            </div>
            {visibleCategories.map((category) => {
              const index = categories.indexOf(category);
              return (
                <div
                  key={category.id}
                  className="grid min-w-[860px] grid-cols-[56px_minmax(0,2.2fr)_minmax(0,1.4fr)_110px_120px_150px] items-center gap-4 border-t border-[#EDE6D6] px-[18px] py-3 transition-colors hover:bg-white"
                >
                  <div className="h-11 w-11 overflow-hidden rounded-md">
                    <ImagePlaceholder src={category.imageUrl} alt={category.imageAlt} />
                  </div>
                  <button
                    type="button"
                    onClick={() => openCategory(category.id)}
                    className="min-w-0 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
                  >
                    <div className="text-[15px] font-medium text-forest">
                      {category.name}
                      {category.featured ? (
                        <span className="ml-2 rounded-full bg-[#EFE9DA] px-2 py-0.5 text-[11px] uppercase tracking-[0.1em] text-ink">
                          En el menú
                        </span>
                      ) : null}
                    </div>
                    <div className="truncate text-[13px] text-taupe">{category.short}</div>
                  </button>
                  <span className="truncate text-sm text-ink">/{category.slug}</span>
                  <span className="text-sm text-ink">{productCounts[category.name] ?? 0}</span>
                  <StatusPill
                    live={category.status === "live"}
                    labelLive="Publicada"
                    className="justify-self-start"
                  />
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      aria-label={`Subir ${category.name}`}
                      disabled={filtersActive || saving || index === 0}
                      onClick={() => move(category.id, -1)}
                      className="rounded-full border border-[#CFC6B0] px-2.5 py-1 text-sm text-forest transition-colors hover:bg-[#EFE9DA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      aria-label={`Bajar ${category.name}`}
                      disabled={filtersActive || saving || index === categories.length - 1}
                      onClick={() => move(category.id, 1)}
                      className="rounded-full border border-[#CFC6B0] px-2.5 py-1 text-sm text-forest transition-colors hover:bg-[#EFE9DA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      ↓
                    </button>
                    <AdminButton variant="outline" onClick={() => openCategory(category.id)}>
                      Editar
                    </AdminButton>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

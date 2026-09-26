"use server";

import { revalidateTag } from "next/cache";
import { getCmsUser } from "@/lib/auth/session-guard";
import {
  CATALOG_TAG,
  categoryProductCounts,
  deleteCategory,
  deleteProduct,
  listCategories,
  reorderCategories,
  saveCategory,
  saveProduct,
} from "./catalog-repository";
import { isCatalogStatus, isCategory, isProduct } from "./catalog-validation";
import { slugify, type Category, type Product } from "./catalog-types";

export type ProductResult = { ok: true; product: Product } | { ok: false; error: string };
export type CategoryResult = { ok: true; category: Category } | { ok: false; error: string };
export type CatalogResult = { ok: true } | { ok: false; error: string };

/** Igual que al publicar el sitio: `{ expire: 0 }` en vez del perfil "max",
 * porque quien acaba de guardar abre la vista previa enseguida y no puede ver
 * el catálogo viejo mientras revalida. */
function revalidateCatalog(): void {
  revalidateTag(CATALOG_TAG, { expire: 0 });
}

export async function saveProductAction(
  product: unknown,
  nextStatus: unknown,
): Promise<ProductResult> {
  const user = await getCmsUser();
  if (!user) return { ok: false, error: "No autorizado." };

  if (!isProduct(product) || !isCatalogStatus(nextStatus)) {
    return { ok: false, error: "Los datos del producto no son válidos." };
  }

  const name = product.name.trim();
  if (!name) return { ok: false, error: "El producto necesita un nombre." };

  // Sin id todavía es un alta, y el id sale del nombre: un nombre que no deja
  // ninguna letra ni número no puede generar una URL.
  if (!product.id && !slugify(name)) {
    return { ok: false, error: "El nombre tiene que incluir alguna letra o número." };
  }

  const saved = await saveProduct({ ...product, name }, nextStatus, user.uid);
  revalidateCatalog();
  return { ok: true, product: saved };
}

export async function deleteProductAction(id: unknown): Promise<CatalogResult> {
  const user = await getCmsUser();
  if (!user) return { ok: false, error: "No autorizado." };

  if (typeof id !== "string" || !id) {
    return { ok: false, error: "Falta el producto a eliminar." };
  }

  await deleteProduct(id);
  revalidateCatalog();
  return { ok: true };
}

export async function saveCategoryAction(
  category: unknown,
  nextStatus: unknown,
): Promise<CategoryResult> {
  const user = await getCmsUser();
  if (!user) return { ok: false, error: "No autorizado." };

  if (!isCategory(category) || !isCatalogStatus(nextStatus)) {
    return { ok: false, error: "Los datos de la categoría no son válidos." };
  }

  const name = category.name.trim();
  if (!name) return { ok: false, error: "La categoría necesita un nombre." };

  const slug = slugify(category.slug || name);
  if (!slug) {
    return { ok: false, error: "El nombre tiene que incluir alguna letra o número." };
  }

  // Dos categorías con la misma URL harían que una tape a la otra en el sitio.
  const taken = (await listCategories()).some(
    (other) => other.id !== category.id && other.slug === slug,
  );
  if (taken) return { ok: false, error: `Ya hay otra categoría usando /${slug}.` };

  const saved = await saveCategory({ ...category, name, slug }, nextStatus, user.uid);
  revalidateCatalog();
  return { ok: true, category: saved };
}

export async function deleteCategoryAction(id: unknown): Promise<CatalogResult> {
  const user = await getCmsUser();
  if (!user) return { ok: false, error: "No autorizado." };

  if (typeof id !== "string" || !id) {
    return { ok: false, error: "Falta la categoría a eliminar." };
  }

  // El formulario ya deshabilita el botón, pero el conteo que ve el navegador
  // puede estar viejo: la categoría se vuelve a contar acá antes de borrar.
  const category = (await listCategories()).find((item) => item.id === id);
  if (!category) return { ok: false, error: "Esa categoría ya no existe." };

  const count = (await categoryProductCounts())[category.name] ?? 0;
  if (count > 0) {
    return {
      ok: false,
      error: `No se puede eliminar: ${count} ${count === 1 ? "producto la usa" : "productos la usan"}.`,
    };
  }

  await deleteCategory(id);
  revalidateCatalog();
  return { ok: true };
}

export async function reorderCategoriesAction(ids: unknown): Promise<CatalogResult> {
  const user = await getCmsUser();
  if (!user) return { ok: false, error: "No autorizado." };

  if (!Array.isArray(ids) || !ids.every((id) => typeof id === "string" && id)) {
    return { ok: false, error: "El orden recibido no es válido." };
  }

  await reorderCategories(ids);
  revalidateCatalog();
  return { ok: true };
}

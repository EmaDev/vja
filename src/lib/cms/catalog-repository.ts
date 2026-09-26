import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import type {
  CollectionReference,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import { siteDoc } from "./repository";
import { slugify, type CatalogStatus, type Category, type Product } from "./catalog-types";

/** Etiqueta de caché del catálogo público. Las acciones del CMS la invalidan
 * para que la landing y las fichas muestren el cambio sin redeploy. */
export const CATALOG_TAG = "catalog";

/** Tope del sufijo `-2`, `-3`… que desempata slugs repetidos. Si alguien llega
 * a cargar cien plantas con el mismo nombre, el problema es otro. */
const MAX_SLUG_ATTEMPTS = 100;

function productsRef(): CollectionReference {
  return siteDoc().collection("products");
}

function categoriesRef(): CollectionReference {
  return siteDoc().collection("categories");
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function status(value: unknown): CatalogStatus {
  return value === "live" ? "live" : "draft";
}

/** Un documento al que le falte un campo no puede llegar como `undefined` a un
 * input controlado del editor, así que todo se normaliza al leer. */
function toProduct(doc: DocumentSnapshot | QueryDocumentSnapshot): Product {
  const data = doc.data() ?? {};
  return {
    id: doc.id,
    name: str(data.name),
    latin: str(data.latin),
    category: str(data.category),
    light: str(data.light),
    water: str(data.water),
    height: str(data.height),
    difficulty: str(data.difficulty),
    pot: str(data.pot),
    petSafe: str(data.petSafe),
    status: status(data.status),
    photos: typeof data.photos === "number" ? data.photos : 0,
    short: str(data.short),
    long: str(data.long),
    tags: Array.isArray(data.tags) ? data.tags.filter((tag) => typeof tag === "string") : [],
    featured: data.featured === true,
  };
}

function toCategory(doc: DocumentSnapshot | QueryDocumentSnapshot): Category {
  const data = doc.data() ?? {};
  return {
    id: doc.id,
    name: str(data.name),
    slug: str(data.slug),
    short: str(data.short),
    description: str(data.description),
    status: status(data.status),
    featured: data.featured === true,
  };
}

/** Campos que van al documento. `id` es la clave, no un campo; `order` y las
 * marcas de tiempo las maneja el repositorio. */
function productFields(product: Product, nextStatus: CatalogStatus) {
  return {
    name: product.name,
    latin: product.latin,
    category: product.category,
    light: product.light,
    water: product.water,
    height: product.height,
    difficulty: product.difficulty,
    pot: product.pot,
    petSafe: product.petSafe,
    status: nextStatus,
    photos: product.photos,
    short: product.short,
    long: product.long,
    tags: product.tags,
    featured: product.featured,
  };
}

function categoryFields(category: Category, nextStatus: CatalogStatus) {
  return {
    name: category.name,
    slug: category.slug || slugify(category.name),
    short: category.short,
    description: category.description,
    status: nextStatus,
    featured: category.featured,
  };
}

/** Siguiente posición libre. El orden guardado es el orden en que se muestran:
 * lo nuevo se agrega al final en vez de colarse arriba. */
async function nextOrder(ref: CollectionReference): Promise<number> {
  const snap = await ref.orderBy("order", "desc").limit(1).get();
  const last = snap.docs[0]?.data().order;
  return typeof last === "number" ? last + 1 : 0;
}

/** Crea el documento con el primer id libre derivado del nombre.
 *
 * Usa `create()` en vez de "consultar y después escribir": es la propia
 * escritura la que falla si el id ya existe, así que dos altas simultáneas con
 * el mismo nombre no pueden pisarse. */
async function createWithSlugId(
  ref: CollectionReference,
  base: string,
  fields: Record<string, unknown>,
): Promise<string> {
  const payload = {
    ...fields,
    order: await nextOrder(ref),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  for (let attempt = 1; attempt <= MAX_SLUG_ATTEMPTS; attempt++) {
    const id = attempt === 1 ? base : `${base}-${attempt}`;
    try {
      await ref.doc(id).create(payload);
      return id;
    } catch (error) {
      // 6 = ALREADY_EXISTS. Cualquier otro error es real y tiene que subir.
      if ((error as { code?: number }).code !== 6) throw error;
    }
  }

  throw new Error(`No se pudo generar una URL libre a partir de "${base}".`);
}

/* -------------------------------------------------------------------------- */
/* Lecturas                                                                    */
/* -------------------------------------------------------------------------- */

/** Catálogo completo, en orden de publicación. El filtrado por estado se hace
 * en memoria a propósito: un `where` + `orderBy` obligaría a crear un índice
 * compuesto en Firestore y el catálogo de un vivero entra de sobra en una
 * lectura. */
async function readProducts(): Promise<Product[]> {
  const snap = await productsRef().orderBy("order").get();
  return snap.docs.map(toProduct);
}

async function readCategories(): Promise<Category[]> {
  const snap = await categoriesRef().orderBy("order").get();
  return snap.docs.map(toCategory);
}

/** Lecturas del CMS: siempre frescas, pero una sola por request. El layout
 * necesita los totales para la barra lateral y la página necesita la lista. */
export const listProducts = cache(readProducts);
export const listCategories = cache(readCategories);

/** Lecturas del sitio público. Cacheadas contra `CATALOG_TAG` para no ir a
 * Firestore en cada visita, igual que el contenido publicado. */
const getLiveProducts = unstable_cache(
  async () => (await readProducts()).filter((product) => product.status === "live"),
  ["catalog-live-products"],
  { tags: [CATALOG_TAG] },
);

const getLiveCategories = unstable_cache(
  async () => (await readCategories()).filter((category) => category.status === "live"),
  ["catalog-live-categories"],
  { tags: [CATALOG_TAG] },
);

export const loadLiveProducts = cache(getLiveProducts);
export const loadLiveCategories = cache(getLiveCategories);

/** Busca por segmento de URL. Los borradores quedan afuera a propósito: si el
 * catálogo no los lista, la ficha tampoco tiene que abrirlos. */
export async function findLiveProduct(slug: string): Promise<Product | undefined> {
  return (await loadLiveProducts()).find((product) => product.id === slug);
}

/* -------------------------------------------------------------------------- */
/* Escrituras                                                                  */
/* -------------------------------------------------------------------------- */

/** Alta o edición. Devuelve el producto tal como quedó guardado: en un alta el
 * id lo decide el servidor y el editor lo necesita para seguir trabajando. */
export async function saveProduct(
  product: Product,
  nextStatus: CatalogStatus,
  updatedBy: string,
): Promise<Product> {
  const fields = productFields(product, nextStatus);

  if (!product.id) {
    const id = await createWithSlugId(productsRef(), slugify(product.name), {
      ...fields,
      updatedBy,
    });
    return { ...product, id, status: nextStatus };
  }

  await productsRef()
    .doc(product.id)
    .set({ ...fields, updatedBy, updatedAt: FieldValue.serverTimestamp() }, { merge: true });

  return { ...product, status: nextStatus };
}

export async function deleteProduct(id: string): Promise<void> {
  await productsRef().doc(id).delete();
}

export async function saveCategory(
  category: Category,
  nextStatus: CatalogStatus,
  updatedBy: string,
): Promise<Category> {
  const fields = categoryFields(category, nextStatus);

  if (!category.id) {
    const id = await createWithSlugId(categoriesRef(), slugify(category.name), {
      ...fields,
      updatedBy,
    });
    return { ...category, id, slug: fields.slug, status: nextStatus };
  }

  await categoriesRef()
    .doc(category.id)
    .set({ ...fields, updatedBy, updatedAt: FieldValue.serverTimestamp() }, { merge: true });

  return { ...category, slug: fields.slug, status: nextStatus };
}

export async function deleteCategory(id: string): Promise<void> {
  await categoriesRef().doc(id).delete();
}

/** Reescribe el campo `order` siguiendo la lista recibida. */
export async function reorderCategories(ids: string[]): Promise<void> {
  const ref = categoriesRef();
  const batch = ref.firestore.batch();
  ids.forEach((id, index) => {
    batch.set(ref.doc(id), { order: index }, { merge: true });
  });
  await batch.commit();
}

/** Cuántos productos usa cada categoría, por nombre. Alimenta la columna
 * "Productos" del listado y el bloqueo de borrado. */
export async function categoryProductCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const product of await listProducts()) {
    counts[product.category] = (counts[product.category] ?? 0) + 1;
  }
  return counts;
}

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
import {
  slugify,
  type CatalogStatus,
  type Category,
  type Product,
  type ProductPhoto,
} from "./catalog-types";

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

/** Normaliza la galería de un producto.
 *
 * Antes de que se pudieran cargar fotos, `photos` guardaba un número: cuántas
 * imágenes iba a tener la ficha. Esos documentos siguen en Firestore, así que
 * cualquier cosa que no sea una lista de fotos se lee como galería vacía en vez
 * de romper el editor. */
function photos(value: unknown): ProductPhoto[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    if (typeof item !== "object" || item === null) return [];
    const data = item as Record<string, unknown>;
    const imageUrl = str(data.imageUrl);
    if (!imageUrl) return [];
    // El id de respaldo sale de la posición y no de un aleatorio: así una misma
    // foto se lee siempre con el mismo id y no cambia de identidad entre dos
    // lecturas, que es lo que React usa como clave.
    return [{ id: str(data.id) || `photo-${index}`, imageUrl, imageAlt: str(data.imageAlt) }];
  });
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
    status: status(data.status),
    photos: photos(data.photos),
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
    imageUrl: str(data.imageUrl),
    imageAlt: str(data.imageAlt),
  };
}

/** Campos que van al documento. `id` es la clave, no un campo; `order` y las
 * marcas de tiempo las maneja el repositorio. */
function productFields(product: Product, nextStatus: CatalogStatus) {
  return {
    name: product.name,
    latin: product.latin,
    category: product.category,
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
    imageUrl: category.imageUrl,
    imageAlt: category.imageAlt,
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
 * Firestore en cada visita, igual que el contenido publicado.
 *
 * El sufijo de versión en la clave no es decorativo: lo cacheado sobrevive al
 * deploy, así que un payload guardado con la forma vieja le llegaría tal cual al
 * código nuevo. `toProduct` normaliza lo que viene de Firestore, pero no lo que
 * sale del caché. Cuando cambie la forma de `Product` o `Category` —como cuando
 * `photos` pasó de ser un conteo a la lista de fotos— hay que subir el número. */
const getLiveProducts = unstable_cache(
  async () => (await readProducts()).filter((product) => product.status === "live"),
  ["catalog-live-products-v2"],
  { tags: [CATALOG_TAG] },
);

const getLiveCategories = unstable_cache(
  async () => (await readCategories()).filter((category) => category.status === "live"),
  ["catalog-live-categories-v2"],
  { tags: [CATALOG_TAG] },
);

export const loadLiveProducts = cache(getLiveProducts);
export const loadLiveCategories = cache(getLiveCategories);

/** Busca por segmento de URL. Los borradores quedan afuera a propósito: si el
 * catálogo no los lista, la ficha tampoco tiene que abrirlos. */
export async function findLiveProduct(slug: string): Promise<Product | undefined> {
  return (await loadLiveProducts()).find((product) => product.id === slug);
}

/** Cuándo se editó por última vez cada documento, por id, en ISO.
 *
 * Es el `lastmod` del sitemap y nada más, así que va por separado en vez de
 * sumar un campo a `Product`: ese tipo lo usa el formulario del panel en el
 * cliente y no tiene por qué cargar con una fecha que ahí no se mira.
 *
 * Que sea exacto importa: Google usa `lastmod` para decidir qué revisita, pero
 * lo ignora si no le cierra. Un `new Date()` en cada build —que es el atajo
 * habitual— le dice que el sitio entero cambió en cada deploy, y el resultado
 * es que deja de creerle al sitemap. De ahí que los documentos sin `updatedAt`
 * queden sin fecha en vez de recibir una inventada. */
async function readUpdatedAt(ref: CollectionReference): Promise<Record<string, string>> {
  const snap = await ref.get();
  const dates: Record<string, string> = {};

  for (const doc of snap.docs) {
    // `Timestamp` de Firestore. Se consulta por el método en lugar de por
    // `instanceof` para no acoplar esto a la instancia del SDK.
    const value: unknown = doc.data().updatedAt;
    const toDate = (value as { toDate?: () => Date } | undefined)?.toDate;
    if (typeof toDate === "function") {
      dates[doc.id] = toDate.call(value).toISOString();
    }
  }

  return dates;
}

const getCatalogUpdatedAt = unstable_cache(
  async () => ({
    products: await readUpdatedAt(productsRef()),
    categories: await readUpdatedAt(categoriesRef()),
  }),
  ["catalog-updated-at-v1"],
  { tags: [CATALOG_TAG] },
);

export const loadCatalogUpdatedAt = cache(getCatalogUpdatedAt);

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

/** Tipos del catálogo (productos y categorías) y los helpers de slug que
 * comparten el CMS y el sitio público. Sin `server-only`: el formulario del
 * editor los usa en el cliente. */

export type CatalogStatus = "live" | "draft";

export interface Product {
  /** Id del documento en Firestore y segmento de URL de la ficha.
   *
   * Se deriva del nombre al crear y después no cambia: renombrar un producto no
   * tiene que romper el enlace que ya circula. */
  id: string;
  name: string;
  latin: string;
  category: string;
  light: string;
  water: string;
  height: string;
  difficulty: string;
  pot: string;
  petSafe: string;
  status: CatalogStatus;
  photos: number;
  short: string;
  long: string;
  tags: string[];
  featured: boolean;
}

export interface Category {
  id: string;
  /** Nombre visible; es también el valor que guarda `Product.category`. */
  name: string;
  /** Segmento de URL. A diferencia del de producto, se puede editar a mano, así
   * que no sirve como id del documento. */
  slug: string;
  /** Bajada corta que acompaña al título en la portada de la categoría. */
  short: string;
  description: string;
  status: CatalogStatus;
  /** Aparece en el menú de navegación del sitio. */
  featured: boolean;
}

/** Convierte un nombre en segmento de URL. Devuelve `""` si no queda ningún
 * carácter utilizable, que es cómo el repositorio detecta un nombre inválido. */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const categorySlug = slugify;

/** Ruta pública de la ficha. El `id` ya es el slug del producto. */
export function productHref(product: Product): string {
  return `/producto/${product.id}`;
}

/** La URL que muestra el editor antes de guardar. Un producto nuevo todavía no
 * tiene id, así que se previsualiza el slug que le va a tocar. */
export function productUrlPreview(product: Product): string {
  return `vjaplantas.com.ar/producto/${product.id || slugify(product.name)}`;
}

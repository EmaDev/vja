import type { MetadataRoute } from "next";
import {
  loadCatalogUpdatedAt,
  loadLiveCategories,
  loadLiveProducts,
} from "@/lib/cms/catalog-repository";
import { productCover, productHref } from "@/lib/cms/catalog-types";
import { getPublishedAtCached } from "@/lib/cms/repository";
import { absoluteUrl } from "@/lib/seo/site";

/** Mapa del sitio, armado con lo que está publicado.
 *
 * Sólo entran las URL que un visitante puede abrir y que son canónicas de sí
 * mismas: la portada, el catálogo completo, el catálogo filtrado por cada
 * categoría publicada y la ficha de cada planta publicada. Las páginas internas
 * del paginado quedan afuera —Google llega a ellas siguiendo los enlaces, y el
 * sitemap es para declarar contenido, no recorridos— igual que el panel, que no
 * se indexa.
 *
 * Como todo sale de las lecturas cacheadas del catálogo y del contenido
 * publicado, publicar desde el panel regenera también este archivo: no hace
 * falta un redeploy para que una planta nueva aparezca en el sitemap. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, updatedAt, publishedAt] = await Promise.all([
    loadLiveProducts(),
    loadLiveCategories(),
    loadCatalogUpdatedAt(),
    getPublishedAtCached(),
  ]);

  // La portada cambia cuando se publica desde el panel; el catálogo, cuando se
  // toca cualquier planta. Se usa la fecha más reciente de las que hay.
  const lastProductEdit = Object.values(updatedAt.products).sort().at(-1);

  return [
    {
      url: absoluteUrl("/"),
      lastModified: publishedAt,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/catalogo"),
      lastModified: lastProductEdit,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...categories.map((category) => ({
      // Mismo canónico que declara la página del catálogo filtrado.
      url: absoluteUrl(`/catalogo?categoria=${encodeURIComponent(category.slug)}`),
      lastModified: updatedAt.categories[category.id],
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...products.map((product) => {
      const cover = productCover(product);
      return {
        url: absoluteUrl(productHref(product)),
        lastModified: updatedAt.products[product.id],
        changeFrequency: "monthly" as const,
        priority: 0.8,
        // Sitemap de imágenes: le dice a Google Imágenes qué foto corresponde a
        // qué planta, que es por donde entra buena parte de la búsqueda de un
        // vivero ("cómo es una monstera").
        images: cover ? [cover.imageUrl] : undefined,
      };
    }),
  ];
}

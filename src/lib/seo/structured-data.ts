import "server-only";
import type { Category, Product } from "@/lib/cms/catalog-types";
import { productCover, productHref } from "@/lib/cms/catalog-types";
import { markdownToPlain } from "@/lib/cms/markdown";
import { socialLinks } from "@/lib/cms/social";
import type {
  ContactSection,
  FooterSection,
  HeaderSection,
  SeoSection,
  ShippingSection,
  VisitSection,
} from "@/lib/cms/types";
import { openingHoursSpecification } from "./opening-hours";
import { FALLBACK_SITE_NAME, SITE_ORIGIN, absoluteUrl } from "./site";

/** Datos estructurados del sitio.
 *
 * Todo se arma con lo que el cliente cargó en el panel: nada está escrito a
 * mano acá, y un campo vacío no viaja al JSON-LD en vez de viajar en blanco.
 * Google trata un dato estructurado que no coincide con lo visible en la página
 * como spam, así que la regla es: si no está en la página, no está acá.
 *
 * Los `@id` son anclas del sitio (`/#negocio`) para que los nodos se puedan
 * referenciar entre sí —la ficha de una planta apunta al negocio que la vende
 * sin repetir sus datos— y para que Google entienda que es la misma entidad en
 * todas las páginas. */

const BUSINESS_ID = absoluteUrl("/#negocio");
const WEBSITE_ID = absoluteUrl("/#sitio");

/** Sólo las entradas con algo escrito. Un `sameAs: [""]` o un `telephone: ""`
 * es peor que la ausencia del campo: Google lo lee como dato incompleto. */
function clean(values: (string | undefined | null)[]): string[] {
  return values.map((value) => value?.trim() ?? "").filter(Boolean);
}

/** Descarta las claves vacías antes de serializar. Evita el `if` por campo en
 * cada constructor de abajo. */
function compact<T extends Record<string, unknown>>(node: T): T {
  return Object.fromEntries(
    Object.entries(node).filter(([, value]) => {
      if (value === undefined || value === null || value === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    }),
  ) as T;
}

export interface SiteGraphInput {
  header?: HeaderSection;
  contact?: ContactSection;
  footer?: FooterSection;
  seo?: SeoSection;
  visit?: VisitSection;
  shipping?: ShippingSection;
}

function businessName(input: SiteGraphInput): string {
  return (
    clean([input.contact?.storeName, input.header?.logoText])[0] ?? FALLBACK_SITE_NAME
  );
}

/** El vivero como negocio físico.
 *
 * `GardenStore` en vez de `LocalBusiness` a secas: es un subtipo de schema.org
 * para viveros, y cuanto más específico el tipo, mejor entiende Google de qué
 * se trata el local.
 *
 * `priceRange` queda afuera aunque Google lo liste como recomendado: el catálogo
 * no maneja precios, así que cualquier valor sería inventado. */
function businessNode(input: SiteGraphInput) {
  const { contact, footer, seo, visit, shipping } = input;

  const address = contact?.address?.trim();
  const socials = socialLinks(footer);
  const zones = clean((shipping?.zones ?? []).map((zone) => zone.locality));

  return compact({
    "@type": "GardenStore",
    "@id": BUSINESS_ID,
    name: businessName(input),
    description: seo?.metaDescription?.trim(),
    url: absoluteUrl("/"),
    image: clean([seo?.shareImageUrl]),
    telephone: clean([contact?.phone])[0],
    email: clean([contact?.email])[0],
    // El panel guarda la dirección como una línea de texto, que es como la
    // escribe el vivero y como se lee en la página. Se declara el país porque
    // es lo único que se puede afirmar sin partir ese texto a la adivinanza.
    address: address
      ? { "@type": "PostalAddress", streetAddress: address, addressCountry: "AR" }
      : undefined,
    openingHoursSpecification: openingHoursSpecification(contact?.hours ?? []),
    hasMap: clean([visit?.directionsUrl])[0],
    // Las localidades del verificador de envíos: es la zona a la que el vivero
    // llega de verdad, declarada por el propio cliente.
    areaServed: [...new Set(zones)].map((locality) => ({
      "@type": "City",
      name: locality,
    })),
    // Las URL completas, no los usuarios: `sameAs` pide direcciones, y
    // tienen que ser las mismas a las que enlaza el pie de la página.
    sameAs: clean([socials.instagram, socials.pinterest]),
  });
}

function websiteNode(input: SiteGraphInput) {
  return compact({
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: businessName(input),
    url: SITE_ORIGIN,
    inLanguage: "es-AR",
    publisher: { "@id": BUSINESS_ID },
  });
}

/** El grafo de la portada: el sitio y el negocio, una sola vez.
 *
 * Un `@graph` en lugar de dos `<script>` sueltos para que los `@id` se resuelvan
 * entre sí dentro del mismo documento. */
export function siteGraph(input: SiteGraphInput) {
  return {
    "@context": "https://schema.org",
    "@graph": [websiteNode(input), businessNode(input)],
  };
}

export interface Crumb {
  name: string;
  /** Ruta relativa del sitio. La última miga puede omitirla: es la página en la
   * que ya está el visitante. */
  path?: string;
}

/** Las migas de pan que Google dibuja arriba del resultado, en lugar de la URL
 * cruda. */
export function breadcrumbGraph(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) =>
      compact({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.path ? absoluteUrl(crumb.path) : undefined,
      }),
    ),
  };
}

/** Una planta del catálogo.
 *
 * Sin `offers`: el catálogo es una vidriera, no una tienda —no hay precio ni
 * carrito— y un `Offer` sin precio es un dato incompleto. Eso significa que
 * Google no va a dibujar el resultado enriquecido de producto (necesita precio
 * y disponibilidad), pero sí entiende qué es la página y qué planta describe,
 * que es lo que se puede afirmar con los datos que hay. */
export function productGraph(product: Product, category?: Category) {
  const cover = productCover(product);
  const photos = clean(product.photos.map((photo) => photo.imageUrl));

  return {
    "@context": "https://schema.org",
    "@graph": [
      compact({
        "@type": "Product",
        "@id": absoluteUrl(`${productHref(product)}#producto`),
        name: product.name.trim(),
        // El nombre científico es el que identifica la especie sin ambigüedad:
        // es el alias por el que la busca quien sabe lo que busca.
        alternateName: clean([product.latin])[0],
        description: markdownToPlain(product.long).trim() || product.short.trim(),
        image: photos,
        category: clean([category?.name, product.category])[0],
        url: absoluteUrl(productHref(product)),
        keywords: clean(product.tags).join(", "),
        // Quién la vende. El nodo completo del negocio vive en la portada; acá
        // va sólo la referencia.
        seller: { "@id": BUSINESS_ID },
      }),
      compact({
        "@type": "ItemPage",
        url: absoluteUrl(productHref(product)),
        name: product.name.trim(),
        primaryImageOfPage: cover?.imageUrl,
        isPartOf: { "@id": WEBSITE_ID },
        inLanguage: "es-AR",
      }),
    ],
  };
}

/** La lista del catálogo.
 *
 * Declara las plantas de la página que se está viendo, en el orden en que se
 * ven. `ItemList` le ahorra a Google tener que deducir de la grilla cuáles son
 * los elementos y en qué orden, y el `position` arranca en el corte de la
 * página para que la 2 no vuelva a numerar desde 1. */
export function catalogGraph({
  products,
  firstPosition,
  path,
  name,
  description,
}: {
  products: Product[];
  firstPosition: number;
  path: string;
  name: string;
  description?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      compact({
        "@type": "CollectionPage",
        url: absoluteUrl(path),
        name,
        description: description?.trim(),
        isPartOf: { "@id": WEBSITE_ID },
        inLanguage: "es-AR",
      }),
      {
        "@type": "ItemList",
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: firstPosition + index,
          url: absoluteUrl(productHref(product)),
          name: product.name.trim(),
        })),
      },
    ],
  };
}

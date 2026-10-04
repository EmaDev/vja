import type { MetadataRoute } from "next";
import { SITE_ORIGIN, absoluteUrl } from "@/lib/seo/site";

/** En Vercel, `VERCEL_ENV` vale `production`, `preview` o `development`. Un
 * deploy de preview tiene su propia URL pública y, si queda enlazada en algún
 * lado, Google la indexa y compite con el dominio real por el mismo contenido.
 *
 * Se mira el entorno y no `NEXT_PUBLIC_SITE_URL` a propósito: si la condición
 * fuera "falta la variable", olvidarse de cargarla en producción bloquearía el
 * sitio entero, que es el peor error de SEO posible y el más difícil de notar.
 * El entorno, en cambio, lo pone la plataforma y nadie se lo olvida. */
const isPreview =
  process.env.VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "development";

export default function robots(): MetadataRoute.Robots {
  if (isPreview) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        // El panel y el login: nada que indexar y, de paso, no hay razón para
        // que la puerta del CMS aparezca en una búsqueda.
        "/cms",
        // Endpoints de sesión y de subida: devuelven JSON o errores.
        "/api/",
        // La galería de variantes, que ya devuelve 404 en producción.
        "/dev/",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_ORIGIN,
  };
}

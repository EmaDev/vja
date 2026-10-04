import type { Metadata, Viewport } from "next";
import { dmSans, instrumentSerif } from "@/lib/fonts";
import { FALLBACK_SITE_NAME, siteMetadataBase } from "@/lib/seo/site";
import "./globals.css";

export const metadata: Metadata = {
  // Base de todos los campos de metadata que llevan URL. Sin esto, un canónico
  // relativo rompe el build de una página estática, y en las dinámicas se
  // resuelve contra `localhost`, que es peor: se publica y nadie se entera.
  metadataBase: siteMetadataBase,
  // Un título pelado y no un `template`: cada página pública arma el suyo
  // completo con el nombre que el cliente cargó en el panel, y un sufijo
  // automático acá lo duplicaría ("Catálogo · VJA Plantas · VJA Plantas").
  // Este valor es el que queda en las rutas que no declaran título propio.
  title: FALLBACK_SITE_NAME,
  description: "Vivero con catálogo de plantas de interior y exterior.",
  applicationName: FALLBACK_SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Habilita la miniatura grande en los resultados y el fragmento sin
      // recortar. Son las dos cosas que más cambian cómo se ve el sitio en
      // Google y por defecto vienen limitadas.
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // El teléfono del local sí conviene que el celular lo reconozca; la dirección
  // y el mail ya son enlaces propios y Safari los rompe cuando los detecta solo.
  formatDetection: { telephone: true, address: false, email: false },
  appleWebApp: { title: FALLBACK_SITE_NAME },
};

export const viewport: Viewport = {
  // `--color-forest` de `globals.css`, para que la barra del navegador en
  // Android y la de Safari acompañen la página en vez de cortarla.
  themeColor: "#17301f",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      // `es-AR` y no `es`: el contenido es de Buenos Aires, con precios,
      // teléfonos y modismos de acá. Es lo que lee un lector de pantalla para
      // elegir pronunciación y lo que Google usa para elegir a quién mostrarlo.
      lang="es-AR"
      // Ver el comentario de `scroll-behavior` en `globals.css`: le dice al
      // router que el scroll suave es intencional y que lo suspenda mientras
      // cambia de página.
      data-scroll-behavior="smooth"
      className={`${instrumentSerif.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { dmSans, instrumentSerif } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "VJA Plantas",
  description: "Landing page y panel de administración de contenido de VJA Plantas.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
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

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Las fotos se sirven directo desde Firebase Storage, sin pasar por el
    // optimizador de Vercel: el plan gratuito incluye 5.000 transformaciones
    // por mes y el sitio las agotaba. No se pierde mucho, porque el panel ya
    // las reescala (2000 px como máximo) y las convierte a WebP antes de
    // subirlas (ver `lib/cms/image-compression.ts`). La caché del navegador la
    // da el `Cache-Control` que se le pone a cada archivo al guardarlo (ver
    // `lib/cms/media.ts`).
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: `/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/**`,
      },
    ],
  },
};

export default nextConfig;

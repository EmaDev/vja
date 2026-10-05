// One-off admin utility: las imágenes del CMS se suben del navegador derecho
// al bucket con una URL firmada (ver `lib/cms/use-image-upload.ts`), así que
// GCS exige que el origen del panel esté en la configuración CORS del bucket.
// Esa configuración vive en el bucket, no en el repo: un deploy no la cambia,
// y si falta, la subida muere en el preflight con "La subida a Storage falló.".
//
// Hay que correrlo una vez por cada dominio nuevo desde el que se use el panel.
// Usage:
//   node scripts/set-storage-cors.mjs https://vja.vercel.app
//
// Los orígenes se pasan completos (con esquema, sin barra final) y reemplazan
// la lista anterior; `http://localhost:3000` se agrega siempre para no dejar
// sin subidas al entorno de desarrollo.
import { readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

// Loaded by hand instead of via `node --env-file` — ver scripts/set-cms-role.mjs.
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (!match) continue;
  const [, key, rawValue] = match;
  const value = rawValue.replace(/^"(.*)"$/, "$1");
  process.env[key] ??= value;
}

const DEV_ORIGIN = "http://localhost:3000";

const origins = process.argv.slice(2);

if (origins.length === 0 || !origins.every((origin) => /^https?:\/\/[^/]+$/.test(origin))) {
  console.error("Uso: node scripts/set-storage-cors.mjs <origen> [<origen>...]");
  console.error("Cada origen va con esquema y sin barra final. Ej.: https://vja.vercel.app");
  process.exit(1);
}

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const bucket = getStorage(app).bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);

// Solo PUT: la lectura pública de `media/**` no pasa por el navegador —
// `next/image` baja el archivo desde el servidor— y el borrado lo hace el
// Admin SDK, también del lado del servidor.
await bucket.setCorsConfiguration([
  {
    origin: [...new Set([DEV_ORIGIN, ...origins])],
    method: ["PUT"],
    responseHeader: ["Content-Type"],
    maxAgeSeconds: 3600,
  },
]);

const [metadata] = await bucket.getMetadata();
console.log(`${bucket.name} -> CORS:`);
console.log(JSON.stringify(metadata.cors, null, 2));

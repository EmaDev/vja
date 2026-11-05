// One-off admin utility: le pone el `Cache-Control` de las fotos del sitio a
// los archivos de `media/` que se subieron antes de que `saveMediaRecord` lo
// hiciera solo (ver `MEDIA_CACHE_CONTROL` en `src/lib/cms/media.ts`). Sin ese
// encabezado, Firebase sirve las fotos sin caché y cada visita las vuelve a
// descargar.
//
// Es idempotente: saltea los archivos que ya lo tienen.
// Usage:
//   node scripts/set-media-cache-control.mjs
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

// Mismo valor que `MEDIA_CACHE_CONTROL` en `src/lib/cms/media.ts`.
const CACHE_CONTROL = "public, max-age=31536000, immutable";

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const bucket = getStorage(app).bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);

const [files] = await bucket.getFiles({ prefix: "media/" });

let updated = 0;
for (const file of files) {
  if (file.metadata.cacheControl === CACHE_CONTROL) continue;
  await file.setMetadata({ cacheControl: CACHE_CONTROL });
  updated += 1;
  console.log(`ok  ${file.name}`);
}

console.log(`${bucket.name}: ${updated} actualizados, ${files.length - updated} ya estaban.`);

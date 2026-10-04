import "server-only";
import { unstable_cache } from "next/cache";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import type { CollectionReference } from "firebase-admin/firestore";
import { getAdminApp } from "@/lib/firebase/admin";
import { initialSections } from "./mock-data";
import { isCmsSection } from "./validation";
import type { CmsSection } from "./types";

const SITE_ID = "vja-plantas";
const MAX_VERSIONS = 10;

/** Etiqueta de caché del contenido publicado. `publishAction` la invalida para que
 * la landing se regenere al publicar, sin esperar a un redeploy. */
export const PUBLISHED_TAG = "published-site";

interface SiteRevision {
  sections: CmsSection[];
}

export function siteDoc() {
  return getFirestore(getAdminApp()).collection("sites").doc(SITE_ID);
}

/** Devuelve siempre una sección por cada `kind` del seed, en ese orden.
 *
 * El editor busca cada sección por su `kind` y asume que existe, así que un draft
 * incompleto —por ejemplo uno guardado antes de que existieran `cards`, `contact` o
 * `seo`— rompería la pantalla. Completa lo que falte con el seed para no alimentar
 * campos `undefined` a inputs controlados.
 *
 * Cuando una sección guardada no valida contra el esquema actual, casi siempre es
 * porque la sección ganó campos nuevos después de que se guardó. En ese caso se
 * rellena con el seed sólo lo que falta, en vez de tirar abajo todo lo que el
 * cliente ya había cargado. Sólo se descarta entera si ni siquiera así valida. */
function normalizeSections(sections: unknown): CmsSection[] {
  const stored = migrateHours(Array.isArray(sections) ? sections : []);

  return initialSections.map((seed) => {
    const match = stored.find((section) => section.kind === seed.kind);

    if (!match) return seed;
    if (isCmsSection(match)) return match;

    const merged = { ...seed, ...match };
    return isCmsSection(merged) ? merged : seed;
  });
}

/** Los horarios se cargaban dos veces: una lista de tramos en "Visitanos" y un
 * renglón suelto de texto en Contacto. Ahora viven sólo en Contacto, así que lo
 * guardado antes del cambio se muda acá en la lectura: la lista de "Visitanos"
 * —la que el cliente cargó con detalle— pasa a Contacto, y si no hay ninguna se
 * usa el texto viejo como un único tramo.
 *
 * Sin esto `normalizeSections` no podría validar la sección de contacto vieja
 * (su `hours` es un string donde ahora va una lista) y la reemplazaría entera por
 * el seed, perdiendo la dirección y el teléfono del cliente. */
function migrateHours(sections: unknown[]): Record<string, unknown>[] {
  // Lo que no sea un objeto no describe ninguna sección: `normalizeSections` lo
  // iba a descartar igual, así que se va acá y el resto trabaja con registros.
  const stored = sections.filter(
    (section): section is Record<string, unknown> => typeof section === "object" && section !== null,
  );

  const visit = stored.find((section) => section.kind === "visit");
  const inherited = Array.isArray(visit?.hours) ? visit.hours : null;

  return stored.map((record) => {
    if (record.kind === "visit" && "hours" in record) {
      // La copia vieja se borra en vez de arrastrarse: el guard de "Visitanos" ya
      // no la mira, y dejarla ahí volvería a guardarse en cada borrador.
      const rest = { ...record };
      delete rest.hours;
      return rest;
    }

    if (record.kind === "contact" && typeof record.hours === "string") {
      const legacy = record.hours.trim();
      return {
        ...record,
        hours: inherited ?? (legacy ? [{ id: "hrs-legacy", days: legacy, time: "" }] : []),
      };
    }

    return record;
  });
}

export async function getDraft(): Promise<CmsSection[]> {
  const snap = await siteDoc().get();
  const draft = snap.data()?.draft as SiteRevision | undefined;
  return normalizeSections(draft?.sections);
}

export async function getPublished(): Promise<CmsSection[]> {
  const snap = await siteDoc().get();
  const published = snap.data()?.published as SiteRevision | undefined;
  if (!published) return [];
  return normalizeSections(published.sections);
}

/** Versión cacheada de `getPublished()` para la landing pública.
 *
 * Sin esto cada visita sería una lectura de Firestore. El proyecto no usa
 * Cache Components (`use cache` pide el flag `cacheComponents`), así que va por
 * el modelo anterior: `unstable_cache` + `revalidateTag` al publicar. */
export const getPublishedCached = unstable_cache(getPublished, ["published-sections"], {
  tags: [PUBLISHED_TAG],
});

/** Cuándo se publicó por última vez, en ISO, o `undefined` si todavía no se
 * publicó nada. Es el `lastmod` de la portada en el sitemap.
 *
 * Va por separado de `getPublished()` en vez de sumarse a su valor de retorno
 * porque eso cambiaría la forma de lo que queda cacheado, y lo cacheado
 * sobrevive al deploy: el código nuevo recibiría el payload viejo. Es una
 * lectura más, pero sólo cuando se regenera el sitemap. */
async function getPublishedAt(): Promise<string | undefined> {
  const snap = await siteDoc().get();
  const published = snap.data()?.published as { publishedAt?: unknown } | undefined;
  const toDate = (published?.publishedAt as { toDate?: () => Date } | undefined)?.toDate;
  return typeof toDate === "function"
    ? toDate.call(published?.publishedAt).toISOString()
    : undefined;
}

export const getPublishedAtCached = unstable_cache(getPublishedAt, ["published-at-v1"], {
  tags: [PUBLISHED_TAG],
});

export async function saveDraft(sections: CmsSection[], updatedBy: string): Promise<void> {
  await siteDoc().set(
    {
      draft: {
        sections,
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy,
      },
    },
    { merge: true },
  );
}

export async function publish(publishedBy: string): Promise<void> {
  const db = getFirestore(getAdminApp());
  const ref = siteDoc();
  const versionsRef = ref.collection("versions");

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const draft = snap.data()?.draft as SiteRevision | undefined;
    const sections = draft?.sections ?? initialSections;
    const publishedAt = FieldValue.serverTimestamp();

    tx.set(ref, { published: { sections, publishedAt, publishedBy } }, { merge: true });
    tx.set(versionsRef.doc(), { sections, publishedAt, publishedBy });
  });

  await pruneOldVersions(versionsRef);
}

/** Mantiene solo las últimas `MAX_VERSIONS` publicaciones (ver PLAN-DESARROLLO.md sección 3). */
async function pruneOldVersions(versionsRef: CollectionReference): Promise<void> {
  const snap = await versionsRef.orderBy("publishedAt", "desc").get();
  const extra = snap.docs.slice(MAX_VERSIONS);
  if (extra.length === 0) return;

  const db = getFirestore(getAdminApp());
  const batch = db.batch();
  for (const doc of extra) {
    batch.delete(doc.ref);
  }
  await batch.commit();
}

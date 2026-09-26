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
  const stored = Array.isArray(sections) ? sections : [];

  return initialSections.map((seed) => {
    const match = stored.find(
      (section): section is Record<string, unknown> =>
        typeof section === "object" && section !== null && section.kind === seed.kind,
    );

    if (!match) return seed;
    if (isCmsSection(match)) return match;

    const merged = { ...seed, ...match };
    return isCmsSection(merged) ? merged : seed;
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

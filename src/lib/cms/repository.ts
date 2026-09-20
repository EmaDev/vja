import "server-only";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import type { CollectionReference } from "firebase-admin/firestore";
import { getAdminApp } from "@/lib/firebase/admin";
import { initialSections } from "./mock-data";
import type { CmsSection } from "./types";

const SITE_ID = "vja-plantas";
const MAX_VERSIONS = 10;

interface SiteRevision {
  sections: CmsSection[];
}

function siteDoc() {
  return getFirestore(getAdminApp()).collection("sites").doc(SITE_ID);
}

export async function getDraft(): Promise<CmsSection[]> {
  const snap = await siteDoc().get();
  const draft = snap.data()?.draft as SiteRevision | undefined;
  return draft?.sections ?? initialSections;
}

export async function getPublished(): Promise<CmsSection[]> {
  const snap = await siteDoc().get();
  const published = snap.data()?.published as SiteRevision | undefined;
  return published?.sections ?? [];
}

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

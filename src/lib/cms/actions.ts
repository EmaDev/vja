"use server";

import { revalidateTag } from "next/cache";
import { getCmsUser } from "@/lib/auth/session-guard";
import { PUBLISHED_TAG, publish as publishSite, saveDraft as saveDraftRepo } from "./repository";
import { isCmsSectionArray } from "./validation";
import type { CmsSection } from "./types";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function saveDraftAction(sections: CmsSection[]): Promise<ActionResult> {
  const user = await getCmsUser();
  if (!user) {
    return { ok: false, error: "No autorizado." };
  }

  if (!isCmsSectionArray(sections)) {
    return { ok: false, error: "Los datos de la sección no son válidos." };
  }

  await saveDraftRepo(sections, user.uid);
  return { ok: true };
}

export async function publishAction(): Promise<ActionResult> {
  const user = await getCmsUser();
  if (!user) {
    return { ok: false, error: "No autorizado." };
  }

  await publishSite(user.uid);
  // `{ expire: 0 }` en vez del perfil "max": tras publicar, el editor abre la
  // vista previa enseguida y no puede ver contenido viejo mientras revalida.
  revalidateTag(PUBLISHED_TAG, { expire: 0 });
  return { ok: true };
}

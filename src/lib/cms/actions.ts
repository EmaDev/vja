"use server";

import { getCmsUser } from "@/lib/auth/session-guard";
import { publish as publishSite, saveDraft as saveDraftRepo } from "./repository";
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
  return { ok: true };
}

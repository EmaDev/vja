"use server";

import { getCmsUser } from "@/lib/auth/session-guard";
import { deleteMediaRecord, saveMediaRecord, STORAGE_PATH_PATTERN } from "./media";
import type { ActionResult } from "./actions";

export interface SaveMediaActionInput {
  mediaId: string;
  storagePath: string;
  publicUrl: string;
  alt: string;
  width: number;
  height: number;
  bytes: number;
}

export async function saveMediaAction(input: SaveMediaActionInput): Promise<ActionResult> {
  const user = await getCmsUser();
  if (!user) {
    return { ok: false, error: "No autorizado." };
  }

  if (!STORAGE_PATH_PATTERN.test(input.storagePath)) {
    return { ok: false, error: "Ruta de archivo inválida." };
  }
  if (!input.alt.trim()) {
    return { ok: false, error: "El texto alternativo es obligatorio." };
  }
  if (![input.width, input.height, input.bytes].every((n) => Number.isFinite(n) && n > 0)) {
    return { ok: false, error: "Datos de imagen inválidos." };
  }

  await saveMediaRecord({ ...input, createdBy: user.uid });
  return { ok: true };
}

export async function deleteMediaAction(storagePath: string): Promise<ActionResult> {
  const user = await getCmsUser();
  if (!user) {
    return { ok: false, error: "No autorizado." };
  }

  if (!STORAGE_PATH_PATTERN.test(storagePath)) {
    return { ok: false, error: "Ruta de archivo inválida." };
  }

  await deleteMediaRecord(storagePath);
  return { ok: true };
}

"use server";

import { revalidateTag } from "next/cache";
import { getCmsUser } from "@/lib/auth/session-guard";
import {
  PROMOTIONS_TAG,
  deletePromotion,
  reorderPromotions,
  savePromotion,
} from "./promo-repository";
import { isPromotion } from "./promo-validation";
import type { Promotion, PromotionStatus } from "./promo-types";

export type PromotionResult = { ok: true; promotion: Promotion } | { ok: false; error: string };
export type PromotionActionResult = { ok: true } | { ok: false; error: string };

/** Igual que al publicar el sitio: `{ expire: 0 }` en vez del perfil "max",
 * porque quien acaba de guardar abre la landing enseguida para ver el popup. */
function revalidatePromotions(): void {
  revalidateTag(PROMOTIONS_TAG, { expire: 0 });
}

function isPromotionStatus(value: unknown): value is PromotionStatus {
  return value === "live" || value === "draft";
}

/** El calendario puede quedar sin sentido aunque cada campo sea válido por
 * separado: un rango al revés o un modo sin ningún día elegido no se activa
 * nunca, y conviene decirlo antes de guardar que después. */
function scheduleProblem(promotion: Promotion): string | null {
  const { schedule } = promotion;

  if (schedule.mode === "range" && schedule.startDate && schedule.endDate) {
    if (schedule.startDate > schedule.endDate) {
      return "La fecha de fin no puede ser anterior a la de inicio.";
    }
  }
  if (schedule.mode === "weekdays" && schedule.weekdays.length === 0) {
    return "Elegí al menos un día de la semana.";
  }
  if (schedule.mode === "dates" && schedule.dates.length === 0) {
    return "Agregá al menos una fecha.";
  }

  return null;
}

export async function savePromotionAction(
  promotion: unknown,
  nextStatus: unknown,
): Promise<PromotionResult> {
  const user = await getCmsUser();
  if (!user) return { ok: false, error: "No autorizado." };

  if (!isPromotion(promotion) || !isPromotionStatus(nextStatus)) {
    return { ok: false, error: "Los datos de la promoción no son válidos." };
  }

  const title = promotion.title.trim();
  if (!title) return { ok: false, error: "La promoción necesita un título." };

  // El popup se abre con la imagen arriba y el texto abajo; sin ninguno de los
  // dos no habría nada que mostrar.
  if (!promotion.description.trim() && !promotion.imageUrl) {
    return { ok: false, error: "Agregá una descripción o una imagen." };
  }
  if (promotion.imageUrl && !promotion.imageAlt.trim()) {
    return { ok: false, error: "La imagen necesita un texto alternativo." };
  }
  if (promotion.ctaLabel.trim() && !promotion.ctaHref.trim()) {
    return { ok: false, error: "El botón necesita un enlace." };
  }

  const problem = scheduleProblem(promotion);
  if (problem) return { ok: false, error: problem };

  const saved = await savePromotion({ ...promotion, title }, nextStatus, user.uid);
  revalidatePromotions();
  return { ok: true, promotion: saved };
}

export async function deletePromotionAction(id: unknown): Promise<PromotionActionResult> {
  const user = await getCmsUser();
  if (!user) return { ok: false, error: "No autorizado." };

  if (typeof id !== "string" || !id) {
    return { ok: false, error: "Falta la promoción a eliminar." };
  }

  await deletePromotion(id);
  revalidatePromotions();
  return { ok: true };
}

export async function reorderPromotionsAction(ids: unknown): Promise<PromotionActionResult> {
  const user = await getCmsUser();
  if (!user) return { ok: false, error: "No autorizado." };

  if (!Array.isArray(ids) || !ids.every((id) => typeof id === "string" && id)) {
    return { ok: false, error: "El orden recibido no es válido." };
  }

  await reorderPromotions(ids);
  revalidatePromotions();
  return { ok: true };
}

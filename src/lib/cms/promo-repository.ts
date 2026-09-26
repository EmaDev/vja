import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import type {
  CollectionReference,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import { siteDoc } from "./repository";
import { EMPTY_SCHEDULE, type Promotion, type PromotionSchedule, type PromotionStatus } from "./promo-types";

/** Etiqueta de caché de las promociones publicadas. Las acciones del CMS la
 * invalidan para que el popup de la landing cambie sin redeploy. */
export const PROMOTIONS_TAG = "promotions";

function promotionsRef(): CollectionReference {
  return siteDoc().collection("promotions");
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Un documento guardado antes de que el calendario ganara un campo no puede
 * llegar con `undefined` a un input controlado del editor, así que se completa
 * contra el calendario vacío. */
function toSchedule(value: unknown): PromotionSchedule {
  if (typeof value !== "object" || value === null) return EMPTY_SCHEDULE;
  const data = value as Record<string, unknown>;

  const mode = data.mode;
  return {
    mode: mode === "range" || mode === "weekdays" || mode === "dates" ? mode : "always",
    startDate: str(data.startDate),
    endDate: str(data.endDate),
    weekdays: Array.isArray(data.weekdays)
      ? data.weekdays.filter(
          (day): day is number => typeof day === "number" && Number.isInteger(day) && day >= 0 && day <= 6,
        )
      : [],
    dates: Array.isArray(data.dates) ? data.dates.filter((date): date is string => typeof date === "string") : [],
    startTime: str(data.startTime),
    endTime: str(data.endTime),
  };
}

function toPromotion(doc: DocumentSnapshot | QueryDocumentSnapshot): Promotion {
  const data = doc.data() ?? {};
  return {
    id: doc.id,
    title: str(data.title),
    description: str(data.description),
    imageUrl: str(data.imageUrl),
    imageAlt: str(data.imageAlt),
    ctaLabel: str(data.ctaLabel),
    ctaHref: str(data.ctaHref),
    status: data.status === "live" ? "live" : "draft",
    schedule: toSchedule(data.schedule),
  };
}

/** Campos que van al documento. `id` es la clave, no un campo; `order` y las
 * marcas de tiempo las maneja el repositorio. */
function promotionFields(promotion: Promotion, nextStatus: PromotionStatus) {
  return {
    title: promotion.title,
    description: promotion.description,
    imageUrl: promotion.imageUrl,
    imageAlt: promotion.imageAlt,
    ctaLabel: promotion.ctaLabel,
    ctaHref: promotion.ctaHref,
    status: nextStatus,
    schedule: { ...promotion.schedule },
  };
}

/** Siguiente posición libre. El orden guardado decide qué promo gana cuando hay
 * más de una activa el mismo día. */
async function nextOrder(): Promise<number> {
  const snap = await promotionsRef().orderBy("order", "desc").limit(1).get();
  const last = snap.docs[0]?.data().order;
  return typeof last === "number" ? last + 1 : 0;
}

/* -------------------------------------------------------------------------- */
/* Lecturas                                                                    */
/* -------------------------------------------------------------------------- */

async function readPromotions(): Promise<Promotion[]> {
  const snap = await promotionsRef().orderBy("order").get();
  return snap.docs.map(toPromotion);
}

/** Lectura del CMS: siempre fresca, pero una sola por request. El layout la usa
 * para el contador de la barra lateral y la página para el listado. */
export const listPromotions = cache(readPromotions);

/** Lectura del sitio público. El filtro por estado se hace acá, pero el del
 * calendario no: el resultado queda cacheado y una promo que arranca a las 9 de
 * la mañana no puede depender de cuándo se generó la página. De eso se ocupa el
 * popup, ya en el navegador. */
const getLivePromotions = unstable_cache(
  async () => (await readPromotions()).filter((promotion) => promotion.status === "live"),
  ["live-promotions"],
  { tags: [PROMOTIONS_TAG] },
);

export const loadLivePromotions = cache(getLivePromotions);

/* -------------------------------------------------------------------------- */
/* Escrituras                                                                  */
/* -------------------------------------------------------------------------- */

/** Alta o edición. Devuelve la promoción tal como quedó guardada: en un alta el
 * id lo decide la base y el editor lo necesita para seguir trabajando. */
export async function savePromotion(
  promotion: Promotion,
  nextStatus: PromotionStatus,
  updatedBy: string,
): Promise<Promotion> {
  const fields = promotionFields(promotion, nextStatus);

  if (!promotion.id) {
    const created = await promotionsRef().add({
      ...fields,
      order: await nextOrder(),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy,
    });
    return { ...promotion, id: created.id, status: nextStatus };
  }

  await promotionsRef()
    .doc(promotion.id)
    .set({ ...fields, updatedBy, updatedAt: FieldValue.serverTimestamp() }, { merge: true });

  return { ...promotion, status: nextStatus };
}

export async function deletePromotion(id: string): Promise<void> {
  await promotionsRef().doc(id).delete();
}

/** Reescribe el campo `order` siguiendo la lista recibida. */
export async function reorderPromotions(ids: string[]): Promise<void> {
  const ref = promotionsRef();
  const batch = ref.firestore.batch();
  ids.forEach((id, index) => {
    batch.set(ref.doc(id), { order: index }, { merge: true });
  });
  await batch.commit();
}

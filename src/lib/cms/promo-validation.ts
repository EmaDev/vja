import type { Promotion, PromotionSchedule, PromotionScheduleMode } from "./promo-types";

/** El payload llega desde el editor, así que el servidor lo valida entero antes
 * de escribirlo, igual que el catálogo en `catalog-validation.ts`. */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const CLOCK_TIME = /^\d{2}:\d{2}$/;

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isDateField(value: unknown): value is string {
  return isString(value) && (value === "" || ISO_DATE.test(value));
}

function isTimeField(value: unknown): value is string {
  return isString(value) && (value === "" || CLOCK_TIME.test(value));
}

function isScheduleMode(value: unknown): value is PromotionScheduleMode {
  return value === "always" || value === "range" || value === "weekdays" || value === "dates";
}

export function isPromotionSchedule(value: unknown): value is PromotionSchedule {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;

  return (
    isScheduleMode(record.mode) &&
    isDateField(record.startDate) &&
    isDateField(record.endDate) &&
    Array.isArray(record.weekdays) &&
    record.weekdays.every(
      (day) => typeof day === "number" && Number.isInteger(day) && day >= 0 && day <= 6,
    ) &&
    Array.isArray(record.dates) &&
    record.dates.every((date) => isString(date) && ISO_DATE.test(date)) &&
    isTimeField(record.startTime) &&
    isTimeField(record.endTime)
  );
}

export function isPromotion(value: unknown): value is Promotion {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;

  return (
    isString(record.id) &&
    isString(record.title) &&
    isString(record.description) &&
    isString(record.imageUrl) &&
    isString(record.imageAlt) &&
    isString(record.ctaLabel) &&
    isString(record.ctaHref) &&
    (record.status === "live" || record.status === "draft") &&
    isPromotionSchedule(record.schedule)
  );
}

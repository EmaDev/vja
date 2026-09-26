/** Tipos y calendario de las promociones que la landing muestra en un popup.
 * Sin `server-only`: el editor del CMS y el propio popup los evalúan en el
 * cliente. */

export type PromotionStatus = "live" | "draft";

/** Cómo se decide si la promoción corre hoy.
 *
 * - `always`  — sin límite de calendario, sólo manda el estado.
 * - `range`   — entre dos fechas, cualquiera de las dos puede quedar abierta.
 * - `weekdays`— días de la semana fijos (el 2x1 de los martes).
 * - `dates`   — fechas sueltas (un feriado, el día de la madre). */
export type PromotionScheduleMode = "always" | "range" | "weekdays" | "dates";

export interface PromotionSchedule {
  mode: PromotionScheduleMode;
  /** `YYYY-MM-DD`. Vacío = sin límite por ese lado. Sólo con `mode: "range"`. */
  startDate: string;
  endDate: string;
  /** 0 = domingo … 6 = sábado. Sólo con `mode: "weekdays"`. */
  weekdays: number[];
  /** `YYYY-MM-DD` sueltos. Sólo con `mode: "dates"`. */
  dates: string[];
  /** `HH:MM`. Franja horaria que se aplica encima de cualquier modo; vacías =
   * todo el día. Si el fin es menor que el inicio, la franja cruza medianoche. */
  startTime: string;
  endTime: string;
}

export interface Promotion {
  /** Id del documento en Firestore. Lo genera la base: una promo no tiene URL
   * propia, así que no necesita un slug legible. */
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  /** Botón opcional del popup. Sin `ctaLabel` no se dibuja ninguno. */
  ctaLabel: string;
  ctaHref: string;
  status: PromotionStatus;
  schedule: PromotionSchedule;
}

/** El vivero atiende en Argentina: "hoy" es hoy allá, no en la zona horaria del
 * servidor de Vercel ni en la del visitante que está de viaje. */
export const SITE_TIME_ZONE = "America/Argentina/Buenos_Aires";

export const WEEKDAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export const EMPTY_SCHEDULE: PromotionSchedule = {
  mode: "always",
  startDate: "",
  endDate: "",
  weekdays: [],
  dates: [],
  startTime: "",
  endTime: "",
};

/** El instante actual reducido a lo único que mira el calendario. */
export interface SiteMoment {
  /** `YYYY-MM-DD` en hora de Argentina. */
  date: string;
  /** 0 = domingo … 6 = sábado. */
  weekday: number;
  /** Minutos transcurridos desde la medianoche. */
  minutes: number;
}

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const siteFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SITE_TIME_ZONE,
  weekday: "short",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Traduce un instante a la fecha y hora locales del vivero.
 *
 * Pasa por `Intl` en vez de por los getters de `Date` porque el cálculo corre en
 * dos lados —el servidor y el navegador del visitante— y ninguno de los dos
 * tiene por qué estar en la zona horaria del negocio. */
export function siteMoment(now: Date = new Date()): SiteMoment {
  const parts: Record<string, string> = {};
  for (const part of siteFormatter.formatToParts(now)) {
    parts[part.type] = part.value;
  }

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    weekday: WEEKDAY_INDEX[parts.weekday] ?? 0,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

/** Minutos desde la medianoche, o `null` si el campo está vacío o mal escrito
 * (que para el calendario significa lo mismo: sin límite por ese lado). */
function minutesFromTime(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;

  return hours * 60 + minutes;
}

function withinTimeWindow(schedule: PromotionSchedule, minutes: number): boolean {
  const from = minutesFromTime(schedule.startTime);
  const to = minutesFromTime(schedule.endTime);
  if (from === null && to === null) return true;

  const start = from ?? 0;
  const end = to ?? 24 * 60 - 1;

  // Una franja que termina antes de empezar cruza la medianoche (22:00–02:00),
  // así que el adentro es la unión de los dos tramos en vez de la intersección.
  return start <= end ? minutes >= start && minutes <= end : minutes >= start || minutes <= end;
}

/** Si la promoción corre en ese instante. Las fechas `YYYY-MM-DD` se comparan
 * como texto a propósito: en ese formato el orden alfabético es el cronológico
 * y no hace falta construir un `Date` por comparación. */
export function isPromotionActiveAt(promotion: Promotion, moment: SiteMoment): boolean {
  if (promotion.status !== "live") return false;

  const { schedule } = promotion;
  if (!withinTimeWindow(schedule, moment.minutes)) return false;

  switch (schedule.mode) {
    case "range":
      if (schedule.startDate && moment.date < schedule.startDate) return false;
      if (schedule.endDate && moment.date > schedule.endDate) return false;
      return true;

    case "weekdays":
      return schedule.weekdays.includes(moment.weekday);

    case "dates":
      return schedule.dates.includes(moment.date);

    case "always":
    default:
      return true;
  }
}

/** `2026-09-26` → `26/09`. Para las etiquetas del listado, donde el año sobra
 * salvo que sea otro. */
export function formatScheduleDate(value: string, currentYear: string): string {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return year === currentYear ? `${day}/${month}` : `${day}/${month}/${year}`;
}

/** Resumen en una línea del calendario, para la columna del listado. */
export function scheduleSummary(schedule: PromotionSchedule, currentYear: string): string {
  const window =
    schedule.startTime || schedule.endTime
      ? ` · ${schedule.startTime || "00:00"}–${schedule.endTime || "23:59"}`
      : "";

  switch (schedule.mode) {
    case "range": {
      const from = schedule.startDate ? formatScheduleDate(schedule.startDate, currentYear) : null;
      const to = schedule.endDate ? formatScheduleDate(schedule.endDate, currentYear) : null;
      if (from && to) return `${from} al ${to}${window}`;
      if (from) return `Desde el ${from}${window}`;
      if (to) return `Hasta el ${to}${window}`;
      return `Siempre${window}`;
    }

    case "weekdays": {
      if (schedule.weekdays.length === 0) return "Sin días elegidos";
      const days = [...schedule.weekdays].sort().map((day) => WEEKDAY_LABELS[day]);
      return `${days.join(", ")}${window}`;
    }

    case "dates": {
      if (schedule.dates.length === 0) return "Sin fechas elegidas";
      const dates = [...schedule.dates].sort().map((date) => formatScheduleDate(date, currentYear));
      const shown = dates.slice(0, 3).join(", ");
      const rest = dates.length > 3 ? ` +${dates.length - 3}` : "";
      return `${shown}${rest}${window}`;
    }

    case "always":
    default:
      return `Siempre${window}`;
  }
}

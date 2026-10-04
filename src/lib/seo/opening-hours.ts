import type { BusinessHours } from "@/lib/cms/types";

/** Traduce los horarios que el cliente escribe a mano al formato que Google
 * entiende (`OpeningHoursSpecification` de schema.org).
 *
 * El CMS guarda texto libre —"Lunes a viernes" / "9:00 – 18:00"— porque es lo
 * que el vivero tiene a mano y es lo que se dibuja en la página. Google, en
 * cambio, pide días en inglés y horas en `HH:MM`. Este módulo hace esa
 * traducción y **omite lo que no puede leer con certeza**: un renglón
 * "Domingos / Cerrado" no produce nada, en vez de inventar un horario. Un dato
 * estructurado equivocado es peor que ninguno —manda gente al local cuando está
 * cerrado y Google penaliza el desajuste con la página.
 *
 * Lo que no entra: "a partir de las 9", "24 h", "según temporada". Todo eso
 * sigue viéndose en la página; simplemente no viaja al JSON-LD. */

export interface OpeningHoursSpecification {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string[];
  opens: string;
  closes: string;
}

const WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

/** Prefijos con los que arranca cada día en español, en singular y plural, con
 * y sin abreviar. El orden del array es el de `WEEK`. */
const DAY_PREFIXES = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"] as const;

const DAY_TOKEN = /lun|mar|mie|jue|vie|sab|dom/g;

/** Lo que puede haber entre dos días para que sea un rango y no una lista:
 * "lunes a viernes", "mar-dom", "lunes al sábado". */
const RANGE_SEPARATOR = /^\s*(a|al|hasta|-|–|—)\s*$/;

/** Sin tildes y en minúsculas, que es la única forma en la que los prefijos de
 * arriba matchean "Miércoles" y "Sábados". */
function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

/** Los días que nombra el renglón, o `[]` si no nombra ninguno reconocible.
 *
 * Distingue rango de enumeración: "martes a domingo" son seis días, "sábados y
 * domingos" son dos. Un rango que cruza el fin de semana ("viernes a lunes") se
 * recorre hacia adelante dando la vuelta. */
function parseDays(raw: string): string[] {
  const text = fold(raw);
  const found = [...text.matchAll(DAY_TOKEN)];
  if (found.length === 0) return [];

  const indexOf = (match: RegExpMatchArray) =>
    DAY_PREFIXES.indexOf(match[0] as (typeof DAY_PREFIXES)[number]);

  if (found.length === 2) {
    const [from, to] = found;
    const between = text.slice(
      (from.index ?? 0) + from[0].length,
      // El separador se mide hasta donde arranca el segundo día, así que el
      // resto de la palabra ("martes" → "tes") no entra en la comparación.
      to.index ?? 0,
    );
    // "mar" de "martes" seguido de "tes a domingo" deja "tes a " en el medio:
    // sólo es rango si entre los dos días no hay más que el separador.
    if (RANGE_SEPARATOR.test(between.replace(/^[a-z]*/, ""))) {
      const start = indexOf(from);
      const end = indexOf(to);
      const span = (end - start + 7) % 7;
      return Array.from({ length: span + 1 }, (_, step) => WEEK[(start + step) % 7]);
    }
  }

  // Enumeración. `Set` por si el renglón repite un día.
  return [...new Set(found.map((match) => WEEK[indexOf(match)]))];
}

/** Las horas del renglón, de a pares apertura/cierre.
 *
 * De a pares porque un local puede cortar al mediodía: "9 a 13 y 16 a 20" son
 * dos tramos, no uno de 9 a 13 con el resto perdido. Un número impar de horas
 * deja el último suelto afuera: sin hora de cierre no hay tramo que declarar. */
function parseTimeRanges(raw: string): { opens: string; closes: string }[] {
  const times: string[] = [];

  for (const match of fold(raw).matchAll(/(\d{1,2})(?:[:.h](\d{2}))?/g)) {
    const hour = Number(match[1]);
    const minute = Number(match[2] ?? "0");
    if (hour > 23 || minute > 59) continue;
    times.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
  }

  const ranges: { opens: string; closes: string }[] = [];
  for (let index = 0; index + 1 < times.length; index += 2) {
    ranges.push({ opens: times[index], closes: times[index + 1] });
  }
  return ranges;
}

/** Los horarios cargados en el CMS, en el formato de schema.org. Los renglones
 * que no se pueden leer con certeza no aparecen. */
export function openingHoursSpecification(
  hours: BusinessHours[],
): OpeningHoursSpecification[] {
  const specs: OpeningHoursSpecification[] = [];

  for (const row of hours) {
    const dayOfWeek = parseDays(row.days);
    if (dayOfWeek.length === 0) continue;

    for (const { opens, closes } of parseTimeRanges(row.time)) {
      specs.push({ "@type": "OpeningHoursSpecification", dayOfWeek, opens, closes });
    }
  }

  return specs;
}

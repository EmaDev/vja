"use client";

import { TextField } from "@/components/atoms/TextField";
import { SegmentedControl } from "@/components/atoms/SegmentedControl";
import { AdminButton } from "@/components/atoms/AdminButton";
import { cn } from "@/lib/utils";
import {
  WEEKDAY_LABELS,
  type PromotionSchedule,
  type PromotionScheduleMode,
} from "@/lib/cms/promo-types";

const MODE_OPTIONS: { value: PromotionScheduleMode; label: string }[] = [
  { value: "always", label: "Siempre" },
  { value: "range", label: "Rango de fechas" },
  { value: "weekdays", label: "Días de la semana" },
  { value: "dates", label: "Fechas puntuales" },
];

const MODE_HELP: Record<PromotionScheduleMode, string> = {
  always: "Se muestra mientras la promoción esté publicada.",
  range: "Entre dos fechas. Dejá una vacía para no ponerle límite de ese lado.",
  weekdays: "Se repite todas las semanas en los días elegidos.",
  dates: "Sólo en las fechas que agregues, una por una.",
};

export interface ScheduleEditorProps {
  schedule: PromotionSchedule;
  onChange: (schedule: PromotionSchedule) => void;
}

/** Editor del calendario de una promoción. Guarda los campos de todos los modos
 * aunque sólo se vea el del modo elegido: alguien que carga un rango, prueba con
 * días de la semana y vuelve atrás encuentra sus fechas donde las dejó. */
export function ScheduleEditor({ schedule, onChange }: ScheduleEditorProps) {
  function set<K extends keyof PromotionSchedule>(key: K, value: PromotionSchedule[K]) {
    onChange({ ...schedule, [key]: value });
  }

  function toggleWeekday(day: number) {
    const next = schedule.weekdays.includes(day)
      ? schedule.weekdays.filter((current) => current !== day)
      : [...schedule.weekdays, day].sort((a, b) => a - b);
    set("weekdays", next);
  }

  function addDate(value: string) {
    if (!value || schedule.dates.includes(value)) return;
    set("dates", [...schedule.dates, value].sort());
  }

  return (
    <div className="flex flex-col gap-4">
      <SegmentedControl
        options={MODE_OPTIONS}
        value={schedule.mode}
        onChange={(mode) => set("mode", mode)}
        className="w-fit flex-wrap"
      />
      <p className="-mt-1 text-[13px] leading-[1.5] text-stone">{MODE_HELP[schedule.mode]}</p>

      {schedule.mode === "range" ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          <TextField
            label="Desde"
            type="date"
            value={schedule.startDate}
            onChange={(event) => set("startDate", event.target.value)}
          />
          <TextField
            label="Hasta"
            type="date"
            value={schedule.endDate}
            onChange={(event) => set("endDate", event.target.value)}
          />
        </div>
      ) : null}

      {schedule.mode === "weekdays" ? (
        <div className="flex flex-wrap gap-2">
          {WEEKDAY_LABELS.map((label, day) => {
            const active = schedule.weekdays.includes(day);
            return (
              <button
                key={label}
                type="button"
                aria-pressed={active}
                onClick={() => toggleWeekday(day)}
                className={cn(
                  "rounded-full border px-4 py-2 text-[13px] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage",
                  active
                    ? "border-forest bg-forest text-paper"
                    : "border-[#CFC6B0] bg-transparent text-ink hover:bg-[#EFE9DA]",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      ) : null}

      {schedule.mode === "dates" ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end gap-2.5">
            <TextField
              label="Agregar fecha"
              type="date"
              // Sin `value`: el campo es un disparador, no parte del formulario.
              // Cada fecha elegida pasa a la lista de abajo y el input se limpia.
              onChange={(event) => {
                addDate(event.target.value);
                event.target.value = "";
              }}
            />
          </div>

          {schedule.dates.length === 0 ? (
            <p className="text-[13px] text-taupe">Todavía no agregaste ninguna fecha.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {schedule.dates.map((date) => (
                <li
                  key={date}
                  className="flex items-center gap-2 rounded-full border border-[#CFC6B0] py-1.5 pl-3.5 pr-2 text-[13px] text-forest"
                >
                  {date}
                  <button
                    type="button"
                    aria-label={`Quitar ${date}`}
                    onClick={() => set("dates", schedule.dates.filter((current) => current !== date))}
                    className="rounded-full px-1.5 leading-none text-taupe transition-colors hover:text-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      <div className="border-t border-line-light pt-4">
        <div className="text-sm text-forest">Franja horaria</div>
        <p className="mt-0.5 text-[13px] leading-[1.5] text-stone">
          Opcional, se aplica encima del calendario. Vacías = todo el día. Si la hora de fin es
          menor que la de inicio, la franja cruza la medianoche.
        </p>
        <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          <TextField
            label="Desde las"
            type="time"
            value={schedule.startTime}
            onChange={(event) => set("startTime", event.target.value)}
          />
          <TextField
            label="Hasta las"
            type="time"
            value={schedule.endTime}
            onChange={(event) => set("endTime", event.target.value)}
          />
        </div>
        {schedule.startTime || schedule.endTime ? (
          <AdminButton
            variant="outline"
            className="mt-3 w-fit"
            onClick={() => onChange({ ...schedule, startTime: "", endTime: "" })}
          >
            Quitar franja horaria
          </AdminButton>
        ) : null}
      </div>
    </div>
  );
}

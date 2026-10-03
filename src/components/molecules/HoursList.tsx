import { cn } from "@/lib/utils";
import type { BusinessHours } from "@/lib/cms/types";

export type HoursListProps = {
  /** Los tramos cargados en Datos de contacto, ya filtrados. */
  hours: BusinessHours[];
  className?: string;
};

/** Los horarios de atención, un renglón por tramo con los días a la izquierda y
 * la hora a la derecha. Lo dibujan igual "Visitanos" y la ficha de contacto: el
 * dato es el mismo y así no se despegan uno del otro. */
export function HoursList({ hours, className }: HoursListProps) {
  return (
    <ul className={cn("flex flex-col gap-1.5", className)}>
      {hours.map((row) => (
        <li key={row.id} className="flex flex-wrap justify-between gap-x-6">
          <span>{row.days}</span>
          <span className="text-stone">{row.time}</span>
        </li>
      ))}
    </ul>
  );
}

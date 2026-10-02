"use client";

import { TextField } from "@/components/atoms/TextField";
import { ToggleSwitch } from "@/components/atoms/ToggleSwitch";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";

/** Lo que toda sección opcional de la landing tiene en común. */
interface SectionBasics {
  visible: boolean;
  eyebrow: string;
  title: string;
}

export interface SectionBasicsCardProps<S extends SectionBasics> {
  section: S;
  onChange: (section: S) => void;
  /** Cómo se llama la sección en el sitio, para el texto del interruptor. */
  name: string;
  /** Ancla donde cae la sección, por ejemplo `#nosotros`. Es lo que hay que
   * poner en un enlace del menú o del footer para llegar hasta acá. */
  anchor: string;
  /** Campos cortos propios de la sección, que entran en la misma fila que la
   * volanta y el título: la segunda línea del titular o el enlace al costado. */
  children?: React.ReactNode;
  /** Campos que necesitan el ancho completo, debajo de la fila: la bajada. */
  footer?: React.ReactNode;
}

/** Primera tarjeta de todo editor de sección: si se muestra o no, la volanta y el
 * título. Lo demás lo agrega cada editor como `children`. */
export function SectionBasicsCard<S extends SectionBasics>({
  section,
  onChange,
  name,
  anchor,
  children,
  footer,
}: SectionBasicsCardProps<S>) {
  return (
    <FieldCard title="Encabezado de la sección">
      <div className="flex items-center justify-between gap-4 border-b border-line-light pb-4">
        <div>
          <div className="text-[15px] text-forest">Mostrar “{name}” en la landing</div>
          <div className="mt-0.5 text-[13px] text-stone">
            Apagada no se publica, pero no se pierde nada de lo que cargaste. Ancla:{" "}
            <code className="text-stone">{anchor}</code>
          </div>
        </div>
        <ToggleSwitch
          checked={section.visible}
          onChange={(visible) => onChange({ ...section, visible })}
          label={`Mostrar la sección ${name}`}
        />
      </div>
      {/* Son todos campos de una línea: en fila aprovechan el ancho de la tarjeta
          en vez de dejar media pantalla vacía a la derecha. */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-4">
        <TextField
          label="Volanta"
          value={section.eyebrow}
          onChange={(event) => onChange({ ...section, eyebrow: event.target.value })}
        />
        <TextField
          label="Título"
          value={section.title}
          onChange={(event) => onChange({ ...section, title: event.target.value })}
        />
        {children}
      </div>
      {footer}
    </FieldCard>
  );
}

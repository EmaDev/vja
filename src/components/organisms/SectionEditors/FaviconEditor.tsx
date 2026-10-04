"use client";

import type { FaviconSection } from "@/lib/cms/types";
import { ColorField } from "@/components/atoms/ColorField";
import { TextField } from "@/components/atoms/TextField";
import { FieldCard } from "@/components/molecules/FieldCard/FieldCard";
import { ImageUploader } from "@/components/molecules/ImageUploader/ImageUploader";
import { iconLetter } from "@/lib/cms/favicon";

interface FaviconEditorProps {
  section: FaviconSection;
  onChange: (section: FaviconSection) => void;
  /** Nombre del negocio, para la inicial por defecto y la vista previa. */
  siteName: string;
}

/** Muestra del ícono al tamaño real en el que se ve, más uno ampliado.
 *
 * Los 16 px no son un capricho: es el tamaño de la pestaña del navegador, y es
 * donde se descubre que un logo con detalle o dos letras finas no se leen. Verlo
 * sólo en grande es cómo se eligen íconos que después no se distinguen. */
function Preview({
  section,
  letter,
  siteName,
}: {
  section: FaviconSection;
  letter: string;
  siteName: string;
}) {
  const style = { background: section.background, color: section.foreground };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end gap-6">
        {[48, 16].map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <div
              className="flex items-center justify-center overflow-hidden"
              style={{ ...style, width: size, height: size }}
            >
              {section.imageUrl ? (
                /* La muestra es un espejo del `ImageResponse` que dibuja el
                   ícono, no una imagen del sitio: no hay nada que optimizar. */
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={section.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span
                  style={{ fontSize: letter.length > 1 ? size * 0.5 : size * 0.68 }}
                  className="font-semibold leading-none"
                >
                  {letter}
                </span>
              )}
            </div>
            <span className="text-[11px] text-taupe">{size} px</span>
          </div>
        ))}
      </div>

      {/* Cómo se va a ver en la pestaña, que es donde el cliente lo reconoce. */}
      <div className="flex items-center gap-2 rounded-t-md border border-line bg-paper-light px-3 py-2">
        <div
          className="flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden"
          style={style}
        >
          {section.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- Ídem.
            <img src={section.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span style={{ fontSize: 11 }} className="font-semibold leading-none">
              {letter}
            </span>
          )}
        </div>
        <span className="truncate text-[13px] text-ink">{siteName}</span>
      </div>
    </div>
  );
}

/** "Ícono del sitio": el cuadradito que se ve en la pestaña del navegador y, lo
 * que más importa, al lado del resultado en Google desde el celular.
 *
 * Dos caminos y el cliente elige uno sin tener que decidirlo: si sube una
 * imagen, el ícono es la imagen; si no, se dibuja la inicial sobre el color
 * elegido. Nunca queda sin ícono. */
export function FaviconEditor({ section, onChange, siteName }: FaviconEditorProps) {
  // La misma función que usa `lib/seo/app-icon.tsx` para dibujar el ícono, así
  // la vista previa no puede mostrar una letra distinta de la que se publica.
  const letter = iconLetter(section.letter, siteName);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] items-start gap-7">
      <FieldCard title="Imagen del ícono">
        <p className="text-[13px] leading-[1.6] text-stone">
          Una imagen cuadrada, idealmente de 512 × 512 px: se recorta del centro y se guarda
          como PNG de 192 px. Si no cargás ninguna, el ícono se dibuja con la inicial y los
          colores de abajo.
        </p>
        <ImageUploader
          imageUrl={section.imageUrl}
          imageAlt={section.imageAlt}
          format="png"
          square
          placeholderLabel="Sin ícono"
          altHint="Describe el ícono en pocas palabras. Es obligatorio para subirlo, aunque no se muestre en el sitio."
          onChange={({ imageUrl, imageAlt }) => onChange({ ...section, imageUrl, imageAlt })}
        />
      </FieldCard>

      <FieldCard title="Ícono con inicial">
        <TextField
          label="Letra (una o dos)"
          maxLength={2}
          placeholder={letter}
          value={section.letter}
          onChange={(event) => onChange({ ...section, letter: event.target.value })}
        />
        <ColorField
          label="Fondo"
          value={section.background}
          onChange={(background) => onChange({ ...section, background })}
        />
        <ColorField
          label="Letra"
          value={section.foreground}
          onChange={(foreground) => onChange({ ...section, foreground })}
        />
        {section.imageUrl ? (
          <p className="text-[13px] leading-[1.6] text-stone">
            Mientras haya una imagen cargada, manda la imagen. Borrala para volver a la
            inicial.
          </p>
        ) : null}
      </FieldCard>

      <FieldCard title="Cómo se va a ver" tinted>
        <Preview section={section} letter={letter} siteName={siteName} />
      </FieldCard>
    </div>
  );
}

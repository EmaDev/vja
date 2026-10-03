import Image from "next/image";
import { cn } from "@/lib/utils";

export type LogoProps = {
  /** Wordmark text. Comes from the CMS `header.logoText` on the public site. */
  text?: string;
  /** Logo cargado en el CMS. Cuando hay uno, reemplaza al wordmark. */
  imageUrl?: string;
  imageAlt?: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
  /** Split the wordmark on the "&" so it reads on two lines instead of one. */
  stacked?: boolean;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "text-[20px] md:text-[22px]",
  md: "text-[23px] md:text-[27px]",
  lg: "text-[30px] md:text-[38px]",
};

/** Espacio que ocupa el logo cargado.
 *
 * Es de medidas fijas y la imagen va contenida adentro: no sabemos la proporción
 * del archivo que suba el cliente, y reservarle un lugar constante evita que el
 * menú se corra según cuán ancho sea el logo. Un logo más angosto que el espacio
 * deja aire a un costado, no un salto de maquetación. */
const imageSizeClasses = {
  sm: "h-[24px] w-[112px] md:h-[26px] md:w-[128px]",
  md: "h-[28px] w-[132px] md:h-[32px] md:w-[158px]",
  lg: "h-[36px] w-[168px] md:h-[44px] md:w-[208px]",
};

/** Parte el wordmark en la primera "&" para la variante apilada. Sin "&" queda en
 * una sola línea, que es lo correcto para un nombre de una sola palabra. */
function splitOnAmpersand(text: string): [string, string] | null {
  const index = text.indexOf("&");
  if (index <= 0) return null;
  return [text.slice(0, index).trim(), text.slice(index).trim()];
}

export function Logo({
  text = "VJA Plantas",
  imageUrl,
  imageAlt,
  tone = "dark",
  align = "left",
  stacked = false,
  showTagline = false,
  size = "md",
  className,
}: LogoProps) {
  const parts = stacked ? splitOnAmpersand(text) : null;
  const centered = align === "center";

  return (
    <div className={cn(centered && "text-center", className)}>
      {imageUrl ? (
        <div className={cn("relative", imageSizeClasses[size], centered && "mx-auto")}>
          <Image
            src={imageUrl}
            // El nombre del local es un respaldo razonable: un logo sin texto
            // alternativo deja al lector de pantalla sin saber de quién es el sitio.
            alt={imageAlt?.trim() || text}
            fill
            sizes="220px"
            className={cn("object-contain", centered ? "object-center" : "object-left")}
            priority
          />
        </div>
      ) : (
        <div
          className={cn(
            "font-display leading-[1.1]",
            sizeClasses[size],
            tone === "light" ? "text-paper" : "text-forest",
          )}
        >
          {parts ? (
            <>
              {parts[0]}
              <br />
              {parts[1]}
            </>
          ) : (
            text
          )}
        </div>
      )}
      {showTagline && (
        <div
          className={cn(
            "mt-[5px] text-[9px] uppercase tracking-[0.42em]",
            tone === "light" ? "text-paper/70" : "text-taupe",
          )}
        >
          Vivero · 1998
        </div>
      )}
    </div>
  );
}

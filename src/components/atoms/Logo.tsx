import { cn } from "@/lib/utils";

export type LogoProps = {
  /** Wordmark text. Comes from the CMS `header.logoText` on the public site. */
  text?: string;
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

/** Parte el wordmark en la primera "&" para la variante apilada. Sin "&" queda en
 * una sola línea, que es lo correcto para un nombre de una sola palabra. */
function splitOnAmpersand(text: string): [string, string] | null {
  const index = text.indexOf("&");
  if (index <= 0) return null;
  return [text.slice(0, index).trim(), text.slice(index).trim()];
}

export function Logo({
  text = "VJA Plantas",
  tone = "dark",
  align = "left",
  stacked = false,
  showTagline = false,
  size = "md",
  className,
}: LogoProps) {
  const parts = stacked ? splitOnAmpersand(text) : null;

  return (
    <div className={cn(align === "center" && "text-center", className)}>
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

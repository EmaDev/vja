import { cn } from "@/lib/utils";

export type LogoProps = {
  tone?: "dark" | "light";
  align?: "left" | "center";
  /** Stack "Raíz" and "& Pétalo" on two lines instead of one. */
  stacked?: boolean;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "text-[22px]",
  md: "text-[27px]",
  lg: "text-[38px]",
};

export function Logo({
  tone = "dark",
  align = "left",
  stacked = false,
  showTagline = false,
  size = "md",
  className,
}: LogoProps) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <div
        className={cn(
          "font-display leading-[1.1]",
          sizeClasses[size],
          tone === "light" ? "text-paper" : "text-forest",
        )}
      >
        {stacked ? (
          <>
            Raíz
            <br />
            &amp; Pétalo
          </>
        ) : (
          "Raíz & Pétalo"
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

import { CountUp } from "@/components/atoms/CountUp";
import { cn } from "@/lib/utils";

export type StatBlockProps = {
  value: string;
  label: string;
  tone?: "dark" | "light";
  /** `false` deja el número quieto. Por defecto cuenta desde cero la primera vez
   * que entra en pantalla, cuando el valor empieza con un número. */
  animated?: boolean;
  className?: string;
};

export function StatBlock({
  value,
  label,
  tone = "dark",
  animated = true,
  className,
}: StatBlockProps) {
  const valueClasses = cn("font-display text-[30px]", tone === "light" ? "text-paper" : "text-forest");

  return (
    <div className={className}>
      {animated ? (
        <CountUp value={value} className={cn("block tabular-nums", valueClasses)} />
      ) : (
        <div className={valueClasses}>{value}</div>
      )}
      <div className={cn("text-[13px]", tone === "light" ? "text-paper/60" : "text-taupe")}>
        {label}
      </div>
    </div>
  );
}

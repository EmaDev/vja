import { cn } from "@/lib/utils";

export type StatBlockProps = {
  value: string;
  label: string;
  tone?: "dark" | "light";
  className?: string;
};

export function StatBlock({ value, label, tone = "dark", className }: StatBlockProps) {
  return (
    <div className={className}>
      <div
        className={cn(
          "font-display text-[30px]",
          tone === "light" ? "text-paper" : "text-forest",
        )}
      >
        {value}
      </div>
      <div className={cn("text-[13px]", tone === "light" ? "text-paper/60" : "text-taupe")}>
        {label}
      </div>
    </div>
  );
}

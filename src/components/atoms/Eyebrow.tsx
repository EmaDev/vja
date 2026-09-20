import { cn } from "@/lib/utils";

export type EyebrowProps = {
  children: React.ReactNode;
  tone?: "terracotta" | "cream" | "sage";
  className?: string;
};

const toneClasses = {
  terracotta: "text-terracotta",
  cream: "text-[#D9C9A3]",
  sage: "text-[#9FB09A]",
};

export function Eyebrow({ children, tone = "terracotta", className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "text-xs uppercase tracking-[0.24em]",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

import { cn } from "@/lib/utils";

export type FloatingBadgeProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  /** Single-line pill instead of the stacked card layout. */
  pill?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export function FloatingBadge({
  eyebrow,
  title,
  subtitle,
  pill = false,
  children,
  className,
}: FloatingBadgeProps) {
  if (pill) {
    return (
      <div
        className={cn(
          "pointer-events-none rounded-full bg-paper-light px-5 py-3 text-sm text-forest shadow-[0_12px_30px_rgba(23,48,31,0.12)]",
          className,
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "pointer-events-none bg-paper px-5 py-[18px] shadow-[0_18px_40px_rgba(23,48,31,0.14)]",
        className,
      )}
    >
      {eyebrow && (
        <div className="text-[11px] uppercase tracking-[0.18em] text-terracotta">{eyebrow}</div>
      )}
      {title && <div className="mt-[6px] font-display text-[22px] text-forest">{title}</div>}
      {subtitle && <div className="mt-1 text-sm text-stone">{subtitle}</div>}
    </div>
  );
}

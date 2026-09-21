import { cn } from "@/lib/utils";

export interface FieldCardProps {
  title: string;
  subtitle?: string;
  tinted?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Recurring content card used across the CMS admin: serif heading + form fields. */
export function FieldCard({ title, subtitle, tinted, className, children }: FieldCardProps) {
  return (
    <div
      className={cn(
        "rounded-[10px] border px-[26px] pb-7 pt-6",
        tinted ? "border-line-light bg-[#EFE9DA]" : "border-line-light bg-paper-light",
        className,
      )}
    >
      <div className="font-display text-[22px] text-forest">{title}</div>
      {subtitle ? <p className="mt-1.5 text-sm text-stone">{subtitle}</p> : null}
      <div className="mt-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}

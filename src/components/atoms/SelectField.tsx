import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export function SelectField({ label, className, id, children, ...props }: SelectFieldProps) {
  const fieldId = id ?? props.name;
  const select = (
    <select
      id={fieldId}
      className={cn(
        "rounded-md border border-line bg-paper-light px-[13px] py-[11px] text-[15px] text-forest outline-none transition-shadow focus:outline-2 focus:outline-sage focus:outline-offset-1",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );

  if (!label) return select;

  return (
    <label className="flex flex-col gap-[7px]" htmlFor={fieldId}>
      <span className="text-[13px] text-ink">{label}</span>
      {select}
    </label>
  );
}

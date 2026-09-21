import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export function TextAreaField({ label, className, id, rows = 3, ...props }: TextAreaFieldProps) {
  const fieldId = id ?? props.name;
  const textarea = (
    <textarea
      id={fieldId}
      rows={rows}
      className={cn(
        "resize-y rounded-md border border-line bg-paper-light px-[13px] py-[11px] text-[15px] text-forest outline-none transition-shadow placeholder:text-taupe focus:outline-2 focus:outline-sage focus:outline-offset-1",
        className,
      )}
      {...props}
    />
  );

  if (!label) return textarea;

  return (
    <label className="flex flex-col gap-[7px]" htmlFor={fieldId}>
      <span className="text-[13px] text-ink">{label}</span>
      {textarea}
    </label>
  );
}

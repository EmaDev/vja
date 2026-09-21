import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  wide?: boolean;
};

/** Paper-toned text input matching the CMS mockups (border #DDD5C2, bg #FFFDF8). */
export function TextField({ label, wide, className, id, ...props }: TextFieldProps) {
  const inputId = id ?? props.name;
  const input = (
    <input
      id={inputId}
      className={cn(
        "rounded-md border border-line bg-paper-light px-[13px] py-[11px] text-[15px] text-forest outline-none transition-shadow placeholder:text-taupe focus:outline-2 focus:outline-sage focus:outline-offset-1",
        className,
      )}
      {...props}
    />
  );

  if (!label) return input;

  return (
    <label className={cn("flex flex-col gap-[7px]", wide && "col-span-2")} htmlFor={inputId}>
      <span className="text-[13px] text-ink">{label}</span>
      {input}
    </label>
  );
}

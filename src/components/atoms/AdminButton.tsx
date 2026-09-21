import Link from "next/link";
import { cn } from "@/lib/utils";

export type AdminButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "solid" | "outline" | "danger-outline";
  size?: "sm" | "md";
  type?: "button" | "submit";
  disabled?: boolean;
  /** Sólo con `href`: abre el destino en otra pestaña. */
  newTab?: boolean;
  className?: string;
  onClick?: () => void;
};

const variantClasses: Record<string, string> = {
  solid: "border-0 bg-forest text-paper hover:bg-sage",
  outline: "border border-[#CFC6B0] bg-transparent text-forest hover:bg-[#EFE9DA]",
  "danger-outline": "border border-terracotta bg-transparent text-terracotta hover:bg-terracotta hover:text-paper-light",
};

const sizeClasses: Record<string, string> = {
  sm: "px-5 py-[11px] text-sm",
  md: "px-6 py-3 text-sm font-medium",
};

/** Pill action button used in the CMS admin chrome (sticky headers, cards). Distinct from the marketing `CtaButton`. */
export function AdminButton({
  children,
  href,
  variant = "outline",
  size = "sm",
  type = "button",
  disabled,
  newTab,
  className,
  onClick,
}: AdminButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={classes}
        {...(newTab ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}

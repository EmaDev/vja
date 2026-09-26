import Link from "next/link";
import { cn } from "@/lib/utils";

export type CtaButtonProps = {
  children: React.ReactNode;
  href?: string;
  tone?: "forest" | "paper" | "terracotta";
  variant?: "solid" | "outline";
  shape?: "pill" | "rounded";
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
  /** Sólo aplica cuando no hay `href`, es decir cuando se renderiza como `<button>`. */
  type?: "button" | "submit";
};

const toneVariantClasses: Record<string, string> = {
  "forest-solid": "bg-forest text-paper hover:bg-sage",
  "forest-outline": "border border-forest text-forest hover:bg-forest/5",
  "paper-solid": "bg-paper text-forest hover:bg-white",
  "paper-outline": "border border-paper/40 text-paper hover:border-paper",
  "terracotta-solid": "bg-terracotta text-paper-light hover:bg-terracotta/90",
  "terracotta-outline": "border border-terracotta text-terracotta hover:bg-terracotta/5",
};

const sizeClasses = {
  sm: "px-[18px] py-[10px] text-sm",
  md: "px-8 py-[17px] text-[15px]",
};

/** Pill/rounded call-to-action link used across the marketing site's heroes and headers. */
export function CtaButton({
  children,
  href,
  tone = "forest",
  variant = "solid",
  shape = "pill",
  size = "md",
  className,
  onClick,
  type = "button",
}: CtaButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-300",
    shape === "pill" ? "rounded-full" : "rounded-md",
    sizeClasses[size],
    toneVariantClasses[`${tone}-${variant}`],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

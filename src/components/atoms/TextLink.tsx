import Link from "next/link";
import { cn } from "@/lib/utils";

export type TextLinkProps = {
  children: React.ReactNode;
  href?: string;
  tone?: "dark" | "light";
  underline?: boolean;
  className?: string;
};

export function TextLink({
  children,
  href = "#",
  tone = "dark",
  underline = true,
  className,
}: TextLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-block pb-[3px] text-[15px] transition-colors duration-300",
        underline && "border-b",
        tone === "light"
          ? "border-paper text-paper hover:text-paper/80"
          : "border-forest text-forest hover:text-sage",
        className,
      )}
    >
      {children}
    </Link>
  );
}

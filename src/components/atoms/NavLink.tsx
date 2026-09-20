import Link from "next/link";
import { cn } from "@/lib/utils";

export type NavItem = {
  label: string;
  href?: string;
};

export type NavLinkProps = {
  children: React.ReactNode;
  href?: string;
  active?: boolean;
  tone?: "dark" | "light";
  /** Rounded pill background used by floating / glass navs. */
  pill?: boolean;
  className?: string;
};

export function NavLink({
  children,
  href = "#",
  active = false,
  tone = "dark",
  pill = false,
  className,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm transition-colors duration-300",
        pill && "rounded-full px-[18px] py-[9px]",
        tone === "dark" && [
          "text-[#3A4A3C]",
          active && "border-b-2 border-terracotta pb-[3px] text-forest",
        ],
        tone === "light" && [
          active ? "bg-paper/16 text-paper" : "text-paper/85 hover:text-paper",
        ],
        className,
      )}
    >
      {children}
    </Link>
  );
}

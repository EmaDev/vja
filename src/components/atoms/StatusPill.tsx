import { cn } from "@/lib/utils";

export type StatusPillProps = {
  live: boolean;
  labelLive?: string;
  labelDraft?: string;
  className?: string;
};

export function StatusPill({ live, labelLive = "Publicado", labelDraft = "Borrador", className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "rounded-full px-[11px] py-[5px] text-[11px] uppercase tracking-[0.1em]",
        live ? "bg-[#DFE8D9] text-[#2F5636]" : "bg-[#F0E3D4] text-[#8A5A33]",
        className,
      )}
    >
      {live ? labelLive : labelDraft}
    </span>
  );
}

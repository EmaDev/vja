import { cn } from "@/lib/utils";
import { VariantWireframe, type WireKind } from "@/components/molecules/VariantWireframe/VariantWireframe";

export interface VariantPickerCardProps {
  id: string;
  name: string;
  description: string;
  wireKind: WireKind;
  active: boolean;
  onSelect: () => void;
}

export function VariantPickerCard({
  id,
  name,
  description,
  wireKind,
  active,
  onSelect,
}: VariantPickerCardProps) {
  const centered = wireKind === "center" || wireKind === "strip";

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "flex flex-col overflow-hidden rounded-[10px] bg-paper-light text-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage",
        active ? "border-2 border-sage shadow-[0_14px_30px_rgba(23,48,31,0.12)]" : "border border-line-light",
      )}
    >
      <div
        className={cn(
          "flex h-[168px] flex-col gap-[7px] p-4",
          centered ? "justify-center" : "justify-start",
        )}
        style={{ background: active ? "#EDF1E9" : "#F2EDE0" }}
      >
        <VariantWireframe kind={wireKind} active={active} />
      </div>
      <div className="flex items-start gap-3.5 px-[18px] pb-[18px] pt-4">
        <div
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs text-paper",
            active ? "border border-sage bg-sage" : "border border-[#C6BEA9] bg-transparent",
          )}
        >
          {active ? "✓" : null}
        </div>
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl text-forest">{name}</span>
            <span className="text-[11px] uppercase tracking-[0.14em] text-taupe">{id}</span>
          </div>
          <p className="mt-[5px] text-sm leading-[1.5] text-stone">{description}</p>
        </div>
      </div>
    </button>
  );
}

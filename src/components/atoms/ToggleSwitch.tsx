import { cn } from "@/lib/utils";

export type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
};

export function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex h-7 w-12 shrink-0 items-center rounded-full p-[3px] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage",
        checked ? "bg-sage" : "bg-[#CFC6B0]",
      )}
    >
      <span
        className={cn(
          "h-[22px] w-[22px] rounded-full bg-paper-light shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

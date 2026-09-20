import { cn } from "@/lib/utils";

export type ArrowCircleButtonProps = {
  direction?: "right";
  className?: string;
};

export function ArrowCircleButton({ className }: ArrowCircleButtonProps) {
  return (
    <div
      className={cn(
        "flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-forest text-lg text-forest transition-colors duration-300 hover:bg-forest hover:text-paper",
        className,
      )}
      aria-hidden
    >
      →
    </div>
  );
}

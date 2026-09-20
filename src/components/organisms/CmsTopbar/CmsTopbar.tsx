import { LogoutButton } from "@/components/organisms/LogoutButton/LogoutButton";

export function CmsTopbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6">
      <div>
        <p className="text-sm font-semibold text-zinc-900">Panel de contenido</p>
        <p className="text-xs text-zinc-400">VJA Plantas</p>
      </div>
      <LogoutButton />
    </header>
  );
}

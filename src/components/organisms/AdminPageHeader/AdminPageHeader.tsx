export interface AdminPageHeaderProps {
  crumb: string;
  title: string;
  actions?: React.ReactNode;
}

export function AdminPageHeader({ crumb, title, actions }: AdminPageHeaderProps) {
  return (
    <header className="sticky top-0 z-[5] flex flex-wrap items-center justify-between gap-6 border-b border-[#E2DAC7] bg-paper/94 px-6 py-[18px] backdrop-blur-[10px] lg:px-10">
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-[0.18em] text-taupe">{crumb}</div>
        <h1 className="mt-[3px] font-display text-[30px] font-normal text-forest">{title}</h1>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2.5">{actions}</div> : null}
    </header>
  );
}

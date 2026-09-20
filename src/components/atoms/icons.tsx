import type { ReactNode, SVGProps } from "react";

function createIcon(path: ReactNode) {
  return function Icon({ className, ...props }: SVGProps<SVGSVGElement>) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        {path}
      </svg>
    );
  };
}

export const PlusIcon = createIcon(<path d="M12 5v14M5 12h14" />);

export const TrashIcon = createIcon(
  <>
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
  </>,
);

export const LogOutIcon = createIcon(
  <>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
  </>,
);

export const HeaderIcon = createIcon(
  <>
    <rect x="3" y="4" width="18" height="4" rx="1" />
    <path d="M3 12h18M3 16h10" />
  </>,
);

export const HeroIcon = createIcon(
  <>
    <rect x="3" y="4" width="18" height="12" rx="1" />
    <path d="M3 20h18" />
  </>,
);

export const FooterIcon = createIcon(
  <>
    <path d="M3 8h18M3 12h10" />
    <rect x="3" y="16" width="18" height="4" rx="1" />
  </>,
);

export const CloseIcon = createIcon(<path d="M18 6 6 18M6 6l12 12" />);

export const ChevronUpIcon = createIcon(<path d="m6 15 6-6 6 6" />);

export const ChevronDownIcon = createIcon(<path d="m6 9 6 6 6-6" />);

export const LayersIcon = createIcon(
  <>
    <path d="m12 2 9 5-9 5-9-5 9-5Z" />
    <path d="m3 12 9 5 9-5" />
    <path d="m3 17 9 5 9-5" />
  </>,
);

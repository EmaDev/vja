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

export const SearchIcon = createIcon(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </>,
);

export const MapPinIcon = createIcon(
  <>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </>,
);

export const ClockIcon = createIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </>,
);

export const PhoneIcon = createIcon(
  <path d="M15.5 21a13.5 13.5 0 0 1-12.5-12.5A2 2 0 0 1 5 6.3l2-.5a1.5 1.5 0 0 1 1.7.9l.9 2.1a1.5 1.5 0 0 1-.4 1.7l-1 .9a10 10 0 0 0 4.4 4.4l.9-1a1.5 1.5 0 0 1 1.7-.4l2.1.9a1.5 1.5 0 0 1 .9 1.7l-.5 2A2 2 0 0 1 15.5 21Z" />,
);

export const CheckIcon = createIcon(<path d="m4 12.5 5 5L20 6.5" />);

export const ArrowRightIcon = createIcon(
  <>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </>,
);

export const LeafIcon = createIcon(
  <>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.5 12 13 13 12" />
  </>,
);

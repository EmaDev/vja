export type AnnouncementMarqueeProps = {
  items?: string[];
};

const defaultItems = [
  "Vivero abierto de martes a domingo",
  "Taller de kokedama · sábado 12",
  "Garantía de vida 30 días",
];

/** Infinite scrolling ticker bar, typically stacked above a header. Mockup ref: 1d. */
export function AnnouncementMarquee({ items = defaultItems }: AnnouncementMarqueeProps) {
  const track = (key: string) => (
    <div
      key={key}
      className="flex gap-14 whitespace-nowrap pr-14 text-[13px] uppercase tracking-[0.16em] text-[#E3D9BE]"
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-14">
          {item}
          <span aria-hidden>·</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden bg-forest py-[11px]">
      <div className="flex w-max animate-[rp-marquee_26s_linear_infinite]">
        {track("a")}
        {track("b")}
      </div>
    </div>
  );
}

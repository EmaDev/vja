export type AvatarStackProps = {
  colors?: string[];
  label: string;
};

/** Overlapping avatar dots paired with a rating/trust label. Mockup ref: 1d. */
export function AvatarStack({ colors = ["#C9D6C2", "#E0C7A8", "#A8BCA1"], label }: AvatarStackProps) {
  return (
    <div className="flex items-center gap-3.5">
      <div className="flex">
        {colors.map((color, i) => (
          <div
            key={color}
            className="h-9 w-9 rounded-full border-2 border-paper"
            style={{ backgroundColor: color, marginLeft: i === 0 ? 0 : -12 }}
          />
        ))}
      </div>
      <span className="text-sm text-stone">{label}</span>
    </div>
  );
}

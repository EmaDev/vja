export type WireKind =
  | "center"
  | "float"
  | "left"
  | "strip"
  | "side"
  | "split"
  | "bleed"
  | "collage"
  | "arch"
  | "dark"
  | "drawer"
  | "row"
  | "circle";

export interface VariantWireframeProps {
  kind: WireKind;
  active: boolean;
}

/** Abstract bar/block mockup of a layout, used inside the variant picker cards. */
export function VariantWireframe({ kind, active }: VariantWireframeProps) {
  const ink = active ? "#3F6B47" : "#C6BEA9";
  const soft = active ? "rgba(63,107,71,0.28)" : "#DCD4C0";

  switch (kind) {
    case "center":
      return (
        <div className="flex flex-col gap-1.5">
          <div className="mb-0.5 flex justify-center gap-1.5">
            <div className="h-1.5 w-[30px] rounded" style={{ background: soft }} />
            <div className="h-1.5 w-[30px] rounded" style={{ background: soft }} />
          </div>
          <div className="mx-auto h-[11px] w-[46%] rounded" style={{ background: ink }} />
          <div className="flex justify-center gap-1.5">
            <div className="h-1.5 w-[34px] rounded" style={{ background: soft }} />
            <div className="h-1.5 w-[34px] rounded" style={{ background: soft }} />
          </div>
        </div>
      );
    case "float":
      return (
        <div
          className="flex h-24 items-start justify-center rounded-md p-2.5"
          style={{ background: soft }}
        >
          <div
            className="h-4 w-[58%] rounded-full"
            style={{ background: active ? "#3F6B47" : "#B6AE99" }}
          />
        </div>
      );
    case "left":
      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-[42px] rounded" style={{ background: ink }} />
            <div className="h-1.5 flex-1 rounded" style={{ background: soft }} />
            <div className="h-3.5 w-[30px] rounded-full" style={{ background: soft }} />
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[58px] rounded" style={{ background: soft }} />
            ))}
          </div>
        </div>
      );
    case "strip":
      return (
        <div>
          <div className="h-3 w-full rounded" style={{ background: ink }} />
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded" style={{ background: soft }} />
            <div className="h-2.5 w-11 rounded" style={{ background: ink }} />
            <div className="h-1.5 flex-1 rounded" style={{ background: soft }} />
          </div>
        </div>
      );
    case "side":
      return (
        <div className="flex h-[108px] gap-2">
          <div className="w-10 rounded" style={{ background: ink }} />
          <div className="flex-1 rounded" style={{ background: soft }} />
        </div>
      );
    case "split":
      return (
        <div className="flex h-[108px] gap-2">
          <div className="flex flex-1 flex-col justify-center gap-1.5">
            <div className="h-3 w-[80%] rounded" style={{ background: ink }} />
            <div className="h-3 w-[62%] rounded" style={{ background: ink }} />
            <div className="mt-1 h-1.5 w-[90%] rounded" style={{ background: soft }} />
          </div>
          <div className="flex-1 rounded" style={{ background: soft }} />
        </div>
      );
    case "bleed":
      return (
        <div
          className="flex h-28 flex-col justify-end gap-[5px] rounded p-2.5"
          style={{ background: soft }}
        >
          <div className="h-3 w-[70%] rounded" style={{ background: ink }} />
          <div
            className="h-1.5 w-[45%] rounded"
            style={{ background: active ? "rgba(63,107,71,0.5)" : "#C6BEA9" }}
          />
        </div>
      );
    case "collage":
      return (
        <div>
          <div className="flex h-[92px] items-start gap-1.5">
            <div className="mt-5 h-[62px] flex-1 rounded" style={{ background: soft }} />
            <div className="h-[86px] flex-1 rounded" style={{ background: soft }} />
            <div className="mt-2.5 h-[52px] flex-1 rounded" style={{ background: soft }} />
          </div>
          <div className="mx-auto mt-2 h-3 w-[66%] rounded" style={{ background: ink }} />
        </div>
      );
    case "arch":
      return (
        <div className="flex h-[108px] items-center gap-2">
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="h-3 w-[85%] rounded" style={{ background: ink }} />
            <div className="h-1.5 w-[60%] rounded" style={{ background: soft }} />
          </div>
          <div className="h-[100px] w-[62px] rounded-[31px_31px_4px_4px]" style={{ background: soft }} />
        </div>
      );
    case "dark":
      return (
        <div
          className="flex h-28 flex-col justify-between rounded p-2.5"
          style={{ background: active ? "#17301F" : "#3A4A3C" }}
        >
          <div className="h-3 w-[64%] rounded" style={{ background: "#E9E4D8" }} />
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-[26px] flex-1 rounded" style={{ background: "rgba(233,228,216,0.35)" }} />
            ))}
          </div>
        </div>
      );
    case "drawer":
      return (
        <div className="flex h-28 gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-1 flex-col justify-end rounded" style={{ background: soft }}>
              <div
                className="rounded-b"
                style={{ height: i === 1 ? 40 : 0, background: active ? "#3F6B47" : "#B6AE99" }}
              />
            </div>
          ))}
        </div>
      );
    case "row":
      return (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex h-8 items-center gap-2">
              <div className="h-8 w-[42px] rounded" style={{ background: soft }} />
              <div className="h-2 flex-1 rounded" style={{ background: ink }} />
              <div className="h-4 w-4 rounded-full" style={{ border: `1px solid ${ink}` }} />
            </div>
          ))}
        </div>
      );
    case "circle":
      return (
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="h-[34px] w-[34px] rounded-full" style={{ background: soft }} />
              <div className="h-1.5 w-[80%] rounded" style={{ background: ink }} />
            </div>
          ))}
        </div>
      );
    default:
      return <div className="h-2.5 w-full rounded" style={{ background: soft }} />;
  }
}

import type { CSSProperties } from "react";

/* Fondo decorativo de la pantalla de ingreso.
 *
 * Es un componente de servidor a propósito: no hay estado ni eventos, sólo
 * SVG y animaciones CSS (`vja-sway`, `vja-breathe`, `vja-mote` en
 * `globals.css`). Nada de esto necesita llegar al bundle del cliente, y el
 * formulario —que sí es interactivo— queda como la única isla de la página.
 *
 * Todo va con `aria-hidden`: para quien usa un lector de pantalla esta
 * pantalla es un título y dos campos, no un jardín. */

/** Hojas de la ramita, alternadas a los costados del tallo y cada vez más
 * chicas hacia la punta. Una sola forma repetida rotada y a distintas escalas
 * alcanza: a este tamaño y con la opacidad a la que van, la repetición no se lee. */
const SPRIG_LEAVES = [
  { cx: 34, cy: 184, rx: 28, ry: 11, rot: -18 },
  { cx: 87, cy: 161, rx: 26, ry: 10, rot: 18 },
  { cx: 33, cy: 139, rx: 25, ry: 10, rot: -22 },
  { cx: 86, cy: 115, rx: 22, ry: 9, rot: 22 },
  { cx: 38, cy: 93, rx: 20, ry: 8, rot: -26 },
  { cx: 83, cy: 71, rx: 17, ry: 7, rot: 26 },
  { cx: 67, cy: 45, rx: 9, ry: 15, rot: 10 },
];

function Sprig({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 220" fill="none" className={className} style={style}>
      <path
        d="M60 220C60 162 56 100 70 40"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
      {SPRIG_LEAVES.map((leaf) => (
        <ellipse
          key={`${leaf.cx}-${leaf.cy}`}
          cx={leaf.cx}
          cy={leaf.cy}
          rx={leaf.rx}
          ry={leaf.ry}
          transform={`rotate(${leaf.rot} ${leaf.cx} ${leaf.cy})`}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

/** Las ramas del borde. `rotate` las inclina desde su base y la animación se
 * aplica sobre el `<svg>` de adentro: así el vaivén se suma a la inclinación
 * en vez de pisarla, sin tener que repetir el ángulo en cada keyframe. */
const SPRIGS: Array<{
  wrapper: string;
  rotate: number;
  sway: string;
  duration: string;
  delay: string;
}> = [
  {
    wrapper: "bottom-[-7rem] left-[-5rem] w-[24rem] text-leaf/75",
    rotate: 12,
    sway: "2.6deg",
    duration: "13s",
    delay: "0s",
  },
  {
    wrapper: "bottom-[-9rem] left-[6rem] hidden w-[18rem] text-leaf/55 md:block",
    rotate: -9,
    sway: "-3.2deg",
    duration: "16s",
    delay: "1.4s",
  },
  {
    wrapper: "bottom-[-6rem] right-[-4rem] w-[22rem] text-leaf/70",
    rotate: -14,
    sway: "-2.2deg",
    duration: "11s",
    delay: "0.6s",
  },
  {
    wrapper: "bottom-[-10rem] right-[8rem] hidden w-[20rem] text-leaf/45 lg:block",
    rotate: 7,
    sway: "2.8deg",
    duration: "18s",
    delay: "2.2s",
  },
  {
    wrapper: "top-[-9rem] left-[12%] hidden w-[16rem] text-leaf/40 md:block",
    rotate: 166,
    sway: "2deg",
    duration: "15s",
    delay: "0.9s",
  },
  {
    wrapper: "top-[-8rem] right-[6%] hidden w-[14rem] text-leaf/40 md:block",
    rotate: 193,
    sway: "-2.4deg",
    duration: "12s",
    delay: "1.8s",
  },
];

/** Motas de polen que suben en diagonal. Las posiciones están escritas a mano
 * y no sorteadas: un `Math.random()` acá daría un HTML distinto en el servidor
 * y en el cliente, y React avisaría del desajuste en cada carga. */
const MOTES: Array<{ left: string; size: number; duration: string; delay: string; drift: string; opacity: number }> = [
  { left: "8%", size: 5, duration: "19s", delay: "0s", drift: "40px", opacity: 0.4 },
  { left: "21%", size: 3, duration: "24s", delay: "3s", drift: "-30px", opacity: 0.3 },
  { left: "34%", size: 6, duration: "16s", delay: "7s", drift: "55px", opacity: 0.45 },
  { left: "47%", size: 4, duration: "26s", delay: "1.5s", drift: "-45px", opacity: 0.28 },
  { left: "61%", size: 5, duration: "21s", delay: "9s", drift: "35px", opacity: 0.38 },
  { left: "74%", size: 3, duration: "28s", delay: "5s", drift: "-25px", opacity: 0.3 },
  { left: "88%", size: 6, duration: "18s", delay: "11s", drift: "48px", opacity: 0.42 },
];

export function LoginBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Cielo del invernadero: verde profundo arriba, un poco más cálido abajo. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_0%,#1b3a26_0%,#12271a_45%,#0b1a10_100%)]" />

      {/* Las dos luces que respiran. La terracota es la más chica y entra
          tarde: la idea es un rayo de sol entre las hojas, no un semáforo. */}
      <div
        className="absolute -left-24 top-[-10%] h-[36rem] w-[36rem] rounded-full bg-sage/35 blur-[140px]"
        style={{ animation: "vja-breathe 14s ease-in-out infinite" }}
      />
      <div
        className="absolute -right-32 bottom-[-18%] h-[32rem] w-[32rem] rounded-full bg-terracotta/20 blur-[150px]"
        style={{ animation: "vja-breathe 18s ease-in-out 3s infinite" }}
      />

      {SPRIGS.map((sprig) => (
        <div
          key={sprig.wrapper}
          className={`absolute origin-bottom ${sprig.wrapper}`}
          style={{ transform: `rotate(${sprig.rotate}deg)` }}
        >
          <Sprig
            className="w-full origin-bottom"
            style={
              {
                "--vja-sway": sprig.sway,
                animation: `vja-sway ${sprig.duration} ease-in-out ${sprig.delay} infinite`,
              } as CSSProperties
            }
          />
        </div>
      ))}

      {MOTES.map((mote) => (
        <span
          key={mote.left}
          className="absolute bottom-0 rounded-full bg-paper"
          style={
            {
              left: mote.left,
              height: mote.size,
              width: mote.size,
              opacity: 0,
              "--vja-mote-x": mote.drift,
              "--vja-mote-opacity": mote.opacity,
              animation: `vja-mote ${mote.duration} linear ${mote.delay} infinite`,
            } as CSSProperties
          }
        />
      ))}

      {/* Viñeta: oscurece los bordes para que el ojo caiga en la tarjeta. */}
      <div className="absolute inset-0 bg-[radial-gradient(75%_60%_at_50%_50%,transparent_0%,rgba(11,26,16,0.55)_100%)]" />
    </div>
  );
}

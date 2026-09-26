import qrcode from "qrcode-generator";

/** Zona de silencio del estándar: 4 módulos en blanco alrededor del código.
 * Sin ella muchos lectores no lo encuentran cuando la etiqueta está pegada
 * contra otra cosa. */
const QUIET_ZONE = 4;

export interface QrCodeProps {
  value: string;
  /** Lado del cuadrado, con unidad CSS. En las etiquetas va en `mm`. */
  size: string;
  className?: string;
}

/** QR dibujado como SVG.
 *
 * Se arma un único `<path>` con un cuadrado por módulo oscuro en vez de N
 * elementos `<rect>`: el SVG pesa una fracción y, al ser vectorial, sale nítido
 * a cualquier resolución de impresora. `shapeRendering="crispEdges"` evita que
 * el antialiasing borronee los bordes de los módulos en pantalla. */
export function QrCode({ value, size, className }: QrCodeProps) {
  const qr = qrcode(0, "M");
  qr.addData(value);
  qr.make();

  const count = qr.getModuleCount();
  const span = count + QUIET_ZONE * 2;

  let path = "";
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (qr.isDark(row, col)) {
        path += `M${col + QUIET_ZONE} ${row + QUIET_ZONE}h1v1h-1z`;
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${span} ${span}`}
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
      role="img"
      aria-label={`Código QR de ${value}`}
    >
      <rect width={span} height={span} fill="#ffffff" />
      <path d={path} fill="#000000" />
    </svg>
  );
}

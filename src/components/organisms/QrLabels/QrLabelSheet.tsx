import { QrCode } from "@/components/atoms/QrCode";
import {
  productDescription,
  productQrUrl,
  qrColorHex,
  qrSizeMm,
  type QrLabelOptions,
  type QrLabelStyleId,
} from "@/lib/cms/qr-labels";
import type { Product } from "@/lib/cms/catalog-types";

/** Las medidas van en milímetros porque el destino es papel: así una etiqueta
 * mide lo mismo impresa desde cualquier navegador, sin depender del zoom ni de
 * la densidad de pantalla. */
const LABEL_MIN_WIDTH: Record<QrLabelStyleId, number> = {
  minimal: 46,
  nursery: 64,
};

const LABEL_PADDING: Record<QrLabelStyleId, number> = {
  minimal: 4,
  nursery: 5,
};

/** Con la descripción extensa la etiqueta no baja de este ancho: un párrafo en
 * una columna de 38 mm sale a dos palabras por línea y se vuelve ilegible. La
 * descripción corta no lo necesita —es una línea— y así la etiqueta mínima
 * sigue siendo mínima. */
const DESCRIPTION_MIN_WIDTH = 64;

/** El ancho se deriva del QR en vez de ser fijo: con el QR en 42 mm, los 46 mm
 * de la etiqueta mínima lo recortaban contra el borde. */
function labelWidth(options: QrLabelOptions): string {
  const floor = Math.max(
    LABEL_MIN_WIDTH[options.style],
    options.description === "long" ? DESCRIPTION_MIN_WIDTH : 0,
  );
  const needed = qrSizeMm(options.size) + LABEL_PADDING[options.style] * 2;
  return `${Math.max(floor, needed)}mm`;
}

/** La descripción sobre papel. Va alineada a la izquierda incluso en la
 * etiqueta mínima, que por lo demás está centrada: un párrafo centrado deja los
 * cortes de línea en diagonal y cuesta seguirlo. */
function Description({ text }: { text: string }) {
  return <p className="text-left text-[8pt] leading-[1.35] text-[#333]">{text}</p>;
}

interface LabelProps {
  product: Product;
  url: string;
  options: QrLabelOptions;
}

function MinimalLabel({ product, url, options }: LabelProps) {
  const description = productDescription(product, options.description);

  return (
    <div
      className="qr-print-label flex flex-col items-center gap-[3mm] border border-[#D8D2C4] p-[4mm] text-center"
      style={{ width: labelWidth(options) }}
    >
      <QrCode
        value={url}
        size={`${qrSizeMm(options.size)}mm`}
        color={qrColorHex(options.color)}
      />
      <div className="font-display text-[11pt] leading-[1.1] text-black">{product.name}</div>
      {description ? <Description text={description} /> : null}
    </div>
  );
}

function NurseryLabel({ product, url, options }: LabelProps) {
  const description = productDescription(product, options.description);

  return (
    <div
      className="qr-print-label flex flex-col gap-[3mm] border border-[#D8D2C4] p-[5mm]"
      style={{ width: labelWidth(options) }}
    >
      <div>
        <div className="font-display text-[13pt] leading-[1.1] text-black">{product.name}</div>
        {product.latin ? (
          <div className="mt-[1mm] text-[8pt] italic leading-[1.2] text-[#555]">{product.latin}</div>
        ) : null}
      </div>

      {/* Mismo orden que la ficha pública: nombre y después la descripción. */}
      {description ? <Description text={description} /> : null}

      <div className="flex flex-col items-center gap-[1.5mm]">
        <QrCode
          value={url}
          size={`${qrSizeMm(options.size)}mm`}
          color={qrColorHex(options.color)}
        />
        <span className="text-[7pt] leading-none text-[#666]">Escaneá para ver la ficha</span>
      </div>
    </div>
  );
}

export interface QrLabelSheetProps {
  products: Product[];
  options: QrLabelOptions;
}

/** Hoja imprimible: las etiquetas se acomodan una al lado de la otra y el
 * navegador corta las páginas solo. `break-inside: avoid` (en `globals.css`)
 * evita que una etiqueta quede partida al medio entre dos hojas. */
export function QrLabelSheet({ products, options }: QrLabelSheetProps) {
  const printable = products
    .map((product) => ({ product, url: productQrUrl(product) }))
    .filter((item): item is { product: Product; url: string } => item.url !== null);

  if (printable.length === 0) {
    return (
      <p className="p-[10mm] text-center text-sm text-stone">
        No hay ningún producto guardado con URL para imprimir.
      </p>
    );
  }

  return (
    <div className="qr-print-sheet flex flex-wrap content-start items-start gap-[4mm] bg-white p-[4mm]">
      {printable.map(({ product, url }) =>
        options.style === "minimal" ? (
          <MinimalLabel key={product.id} product={product} url={url} options={options} />
        ) : (
          <NurseryLabel key={product.id} product={product} url={url} options={options} />
        ),
      )}
    </div>
  );
}

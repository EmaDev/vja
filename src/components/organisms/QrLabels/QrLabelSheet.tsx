import { QrCode } from "@/components/atoms/QrCode";
import { productQrUrl, type QrLabelStyleId } from "@/lib/cms/qr-labels";
import type { Product } from "@/lib/cms/catalog-types";

/** Las medidas van en milímetros porque el destino es papel: así una etiqueta
 * mide lo mismo impresa desde cualquier navegador, sin depender del zoom ni de
 * la densidad de pantalla. */
const LABEL_WIDTH: Record<QrLabelStyleId, string> = {
  minimal: "46mm",
  nursery: "64mm",
};

function petSafeLabel(product: Product): string {
  return product.petSafe.trim().toLowerCase().startsWith("s") ? "Sí" : "No";
}

/** Sólo lo que se lee de un vistazo frente a la planta. La ficha completa está
 * del otro lado del QR. */
function careRows(product: Product): { label: string; value: string }[] {
  return [
    { label: "Luz", value: product.light },
    { label: "Riego", value: product.water },
    { label: "Altura", value: product.height },
    { label: "Mascotas", value: petSafeLabel(product) },
  ].filter((row) => row.value !== "");
}

function MinimalLabel({ product, url }: { product: Product; url: string }) {
  return (
    <div
      className="qr-print-label flex flex-col items-center gap-[3mm] border border-[#D8D2C4] p-[4mm] text-center"
      style={{ width: LABEL_WIDTH.minimal }}
    >
      <QrCode value={url} size="32mm" />
      <div className="font-display text-[11pt] leading-[1.1] text-black">{product.name}</div>
    </div>
  );
}

function NurseryLabel({ product, url }: { product: Product; url: string }) {
  const rows = careRows(product);

  return (
    <div
      className="qr-print-label flex flex-col gap-[3mm] border border-[#D8D2C4] p-[5mm]"
      style={{ width: LABEL_WIDTH.nursery }}
    >
      <div>
        <div className="font-display text-[13pt] leading-[1.1] text-black">{product.name}</div>
        {product.latin ? (
          <div className="mt-[1mm] text-[8pt] italic leading-[1.2] text-[#555]">{product.latin}</div>
        ) : null}
      </div>

      {rows.length > 0 ? (
        <dl className="flex flex-col gap-[1mm] border-y border-[#E4DFD2] py-[2mm] text-[8pt] leading-[1.3]">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between gap-[2mm]">
              <dt className="text-[#666]">{row.label}</dt>
              <dd className="text-right font-medium text-black">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="flex flex-col items-center gap-[1.5mm]">
        <QrCode value={url} size="34mm" />
        <span className="text-[7pt] leading-none text-[#666]">Escaneá para ver la ficha</span>
      </div>
    </div>
  );
}

export interface QrLabelSheetProps {
  products: Product[];
  style: QrLabelStyleId;
}

/** Hoja imprimible: las etiquetas se acomodan una al lado de la otra y el
 * navegador corta las páginas solo. `break-inside: avoid` (en `globals.css`)
 * evita que una etiqueta quede partida al medio entre dos hojas. */
export function QrLabelSheet({ products, style }: QrLabelSheetProps) {
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
    <div className="qr-print-sheet flex flex-wrap content-start gap-[4mm] bg-white p-[4mm]">
      {printable.map(({ product, url }) =>
        style === "minimal" ? (
          <MinimalLabel key={product.id} product={product} url={url} />
        ) : (
          <NurseryLabel key={product.id} product={product} url={url} />
        ),
      )}
    </div>
  );
}

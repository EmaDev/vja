import { MiniProductTile, type MiniProductTileProps } from "@/components/molecules/MiniProductTile";

export type TrendingProductsRowProps = {
  label?: string;
  /** Texto chico a la derecha del título. Vacío no se dibuja. */
  pager?: string;
  products: MiniProductTileProps[];
};

/** Heading + grid of mini product tiles for a "most wanted this week" strip. Mockup ref: 1e. */
export function TrendingProductsRow({
  label = "Lo más pedido esta semana",
  pager,
  products,
}: TrendingProductsRowProps) {
  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <span className="text-xs uppercase tracking-[0.2em] text-[#9FB09A]">{label}</span>
        {pager ? <span className="text-[13px] text-[#9FB09A]">{pager}</span> : null}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {products.map((product) => (
          <MiniProductTile key={product.href ?? product.name} {...product} />
        ))}
      </div>
    </div>
  );
}

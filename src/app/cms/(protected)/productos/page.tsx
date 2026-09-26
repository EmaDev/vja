import type { Metadata } from "next";
import { ProductsAdmin } from "@/components/organisms/ProductsAdmin/ProductsAdmin";
import { listCategories, listProducts } from "@/lib/cms/catalog-repository";

export const metadata: Metadata = {
  title: "Productos · VJA Plantas",
};

export default async function ProductosPage() {
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);

  return (
    <ProductsAdmin
      products={products}
      categoryNames={categories.map((category) => category.name)}
    />
  );
}

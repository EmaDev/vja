import type { Metadata } from "next";
import { CategoriesAdmin } from "@/components/organisms/CategoriesAdmin/CategoriesAdmin";
import { categoryProductCounts, listCategories } from "@/lib/cms/catalog-repository";

export const metadata: Metadata = {
  title: "Categorías · VJA Plantas",
};

export default async function CategoriasPage() {
  const [categories, productCounts] = await Promise.all([
    listCategories(),
    categoryProductCounts(),
  ]);

  return <CategoriesAdmin categories={categories} productCounts={productCounts} />;
}

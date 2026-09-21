import type { Metadata } from "next";
import { ProductsAdmin } from "@/components/organisms/ProductsAdmin/ProductsAdmin";

export const metadata: Metadata = {
  title: "Productos · VJA Plantas",
};

export default function ProductosPage() {
  return <ProductsAdmin />;
}

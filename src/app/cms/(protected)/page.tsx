import { Suspense } from "react";
import type { Metadata } from "next";
import { CmsDesignWorkspace } from "@/components/organisms/CmsDesignWorkspace/CmsDesignWorkspace";
import { listProducts } from "@/lib/cms/catalog-repository";

export const metadata: Metadata = {
  title: "Diseño y contenido · VJA Plantas",
};

export default async function CmsDashboardPage() {
  // Para el selector de planta destacada del hero. `listProducts` está cacheada
  // por request, así que comparte la lectura con los totales del sidebar.
  const products = await listProducts();

  return (
    <Suspense fallback={null}>
      <CmsDesignWorkspace products={products} />
    </Suspense>
  );
}

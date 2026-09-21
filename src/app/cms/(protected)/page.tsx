import { Suspense } from "react";
import type { Metadata } from "next";
import { CmsDesignWorkspace } from "@/components/organisms/CmsDesignWorkspace/CmsDesignWorkspace";

export const metadata: Metadata = {
  title: "Diseño y contenido · VJA Plantas",
};

export default function CmsDashboardPage() {
  return (
    <Suspense fallback={null}>
      <CmsDesignWorkspace />
    </Suspense>
  );
}

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCmsUser } from "@/lib/auth/session-guard";
import { CMS_LOGIN_PATH } from "@/lib/firebase/constants";
import { AdminSidebar } from "@/components/organisms/AdminSidebar/AdminSidebar";
import { CmsDraftProvider } from "@/lib/cms/draft-context";
import { getDraft } from "@/lib/cms/repository";
import { listCategories, listProducts } from "@/lib/cms/catalog-repository";
import { listPromotions } from "@/lib/cms/promo-repository";
import { isPromotionActiveAt, siteMoment } from "@/lib/cms/promo-types";
import type { CatalogStatus } from "@/lib/cms/catalog-types";
import type { Promotion } from "@/lib/cms/promo-types";

function totals(items: { status: CatalogStatus }[]) {
  return {
    total: items.length,
    drafts: items.filter((item) => item.status === "draft").length,
  };
}

function promotionTotals(promotions: Promotion[]) {
  const moment = siteMoment();
  return {
    total: promotions.length,
    active: promotions.filter((promotion) => isPromotionActiveAt(promotion, moment)).length,
  };
}

export default async function CmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCmsUser();

  if (!user) {
    redirect(CMS_LOGIN_PATH);
  }

  // Las mismas lecturas que hacen las páginas de catálogo: `listProducts` y
  // `listCategories` están envueltas en `cache()`, así que layout y página
  // comparten una sola consulta por request.
  const [draft, products, categories, promotions] = await Promise.all([
    getDraft(),
    listProducts(),
    listCategories(),
    listPromotions(),
  ]);

  return (
    <CmsDraftProvider initialSections={draft}>
      <div className="cms-scope grid min-h-screen grid-cols-1 bg-paper text-forest lg:grid-cols-[268px_minmax(0,1fr)]">
        <Suspense fallback={<div className="hidden bg-forest lg:block lg:h-screen" />}>
          <AdminSidebar
            products={totals(products)}
            categories={totals(categories)}
            promotions={promotionTotals(promotions)}
          />
        </Suspense>
        {/* `pt-14` deja libre la barra superior fija de mobile; en escritorio esa
            barra no existe y la columna arranca pegada arriba. */}
        <main className="flex min-w-0 flex-col pt-14 lg:pt-0">{children}</main>
      </div>
    </CmsDraftProvider>
  );
}

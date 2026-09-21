import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCmsUser } from "@/lib/auth/session-guard";
import { CMS_LOGIN_PATH } from "@/lib/firebase/constants";
import { AdminSidebar } from "@/components/organisms/AdminSidebar/AdminSidebar";
import { CmsDraftProvider } from "@/lib/cms/draft-context";
import { getDraft } from "@/lib/cms/repository";

export default async function CmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCmsUser();

  if (!user) {
    redirect(CMS_LOGIN_PATH);
  }

  const draft = await getDraft();

  return (
    <CmsDraftProvider initialSections={draft}>
      <div className="cms-scope grid min-h-screen grid-cols-1 bg-paper text-forest lg:grid-cols-[252px_minmax(0,1fr)]">
        <Suspense fallback={<div className="bg-forest lg:h-screen lg:w-[252px]" />}>
          <AdminSidebar />
        </Suspense>
        <main className="flex min-w-0 flex-col">{children}</main>
      </div>
    </CmsDraftProvider>
  );
}

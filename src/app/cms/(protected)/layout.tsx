import { redirect } from "next/navigation";
import { isCmsAuthenticated } from "@/lib/auth/session-guard";
import { CMS_LOGIN_PATH } from "@/lib/firebase/constants";
import { CmsTopbar } from "@/components/organisms/CmsTopbar/CmsTopbar";

export default async function CmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isCmsAuthenticated();

  if (!authenticated) {
    redirect(CMS_LOGIN_PATH);
  }

  return (
    <div className="cms-scope flex min-h-screen flex-col bg-zinc-50">
      <CmsTopbar />
      {children}
    </div>
  );
}

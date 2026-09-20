"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "@/lib/firebase/admin";
import { getCmsUser } from "@/lib/auth/session-guard";
import { CMS_LOGIN_PATH, SESSION_COOKIE_NAME } from "@/lib/firebase/constants";

export async function logout() {
  const user = await getCmsUser();

  if (user) {
    await getAuth(getAdminApp())
      .revokeRefreshTokens(user.uid)
      .catch(() => {});
  }

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect(CMS_LOGIN_PATH);
}

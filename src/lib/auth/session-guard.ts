import "server-only";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/firebase/session";
import { SESSION_COOKIE_NAME } from "@/lib/firebase/constants";

export type CmsRole = "admin" | "editor";

export interface CmsUser {
  uid: string;
  email: string | null;
  role: CmsRole;
}

/**
 * Cheap presence-only check for `proxy.ts`. Proxy runs on every CMS
 * navigation, so it must not do a network round-trip to verify the cookie —
 * that verification happens in `getCmsUser()` inside the protected layout.
 */
export async function hasSessionCookie(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has(SESSION_COOKIE_NAME);
}

export async function getCmsUser(): Promise<CmsUser | null> {
  const decoded = await getCurrentUser();

  if (!decoded) {
    return null;
  }

  return {
    uid: decoded.uid,
    email: decoded.email ?? null,
    role: decoded.role === "admin" ? "admin" : "editor",
  };
}

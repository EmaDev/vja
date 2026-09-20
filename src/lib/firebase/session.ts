import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth";
import { getAdminApp } from "./admin";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "./constants";

export async function createSessionCookie(idToken: string): Promise<string> {
  return getAuth(getAdminApp()).createSessionCookie(idToken, {
    expiresIn: SESSION_MAX_AGE_SECONDS * 1000,
  });
}

export const getCurrentUser = cache(
  async (): Promise<DecodedIdToken | null> => {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return null;
    }

    try {
      return await getAuth(getAdminApp()).verifySessionCookie(sessionCookie, true);
    } catch {
      return null;
    }
  },
);

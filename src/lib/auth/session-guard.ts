import "server-only";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/firebase/session";
import { MOCK_SESSION_COOKIE_NAME } from "@/lib/firebase/constants";

// TODO(auth): drop the mock cookie fallback once the login screen creates real Firebase sessions.
export async function isCmsAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();

  if (cookieStore.get(MOCK_SESSION_COOKIE_NAME)) {
    return true;
  }

  return Boolean(await getCurrentUser());
}

import { NextResponse, type NextRequest } from "next/server";
import { hasSessionCookie } from "@/lib/auth/session-guard";
import { CMS_LOGIN_PATH } from "@/lib/firebase/constants";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Optimistic check only — real verification happens in the protected
  // layout via `getCmsUser()`. See docs/app/guides/authentication.md.
  const authenticated = await hasSessionCookie();

  if (pathname === CMS_LOGIN_PATH) {
    if (authenticated) {
      return NextResponse.redirect(new URL("/cms", request.url));
    }
    return NextResponse.next();
  }

  if (!authenticated) {
    return NextResponse.redirect(new URL(CMS_LOGIN_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cms/:path*"],
};

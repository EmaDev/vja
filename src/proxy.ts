import { NextResponse, type NextRequest } from "next/server";
import { isCmsAuthenticated } from "@/lib/auth/session-guard";
import { CMS_LOGIN_PATH } from "@/lib/firebase/constants";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = await isCmsAuthenticated();

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

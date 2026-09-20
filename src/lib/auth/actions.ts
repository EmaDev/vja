"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  CMS_LOGIN_PATH,
  MOCK_SESSION_COOKIE_NAME,
  SESSION_COOKIE_NAME,
} from "@/lib/firebase/constants";

export interface LoginState {
  error?: string;
}

// TODO(auth): replace with Firebase sign-in (client) + createSessionCookie (server) once wired up.
export async function mockLogin(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || !email || typeof password !== "string" || !password) {
    return { error: "Completá email y contraseña." };
  }

  const cookieStore = await cookies();
  cookieStore.set(MOCK_SESSION_COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  redirect("/cms");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(MOCK_SESSION_COOKIE_NAME);
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect(CMS_LOGIN_PATH);
}

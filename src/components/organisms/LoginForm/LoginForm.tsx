"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button, Input } from "lib-kit-components";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";
import { mapFirebaseAuthError } from "@/lib/firebase/auth-errors";

export interface LoginState {
  error?: string;
}

const initialState: LoginState = {};

export function LoginForm() {
  const router = useRouter();

  async function signIn(_prevState: LoginState, formData: FormData): Promise<LoginState> {
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || !email || typeof password !== "string" || !password) {
      return { error: "Completá email y contraseña." };
    }

    let idToken: string;

    try {
      const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      idToken = await credential.user.getIdToken();
    } catch (error) {
      return { error: mapFirebaseAuthError(error) };
    }

    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      return { error: "No se pudo iniciar sesión. Intentá de nuevo." };
    }

    router.replace("/cms");
    router.refresh();
    return {};
  }

  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <motion.form
      action={formAction}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex w-full flex-col gap-4"
    >
      <div>
        <h1 className="text-lg font-semibold text-zinc-900">Ingresar al panel</h1>
        <p className="mt-1 text-sm text-zinc-500">Acceso exclusivo para el equipo de VJA Plantas.</p>
      </div>
      <Input name="email" type="email" label="Email" autoComplete="username" required />
      <Input
        name="password"
        type="password"
        label="Contraseña"
        autoComplete="current-password"
        required
      />
      {state.error ? <p className="text-sm text-red-500">{state.error}</p> : null}
      <Button type="submit" loading={pending} fullWidth className="mt-2">
        Ingresar
      </Button>
    </motion.form>
  );
}

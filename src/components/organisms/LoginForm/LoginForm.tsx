"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { Button, Input } from "lib-kit-components";
import { mockLogin, type LoginState } from "@/lib/auth/actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(mockLogin, initialState);

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

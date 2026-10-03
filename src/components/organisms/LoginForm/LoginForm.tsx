"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { Button, Input } from "lib-kit-components";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";
import { mapFirebaseAuthError } from "@/lib/firebase/auth-errors";
import { ArrowRightIcon, LeafIcon } from "@/components/atoms/icons";

export interface LoginState {
  error?: string;
}

const initialState: LoginState = {};

/** La curva de salida del resto del sitio: arranca rápido y frena largo, que
 * es lo que hace que una entrada se sienta liviana y no mecánica. */
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function LoginForm() {
  const router = useRouter();

  /* Quien pidió menos movimiento en su sistema recibe la tarjeta ya puesta.
   * Las animaciones de framer-motion son estilos en línea que escribe
   * JavaScript, así que el bloque `prefers-reduced-motion` de `globals.css`
   * —que sólo alcanza a lo que anima el CSS— no las toca: hay que apagarlas
   * desde acá. */
  const reduceMotion = useReducedMotion();

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

  /* El formulario entra escalonado: primero el sello, después el título y al
   * final los campos. Cada hijo hereda el estado del padre, así que basta con
   * marcarlos `variants={item}` y el `staggerChildren` los ordena. */
  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: reduceMotion ? 0 : 0.18,
        staggerChildren: reduceMotion ? 0 : 0.07,
      },
    },
  };

  const item: Variants = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, ease: EASE_OUT }}
      className="relative w-full max-w-sm"
    >
      {/* Halo verde detrás de la tarjeta: la despega del fondo oscuro sin
          necesidad de un borde duro. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-5 rounded-[2.25rem] bg-sage/25 blur-3xl"
      />

      <motion.form
        action={formAction}
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative flex w-full flex-col gap-5 rounded-[1.75rem] border border-line/60 bg-paper-light p-8 shadow-[0_32px_80px_-32px_rgba(11,26,16,0.85)]"
      >
        <motion.div variants={item} className="flex justify-center">
          <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-sage text-paper shadow-lg shadow-sage/30">
            {/* El anillo late hacia afuera, como el agua cuando cae una gota. */}
            <span
              aria-hidden
              className="absolute inset-0 rounded-full border border-sage"
              style={{ animation: "vja-pulse 3.4s ease-out infinite" }}
            />
            <LeafIcon className="relative h-6 w-6" />
          </span>
        </motion.div>

        <motion.div variants={item} className="text-center">
          <span className="text-[10px] uppercase tracking-[0.42em] text-terracotta">
            Vivero
          </span>
          <h1 className="mt-2 font-display text-[34px] leading-[1.1] text-forest">VJA Plantas</h1>
          <motion.span
            aria-hidden
            initial={reduceMotion ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.45, ease: EASE_OUT }}
            className="mx-auto mt-3 block h-px w-20 bg-gradient-to-r from-transparent via-terracotta to-transparent"
          />
          <p className="mt-3 text-sm text-stone">
            Panel de contenido. Acceso exclusivo para el equipo.
          </p>
        </motion.div>

        <motion.div variants={item}>
          <Input name="email" type="email" label="Email" autoComplete="username" required />
        </motion.div>

        <motion.div variants={item}>
          <Input
            name="password"
            type="password"
            label="Contraseña"
            autoComplete="current-password"
            required
          />
        </motion.div>

        {/* El error aparece y desaparece animando también su altura: sin eso,
            la tarjeta pegaría un salto cada vez que falla un intento. */}
        <AnimatePresence initial={false}>
          {state.error ? (
            <motion.p
              key={state.error}
              role="alert"
              initial={reduceMotion ? false : { opacity: 0, height: 0, y: -4 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -4 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="overflow-hidden text-sm text-terracotta"
            >
              {state.error}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <motion.div variants={item}>
          <Button
            type="submit"
            loading={pending}
            fullWidth
            size="lg"
            rightIcon={<ArrowRightIcon className="h-4 w-4" />}
          >
            Ingresar
          </Button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}

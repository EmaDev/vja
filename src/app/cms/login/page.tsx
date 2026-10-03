import { LoginBackdrop } from "@/components/organisms/LoginForm/LoginBackdrop";
import { LoginForm } from "@/components/organisms/LoginForm/LoginForm";

export default function CmsLoginPage() {
  return (
    /* `overflow-hidden` recorta las ramas del fondo, que a propósito salen de
     * la pantalla por los cuatro lados: sin esto aparecerían barras de scroll
     * en una pantalla que no tiene nada para scrollear. */
    <main className="cms-scope relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <LoginBackdrop />
      <LoginForm />
    </main>
  );
}

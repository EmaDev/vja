import type { Metadata } from "next";
import { LoginBackdrop } from "@/components/organisms/LoginForm/LoginBackdrop";
import { LoginForm } from "@/components/organisms/LoginForm/LoginForm";

/** El panel no se indexa. El `robots.txt` ya pide no rastrear `/cms`, pero eso
 * sólo frena al rastreador: una URL que alguien pegó en algún lado puede
 * indexarse igual sin haber sido leída. El `noindex` en la respuesta es el que
 * la saca del índice. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

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

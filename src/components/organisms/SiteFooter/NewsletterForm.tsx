"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

export interface NewsletterFormProps {
  recipientEmail: string;
  tone: "forest" | "paper";
}

/** Alta al newsletter. Como el formulario de contacto, arma un `mailto:` hacia la
 * casilla del vivero mientras no haya un proveedor de envíos conectado. */
export function NewsletterForm({ recipientEmail, tone }: NewsletterFormProps) {
  const [done, setDone] = useState(false);
  const dark = tone === "forest";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    const subject = encodeURIComponent("Alta al newsletter");
    const body = encodeURIComponent(`Quiero recibir novedades en: ${email}`);
    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    setDone(true);
  }

  if (done) {
    return (
      <p role="status" className={cn("text-sm", dark ? "text-[#C7CFC1]" : "text-ink")}>
        ¡Listo! Revisá tu correo para confirmar el envío.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">
        Tu email
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        placeholder="tu@email.com"
        className={cn(
          "min-w-0 flex-1 rounded-full px-[18px] py-[11px] text-[15px] outline-none transition-colors focus:outline-2 focus:outline-offset-1",
          dark
            ? "border border-paper/25 bg-paper/[0.07] text-paper placeholder:text-[#8FA68A] focus:outline-paper/60"
            : "border border-line bg-paper-light text-forest placeholder:text-taupe focus:outline-sage",
        )}
      />
      <button
        type="submit"
        className={cn(
          "shrink-0 rounded-full px-6 py-[11px] text-[15px] font-medium transition-colors",
          dark ? "bg-paper text-forest hover:bg-white" : "bg-forest text-paper hover:bg-sage",
        )}
      >
        Suscribirme
      </button>
    </form>
  );
}

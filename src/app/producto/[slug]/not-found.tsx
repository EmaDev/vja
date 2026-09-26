import { CtaButton } from "@/components/atoms/CtaButton";

/** Slug inexistente, o producto todavía en borrador. Se responde con 404 real
 * —lo dispara `notFound()` en la página— para que un buscador no indexe una
 * planta que no está a la venta. */
export default function ProductNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
      <h1 className="font-display text-[40px] leading-[1.05] text-forest sm:text-[56px]">
        No encontramos esa planta
      </h1>
      <p className="max-w-[440px] text-base leading-[1.6] text-ink">
        Puede que ya no esté en el catálogo o que el enlace esté mal escrito.
      </p>
      <CtaButton href="/#catalogo" tone="forest" className="mt-2">
        Ver el catálogo
      </CtaButton>
    </main>
  );
}

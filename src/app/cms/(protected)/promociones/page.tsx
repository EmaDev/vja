import type { Metadata } from "next";
import { PromotionsAdmin } from "@/components/organisms/PromotionsAdmin/PromotionsAdmin";
import { listPromotions } from "@/lib/cms/promo-repository";
import { siteMoment } from "@/lib/cms/promo-types";

export const metadata: Metadata = {
  title: "Promocional · VJA Plantas",
};

export default async function PromocionesPage() {
  const promotions = await listPromotions();

  // El instante viaja desde el servidor para que el primer render del navegador
  // coincida con el HTML: si cada lado mirara su propio reloj, una promoción que
  // arranca justo en ese minuto daría un error de hidratación. A partir de ahí
  // el listado sigue su propio reloj.
  return <PromotionsAdmin promotions={promotions} initialMoment={siteMoment()} />;
}

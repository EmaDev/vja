import { notFound } from "next/navigation";
import { ProductCardArch } from "@/components/molecules/ProductCardArch";
import { ProductCardCircle } from "@/components/molecules/ProductCardCircle";
import { ProductCardDrawer } from "@/components/molecules/ProductCardDrawer";
import { ProductCardEditorialRow } from "@/components/molecules/ProductCardEditorialRow";
import { ProductCardOverlay } from "@/components/molecules/ProductCardOverlay";
import { HeroAnnouncementArch } from "@/components/organisms/HeroAnnouncementArch";
import { HeroCinematic } from "@/components/organisms/HeroCinematic";
import { HeroCollage } from "@/components/organisms/HeroCollage";
import { HeroEditorialSplit } from "@/components/organisms/HeroEditorialSplit";
import { HeroSidebarProduct } from "@/components/organisms/HeroSidebarProduct";

function Slot({ id, note, children }: { id: string; note: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 pb-[18px]">
        <span className="rounded-full bg-forest px-[11px] py-[5px] text-[13px] font-medium tracking-[0.14em] text-paper">
          {id}
        </span>
        <span className="text-sm text-stone">{note}</span>
      </div>
      {children}
    </div>
  );
}

export default function ComponentsPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main className="bg-cream">
      <section className="flex flex-col gap-[88px] px-12 py-14">
        <div className="flex items-baseline gap-5">
          <span className="font-display text-[38px] text-forest">Cards de producto</span>
          <span className="text-sm uppercase tracking-[0.08em] text-stone">5 variantes</span>
        </div>

        <Slot id="2a" note="Foto a sangre · la ficha de cuidados sube al pasar el mouse">
          <div className="grid grid-cols-3 gap-[26px] bg-paper p-11">
            <ProductCardOverlay
              category="Interior · luz media"
              name="Monstera Deliciosa"
              imageLabel="Monstera"
              tags={["Riego semanal", "Crece rápido"]}
            />
            <ProductCardOverlay
              category="Flores · corte del día"
              name="Ramo de temporada"
              imageLabel="Ramo de temporada"
              tags={["Dura 7 días", "Aroma suave"]}
            />
            <ProductCardOverlay
              category="Interior · resistente"
              name="Sansevieria"
              imageLabel="Sansevieria"
              tags={["Riego mensual", "Poca luz"]}
            />
          </div>
        </Slot>

        <Slot id="2b" note="Ficha botánica con arco · datos de cuidado en tres columnas">
          <div className="grid grid-cols-3 gap-[26px] bg-paper-light p-11">
            <ProductCardArch
              name="Ficus Lyrata"
              subtitle="Higuera hoja de violín"
              imageLabel="Ficus Lyrata"
              specs={[
                { label: "Luz", value: "Indirecta" },
                { label: "Riego", value: "Semanal" },
                { label: "Altura", value: "1,4 m" },
              ]}
            />
            <ProductCardArch
              name="Calathea Orbifolia"
              subtitle="Planta de la oración"
              imageLabel="Calathea"
              specs={[
                { label: "Luz", value: "Media" },
                { label: "Riego", value: "2 por semana" },
                { label: "Altura", value: "60 cm" },
              ]}
            />
            <ProductCardArch
              name="Zamioculca"
              subtitle="Planta ZZ"
              imageLabel="Zamioculca"
              specs={[
                { label: "Luz", value: "Baja" },
                { label: "Riego", value: "Mensual" },
                { label: "Altura", value: "70 cm" },
              ]}
            />
          </div>
        </Slot>

        <Slot id="2c" note="Cajón de descripción que se desliza desde abajo">
          <div className="grid grid-cols-3 gap-[26px] bg-forest p-11">
            <ProductCardDrawer
              badge="Sombra"
              name="Helecho Nido de Ave"
              imageLabel="Helecho"
              description="Le gusta la humedad del baño y la luz filtrada. Nunca sol directo sobre la hoja."
            />
            <ProductCardDrawer
              badge="Escritorio"
              name="Peperomia Sandía"
              imageLabel="Peperomia"
              description="Compacta y agradecida. Ideal para el primer intento con plantas de interior."
            />
            <ProductCardDrawer
              badge="Exterior"
              name="Olivo en maceta"
              imageLabel="Olivo"
              description="Pleno sol y poca agua. Aguanta el balcón más expuesto de la ciudad."
            />
          </div>
        </Slot>

        <Slot id="2d" note="Horizontal editorial · lista con numeración y flecha">
          <div className="flex flex-col gap-[18px] bg-paper p-11">
            <ProductCardEditorialRow
              index="01"
              category="Colgante · fácil"
              name="Pothos Marble Queen"
              imageLabel="Pothos"
              description="Crece hacia abajo y perdona los olvidos. La colgamos de un macramé teñido a mano en el taller."
            />
            <ProductCardEditorialRow
              index="02"
              category="Flor de corte · septiembre"
              name="Tulipanes blancos"
              imageLabel="Tulipanes"
              description="Llegan cerrados para que los veas abrir en casa. Diez varas por atado, papel kraft y cinta de algodón."
            />
            <ProductCardEditorialRow
              index="03"
              category="Taller · edición limitada"
              name="Kokedama de musgo"
              imageLabel="Kokedama"
              description="Sin maceta: la raíz va envuelta en musgo y se riega por inmersión una vez por semana."
            />
          </div>
        </Slot>

        <Slot id="2e" note="Retrato circular sobre papel · cuatro por fila, muy liviana">
          <div className="grid grid-cols-4 gap-[22px] bg-cream p-11">
            <ProductCardCircle imageLabel="Aloe" name="Aloe Vera" meta="Sol directo · riego escaso" />
            <ProductCardCircle imageLabel="Lavanda" name="Lavanda" meta="Balcón · aroma fuerte" />
            <ProductCardCircle imageLabel="Eucalipto" name="Eucalipto seco" meta="Sin agua · dura meses" />
            <ProductCardCircle
              imageLabel="Suculentas"
              name="Trío de suculentas"
              meta="Ventana · riego mensual"
            />
          </div>
        </Slot>
      </section>

      <section className="flex flex-col gap-24 px-12 pb-30">
        <div className="flex items-baseline gap-5">
          <span className="font-display text-[38px] text-forest">Raíz &amp; Pétalo — Heros &amp; Headers</span>
          <span className="text-sm uppercase tracking-[0.08em] text-stone">5 variantes</span>
        </div>

        <Slot id="1a" note="Editorial split · logo centrado, rótulo tipográfico">
          <HeroEditorialSplit />
        </Slot>

        <Slot id="1b" note="Full-bleed cinemático · header flotante sobre la foto">
          <HeroCinematic />
        </Slot>

        <Slot id="1c" note="Collage asimétrico · titular que se superpone a las fotos">
          <HeroCollage />
        </Slot>

        <Slot id="1d" note="Barra de anuncio en marquesina + hero con arco">
          <HeroAnnouncementArch />
        </Slot>

        <Slot id="1e" note="Nav lateral fija, hero oscuro y carrusel de producto">
          <HeroSidebarProduct />
        </Slot>
      </section>
    </main>
  );
}

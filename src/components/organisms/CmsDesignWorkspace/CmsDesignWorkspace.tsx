"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Modal } from "lib-kit-components";
import { AdminPageHeader } from "@/components/organisms/AdminPageHeader/AdminPageHeader";
import { AdminButton } from "@/components/atoms/AdminButton";
import { VariantPickerPanel } from "@/components/organisms/VariantPickerPanel/VariantPickerPanel";
import { HeaderEditor } from "@/components/organisms/SectionEditors/HeaderEditor";
import { HeroEditor } from "@/components/organisms/SectionEditors/HeroEditor";
import { AboutEditor } from "@/components/organisms/SectionEditors/AboutEditor";
import { ServicesEditor } from "@/components/organisms/SectionEditors/ServicesEditor";
import { CareEditor } from "@/components/organisms/SectionEditors/CareEditor";
import { VisitEditor } from "@/components/organisms/SectionEditors/VisitEditor";
import { ShippingEditor } from "@/components/organisms/SectionEditors/ShippingEditor";
import { FaqEditor } from "@/components/organisms/SectionEditors/FaqEditor";
import { ContactEditor } from "@/components/organisms/SectionEditors/ContactEditor";
import { FooterEditor } from "@/components/organisms/SectionEditors/FooterEditor";
import { SeoEditor } from "@/components/organisms/SectionEditors/SeoEditor";
import { FaviconEditor } from "@/components/organisms/SectionEditors/FaviconEditor";
import { SAVE_STATUS_LABEL, useCmsDraft } from "@/lib/cms/draft-context";
import { resolveTab } from "@/lib/cms/tabs";
import { hoursLines } from "@/lib/cms/contact-info";
import { headerVariants, type HeaderVariantId } from "@/lib/cms/header-variants";
import { heroVariants, type HeroVariantId } from "@/lib/cms/hero-variants";
import { cardVariants, type CardVariantId } from "@/lib/cms/card-variants";
import type { Product } from "@/lib/cms/catalog-types";
import type {
  AboutSection,
  CardsSection,
  CareSection,
  CmsSection,
  ContactSection,
  FaqSection,
  FaviconSection,
  FooterSection,
  HeaderSection,
  HeroSection,
  SeoSection,
  ServicesSection,
  ShippingSection,
  VisitSection,
} from "@/lib/cms/types";

const TAB_META: Record<string, { crumb: string; title: string }> = {
  header: { crumb: "Diseño / Header", title: "Elegí el header de la landing" },
  hero: { crumb: "Diseño / Hero", title: "Elegí el hero de la portada" },
  cards: { crumb: "Diseño / Cards de producto", title: "Elegí cómo se muestran las plantas" },
  nosotros: { crumb: "Secciones / Nosotros", title: "Quiénes somos" },
  servicios: { crumb: "Secciones / Servicios", title: "Servicios del local" },
  cuidados: { crumb: "Secciones / Cuidados", title: "Notas de cuidado" },
  visitanos: { crumb: "Secciones / Visitanos", title: "Horarios y ubicación" },
  envios: { crumb: "Secciones / Envíos", title: "Zona de envíos" },
  faq: { crumb: "Secciones / Preguntas frecuentes", title: "Preguntas frecuentes" },
  contacto: { crumb: "Contenido / Contacto", title: "Datos de contacto" },
  footer: { crumb: "Contenido / Footer", title: "Footer del sitio" },
  seo: { crumb: "Contenido / SEO", title: "SEO y redes sociales" },
  favicon: { crumb: "Contenido / Ícono del sitio", title: "Ícono del sitio" },
};

export interface CmsDesignWorkspaceProps {
  /** Catálogo completo. Sólo lo mira el hero, para elegir la planta destacada. */
  products: Product[];
}

export function CmsDesignWorkspace({ products }: CmsDesignWorkspaceProps) {
  const searchParams = useSearchParams();
  const tab = resolveTab(searchParams.get("tab"));
  const { sections, setSections, saveStatus, saveError, publish, publishStatus, publishError } =
    useCmsDraft();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [justPublished, setJustPublished] = useState(false);

  const header = sections.find((s): s is HeaderSection => s.kind === "header")!;
  const hero = sections.find((s): s is HeroSection => s.kind === "hero")!;
  const cards = sections.find((s): s is CardsSection => s.kind === "cards")!;
  const about = sections.find((s): s is AboutSection => s.kind === "about")!;
  const services = sections.find((s): s is ServicesSection => s.kind === "services")!;
  const care = sections.find((s): s is CareSection => s.kind === "care")!;
  const visit = sections.find((s): s is VisitSection => s.kind === "visit")!;
  const shipping = sections.find((s): s is ShippingSection => s.kind === "shipping")!;
  const faq = sections.find((s): s is FaqSection => s.kind === "faq")!;
  const contact = sections.find((s): s is ContactSection => s.kind === "contact")!;
  const footer = sections.find((s): s is FooterSection => s.kind === "footer")!;
  const seo = sections.find((s): s is SeoSection => s.kind === "seo")!;
  const favicon = sections.find((s): s is FaviconSection => s.kind === "favicon")!;

  // Sólo las publicadas: una planta en borrador no sale en el sitio, así que
  // elegirla dejaría la card del hero vacía sin explicación.
  const liveProducts = products.filter((product) => product.status === "live");
  const featuredProduct = liveProducts.find((product) => product.id === hero.featuredProductId);

  function updateSection(updated: CmsSection) {
    setSections((current) => current.map((section) => (section.id === updated.id ? updated : section)));
  }

  async function handlePublish() {
    const ok = await publish();
    if (ok) {
      setConfirmOpen(false);
      setJustPublished(true);
      setTimeout(() => setJustPublished(false), 4000);
    }
  }

  const meta = TAB_META[tab];
  const dotColor = saveStatus === "saved" ? "bg-sage" : "bg-terracotta";

  return (
    <>
      <AdminPageHeader
        crumb={meta.crumb}
        title={meta.title}
        actions={
          <>
            {/* El motivo del fallo va en el `title`: el cartel solo dice “Error
                al guardar”, y sin el detalle no hay forma de saber si fue la
                sesión, la conexión o un campo inválido. */}
            <span
              className={`mr-1.5 flex items-center gap-[7px] text-[13px] ${
                saveStatus === "error" ? "text-terracotta" : "text-stone"
              }`}
              title={saveError ?? undefined}
            >
              <span className={`h-[7px] w-[7px] rounded-full ${dotColor}`} />
              {justPublished ? "Publicado" : SAVE_STATUS_LABEL[saveStatus]}
            </span>
            <AdminButton href="/" variant="outline" newTab>
              Vista previa
            </AdminButton>
            <AdminButton variant="solid" onClick={() => setConfirmOpen(true)}>
              Publicar
            </AdminButton>
          </>
        }
      />

      <div className="max-w-[1180px] px-6 pb-20 pt-[34px] lg:px-10">
        {tab === "header" ? (
          <div className="flex flex-col gap-7">
            <VariantPickerPanel<HeaderVariantId>
              intro="La variante se aplica a todas las páginas del sitio. Podés cambiarla cuando quieras: el contenido del menú no se pierde."
              options={headerVariants}
              selected={header.variant}
              onSelect={(variant) => updateSection({ ...header, variant })}
              renderPreview={(id) => {
                const Variant = headerVariants.find((v) => v.id === id)!.Component;
                // Con el logo y el texto reales, el selector muestra cómo va a
                // quedar cada variante y no un maniquí con el nombre de ejemplo.
                return (
                  <div className="pt-16">
                    <Variant
                      logoText={header.logoText}
                      logoImageUrl={header.logoImageUrl}
                      logoImageAlt={header.logoImageAlt}
                      announcements={header.announcements.map((item) => item.text)}
                      address={contact.address}
                      hours={hoursLines(contact)}
                    />
                  </div>
                );
              }}
            />
            <HeaderEditor section={header} onChange={updateSection} />
          </div>
        ) : null}

        {tab === "hero" ? (
          <div className="flex flex-col gap-7">
            <VariantPickerPanel<HeroVariantId>
              intro="Cada variante usa los mismos textos e imágenes cargados en Contenido; sólo cambia la composición."
              options={heroVariants}
              selected={hero.variant}
              onSelect={(variant) => updateSection({ ...hero, variant })}
              renderPreview={(id) => {
                const variant = heroVariants.find((v) => v.id === id)!;
                const Variant = variant.Component;
                return <Variant {...variant.getProps({ ...hero, featuredProduct })} />;
              }}
            />
            <HeroEditor section={hero} onChange={updateSection} products={liveProducts} />
          </div>
        ) : null}

        {tab === "cards" ? (
          <VariantPickerPanel<CardVariantId>
            intro="Sin precios: cada card muestra nombre, categoría y datos de cuidado. Se aplica al catálogo completo."
            options={cardVariants}
            selected={cards.variant}
            onSelect={(variant) => updateSection({ ...cards, variant })}
            renderPreview={(id) => {
              const variant = cardVariants.find((v) => v.id === id)!;
              const Card = variant.Component;
              return (
                <div className={`grid grid-cols-3 gap-[26px] p-11 pt-24 ${variant.previewBg}`}>
                  {variant.sampleItems.map((item, index) => (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    <Card key={index} {...(item as any)} />
                  ))}
                </div>
              );
            }}
          />
        ) : null}

        {tab === "nosotros" ? <AboutEditor section={about} onChange={updateSection} /> : null}
        {tab === "servicios" ? <ServicesEditor section={services} onChange={updateSection} /> : null}
        {tab === "cuidados" ? <CareEditor section={care} onChange={updateSection} /> : null}
        {tab === "visitanos" ? (
          <VisitEditor section={visit} onChange={updateSection} address={contact.address} />
        ) : null}
        {tab === "envios" ? <ShippingEditor section={shipping} onChange={updateSection} /> : null}
        {tab === "faq" ? <FaqEditor section={faq} onChange={updateSection} /> : null}

        {tab === "contacto" ? <ContactEditor section={contact} onChange={updateSection} /> : null}
        {tab === "footer" ? <FooterEditor section={footer} onChange={updateSection} /> : null}
        {tab === "seo" ? <SeoEditor section={seo} onChange={updateSection} /> : null}
        {tab === "favicon" ? (
          <FaviconEditor
            section={favicon}
            onChange={updateSection}
            // El mismo nombre que arma el `<title>` de las páginas públicas
            // (ver `lib/seo/metadata.ts`): así la vista previa del ícono dice
            // lo que va a decir la pestaña de verdad.
            siteName={header.logoText.trim() || contact.storeName.trim() || "VJA Plantas"}
          />
        ) : null}
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Publicar cambios"
        description="El contenido publicado se actualiza con el borrador actual. La publicación anterior queda en el historial de versiones."
        footer={
          <div className="flex justify-end gap-2">
            <AdminButton variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </AdminButton>
            <AdminButton variant="solid" onClick={handlePublish} disabled={publishStatus === "publishing"}>
              {publishStatus === "publishing" ? "Publicando…" : "Publicar"}
            </AdminButton>
          </div>
        }
      >
        {publishStatus === "error" && publishError ? <p className="text-sm text-terracotta">{publishError}</p> : null}
      </Modal>
    </>
  );
}

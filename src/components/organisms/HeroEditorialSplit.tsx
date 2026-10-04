import { CtaButton } from "@/components/atoms/CtaButton";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { FloatingBadge } from "@/components/atoms/FloatingBadge";
import { ImagePlaceholder } from "@/components/atoms/ImagePlaceholder";
import { TextLink } from "@/components/atoms/TextLink";
import { SiteHeaderCentered } from "@/components/molecules/SiteHeaderCentered";

export type HeroEditorialSplitProps = {
  eyebrow?: string;
  titleLine1?: string;
  titleEmphasis?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  image?: string;
  imageAlt?: string;
  imageLabel?: string;
  /** Card flotante sobre la foto. `null` la saca: la landing la apaga cuando
   * no hay ninguna planta elegida en el panel. */
  featured?: { eyebrow: string; title: string; subtitle: string } | null;
  /** El header propio de la variante. La landing lo apaga y renderiza el elegido
   * en el CMS, que puede no ser el que trae el mockup de este hero. */
  showHeader?: boolean;
};

/** Editorial split hero: centered header, copy left, portrait photo with a favorite callout right. Mockup ref: 1a.
 *
 * La apertura se escalona: volanta, titular, bajada y botones suben uno detrás
 * de otro, y la foto se funde en paralelo con la card de la favorita al final.
 * Va con `rp-rise` y `rp-fade` de `globals.css` —animaciones CSS y no
 * framer-motion— porque esto es lo primero que se ve: no debería esperar a que
 * baje y arranque el JavaScript. Por eso tampoco necesita apagarse a mano para
 * quien pidió menos movimiento; de eso ya se encarga el bloque
 * `prefers-reduced-motion` de la hoja de estilos. */
export function HeroEditorialSplit({
  eyebrow = "Temporada de interior",
  titleLine1 = "Plantas que",
  titleEmphasis = "viven bien en tu casa",
  description = "Seleccionamos cada especie a mano en nuestro vivero de Tigre. Llega con maceta, sustrato y una ficha de cuidados escrita por nosotros.",
  primaryCtaLabel = "Ver catálogo",
  primaryCtaHref,
  secondaryCtaLabel = "Armar mi ramo →",
  secondaryCtaHref,
  image,
  imageAlt,
  imageLabel = "Foto vertical: monstera junto a ventana",
  featured = { eyebrow: "Favorita", title: "Monstera Deliciosa", subtitle: "Luz media" },
  showHeader = true,
}: HeroEditorialSplitProps) {
  return (
    <div className="bg-paper">
      {showHeader ? <SiteHeaderCentered /> : null}
      <div className="grid items-stretch lg:min-h-[620px] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="site-gutter flex flex-col justify-center py-14 md:py-20">
          {eyebrow ? (
            <span className="animate-[rp-fade_0.6s_ease_both]">
              <Eyebrow>{eyebrow}</Eyebrow>
            </span>
          ) : null}
          <h1 className="mt-[18px] animate-[rp-rise_0.8s_ease_0.1s_both] text-pretty font-display text-[46px] font-normal leading-[1] text-forest sm:text-[62px] lg:mt-[22px] lg:text-[72px] xl:text-[88px] xl:leading-[0.98]">
            {titleLine1}
            {titleEmphasis ? (
              <>
                <br />
                <em className="text-sage">{titleEmphasis}</em>
              </>
            ) : null}
          </h1>
          <p className="mt-5 max-w-[430px] animate-[rp-rise_0.8s_ease_0.22s_both] text-base leading-[1.6] text-ink md:text-lg lg:mt-[26px]">
            {description}
          </p>
          <div className="mt-8 flex animate-[rp-rise_0.8s_ease_0.34s_both] flex-wrap items-center gap-3.5 lg:mt-[38px]">
            {primaryCtaLabel ? <CtaButton href={primaryCtaHref}>{primaryCtaLabel}</CtaButton> : null}
            {secondaryCtaLabel ? <TextLink href={secondaryCtaHref}>{secondaryCtaLabel}</TextLink> : null}
          </div>
        </div>
        {/* `group` sobre la columna entera y no sobre el recorte: así el
            acercamiento de la foto también responde cuando el mouse pasa por la
            card de la favorita, que asoma fuera del marco. */}
        <div className="group relative h-[380px] bg-sand sm:h-[520px] lg:h-auto">
          {/* El recorte va acá dentro y no en la columna: la card de la favorita
              se apoya fuera del marco en pantallas grandes y un `overflow-hidden`
              más arriba se la comería. */}
          <div className="absolute inset-0 animate-[rp-fade_1.1s_ease_both] overflow-hidden">
            <div className="h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
              <ImagePlaceholder
                src={image}
                alt={imageAlt ?? titleLine1}
                label={imageLabel}
                // Es la imagen que mide el LCP: se ve sin scrollear, así que se
                // precarga en vez de esperar al observador de scroll.
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>
          {featured ? (
            <FloatingBadge
              className="absolute bottom-8 left-5 w-[170px] animate-[rp-rise_0.8s_ease_0.5s_both] lg:bottom-14 lg:left-[-56px] lg:w-[196px]"
              eyebrow={featured.eyebrow}
              title={featured.title}
              subtitle={featured.subtitle}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

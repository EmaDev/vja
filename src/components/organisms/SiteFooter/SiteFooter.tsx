import Link from "next/link";
import { Reveal, STAGGER } from "@/components/motion/Reveal";
import { RevealWords } from "@/components/motion/RevealWords";
import { cn } from "@/lib/utils";
import { socialLinks } from "@/lib/cms/social";
import type { ContactSection, FooterSection } from "@/lib/cms/types";

export interface SiteFooterProps {
  section: FooterSection;
  /** El footer no guarda dirección propia: la del pie sale de la sección de
   * contacto. */
  contact?: ContactSection;
}

export function SiteFooter({ section, contact }: SiteFooterProps) {
  const dark = section.background === "forest";
  const { instagram, pinterest } = socialLinks(section);
  const socials = [
    { href: instagram, label: "Instagram", handle: section.instagram },
    { href: pinterest, label: "Pinterest", handle: section.pinterest },
  ].filter((item): item is { href: string; label: string; handle: string } => Boolean(item.href));

  return (
    <footer
      className={cn(
        "site-gutter pb-10 pt-16 md:pb-12 md:pt-24",
        dark ? "bg-forest" : "bg-paper-dark",
      )}
    >
      {/* La frase de cierre es el elemento gráfico de la franja, así que se
          escribe sola palabra por palabra en vez de aparecer de una pieza. */}
      <RevealWords
        text={section.closingPhrase}
        className={cn(
          "max-w-[900px] font-display text-[38px] font-normal leading-[1.05] sm:text-[52px] lg:text-[68px]",
          dark ? "text-[#F9F6EF]" : "text-forest",
        )}
      />

      <div
        className={cn(
          "mt-12 grid gap-10 border-t pt-10 md:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.2fr)]",
          dark ? "border-paper/16" : "border-line",
        )}
      >
        {section.columns.map((column, index) => (
          <Reveal key={column.id} delay={index * STAGGER} duration={0.6} amount={0.3}>
            <nav aria-label={column.title}>
              <h2
                className={cn(
                  "text-[11px] uppercase tracking-[0.18em]",
                  dark ? "text-[#9FB09A]" : "text-taupe",
                )}
              >
                {column.title}
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href || "#"}
                      className={cn(
                        "inline-block text-[15px] transition-all duration-300 hover:translate-x-1",
                        dark ? "text-[#C7CFC1] hover:text-paper" : "text-ink hover:text-forest",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        ))}

        <Reveal delay={section.columns.length * STAGGER} duration={0.6} amount={0.3}>
          {socials.length > 0 ? (
            <div>
              <h2
                className={cn(
                  "text-[11px] uppercase tracking-[0.18em]",
                  dark ? "text-[#9FB09A]" : "text-taupe",
                )}
              >
                Seguinos
              </h2>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "border-b pb-[2px] text-[15px] transition-colors",
                      dark
                        ? "border-paper/40 text-[#C7CFC1] hover:border-paper hover:text-paper"
                        : "border-line text-ink hover:border-forest hover:text-forest",
                    )}
                  >
                    {social.label} · {social.handle}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </Reveal>
      </div>

      <Reveal
        animation="fade"
        duration={0.6}
        amount={0.5}
        className={cn(
          "mt-10 flex flex-col gap-2 border-t pt-6 text-[13px] sm:flex-row sm:items-center sm:justify-between",
          dark ? "border-paper/16 text-[#8FA68A]" : "border-line text-taupe",
        )}
      >
        <span>{section.legalText}</span>
        {contact ? <span>{contact.address}</span> : null}
      </Reveal>
    </footer>
  );
}

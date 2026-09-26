import Link from "next/link";
import { NewsletterForm } from "./NewsletterForm";
import { cn } from "@/lib/utils";
import type { ContactSection, FooterSection } from "@/lib/cms/types";

export interface SiteFooterProps {
  section: FooterSection;
  /** El footer no guarda casilla propia: el alta al newsletter va a la casilla
   * del local que se carga en la sección de contacto. */
  contact?: ContactSection;
}

function socialHref(base: string, handle: string): string | null {
  const clean = handle.trim().replace(/^@/, "");
  return clean ? `${base}/${clean}` : null;
}

export function SiteFooter({ section, contact }: SiteFooterProps) {
  const dark = section.background === "forest";
  const instagram = socialHref("https://instagram.com", section.instagram);
  const pinterest = socialHref("https://pinterest.com", section.pinterest);
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
      <p
        className={cn(
          "max-w-[900px] font-display text-[38px] font-normal leading-[1.05] sm:text-[52px] lg:text-[68px]",
          dark ? "text-[#F9F6EF]" : "text-forest",
        )}
      >
        {section.closingPhrase}
      </p>

      <div
        className={cn(
          "mt-12 grid gap-10 border-t pt-10 md:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.2fr)]",
          dark ? "border-paper/16" : "border-line",
        )}
      >
        {section.columns.map((column) => (
          <nav key={column.id} aria-label={column.title}>
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
                      "text-[15px] transition-colors",
                      dark ? "text-[#C7CFC1] hover:text-paper" : "text-ink hover:text-forest",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="flex flex-col gap-6">
          {section.newsletterEnabled && contact ? (
            <div>
              <h2
                className={cn(
                  "text-[11px] uppercase tracking-[0.18em]",
                  dark ? "text-[#9FB09A]" : "text-taupe",
                )}
              >
                Newsletter
              </h2>
              <p
                className={cn(
                  "mb-4 mt-3 max-w-[340px] text-[15px] leading-[1.55]",
                  dark ? "text-[#C7CFC1]" : "text-ink",
                )}
              >
                Una vez por mes: qué está floreciendo, talleres y cuidados de estación.
              </p>
              <NewsletterForm
                recipientEmail={contact.email}
                tone={section.background}
              />
            </div>
          ) : null}

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
        </div>
      </div>

      <div
        className={cn(
          "mt-10 flex flex-col gap-2 border-t pt-6 text-[13px] sm:flex-row sm:items-center sm:justify-between",
          dark ? "border-paper/16 text-[#8FA68A]" : "border-line text-taupe",
        )}
      >
        <span>{section.legalText}</span>
        {contact ? <span>{contact.address}</span> : null}
      </div>
    </footer>
  );
}

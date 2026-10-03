/** Markdown mínimo, el que se escribe desde el CMS.
 *
 * No entra una librería por esto: el texto que se carga en el editor usa media
 * docena de marcas y el resto del markdown —tablas, imágenes, html embebido— no
 * tiene dónde usarse en una ficha de planta. Un parser propio además evita
 * `dangerouslySetInnerHTML`: acá todo sale como elementos de React, así que lo
 * que se escriba en el panel no puede inyectar html en el sitio.
 *
 * Marcas soportadas, las mismas que ofrece la barra del editor:
 *
 *   ## Título          ### Subtítulo
 *   • – ▪ ✓ viñetas    1. numerada        a. con letras
 *   > cita             ---  (separador)
 *   **negrita**  _cursiva_  ~~tachado~~  ++subrayado++  `código`
 *   [texto](https://…)
 *
 * El subrayado va con `++` y no con `__`: en markdown `__` es un segundo alias
 * de la negrita, y hacerlo significar otra cosa rompería cualquier texto pegado
 * desde otro editor. */

import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** La cursiva con guión bajo pide que al lado no haya letra ni número: sin eso,
 * `nombre_cientifico_largo` saldría a medias en cursiva. La de asterisco no lo
 * necesita, porque nadie escribe asteriscos dentro de una palabra.
 *
 * Las expresiones se compilan con el flag `u` por `\p{L}`. */
const UNDERSCORE_ITALIC_SOURCE = "(?<![\\p{L}\\p{N}])_(?!\\s)(.+?)(?<!\\s)_(?![\\p{L}\\p{N}])";

/** Un alternado, en orden de precedencia: las marcas dobles van antes que las
 * simples para que `**negrita**` no se lea como dos cursivas vacías. */
const INLINE_SOURCE = [
  "\\*\\*(.+?)\\*\\*",
  "~~(.+?)~~",
  "\\+\\+(.+?)\\+\\+",
  "`([^`]+?)`",
  "\\[([^\\]]+?)\\]\\(([^)\\s]+?)\\)",
  "\\*(?!\\s)(.+?)(?<!\\s)\\*",
  UNDERSCORE_ITALIC_SOURCE,
].join("|");

const linkClass =
  "text-sage underline decoration-sage/40 underline-offset-4 transition-colors duration-300 hover:text-forest hover:decoration-forest";

/** Los enlaces internos viajan por `next/link` —navegación de cliente, igual que
 * el resto del sitio— y los externos salen en otra pestaña. `http(s)`, `mailto:`
 * y `tel:` son los únicos esquemas que se dejan pasar: evita que un
 * `javascript:` escrito en el panel termine en un `href`. */
function renderLink(href: string, children: ReactNode, key: string): ReactNode {
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link key={key} href={href} className={linkClass}>
        {children}
      </Link>
    );
  }

  if (!/^(https?:\/\/|mailto:|tel:)/i.test(href)) return <span key={key}>{children}</span>;

  return (
    <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {children}
    </a>
  );
}

/** Resuelve las marcas de una línea. Vuelve a entrar sobre el contenido de cada
 * marca, así `**texto _en_ negrita**` conserva las dos. */
function inline(text: string, keyRoot: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = new RegExp(INLINE_SOURCE, "gu");
  let last = 0;
  let index = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    last = match.index + match[0].length;

    const key = `${keyRoot}-${index++}`;
    const [, bold, strike, underline, code, linkText, linkHref, star, underscore] = match;

    if (bold !== undefined) {
      nodes.push(
        <strong key={key} className="font-semibold text-forest">
          {inline(bold, key)}
        </strong>,
      );
    } else if (strike !== undefined) {
      nodes.push(
        <s key={key} className="text-taupe">
          {inline(strike, key)}
        </s>,
      );
    } else if (underline !== undefined) {
      nodes.push(
        <u key={key} className="underline decoration-terracotta/60 decoration-2 underline-offset-4">
          {inline(underline, key)}
        </u>,
      );
    } else if (code !== undefined) {
      nodes.push(
        <code key={key} className="rounded bg-paper-dark px-1.5 py-0.5 text-[0.9em] text-forest">
          {code}
        </code>,
      );
    } else if (linkText !== undefined && linkHref !== undefined) {
      nodes.push(renderLink(linkHref, inline(linkText, key), key));
    } else {
      nodes.push(
        <em key={key} className="italic">
          {inline(star ?? underscore ?? "", key)}
        </em>,
      );
    }
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/** Un salto de línea suelto dentro de un párrafo se respeta: quien escribe en el
 * panel no espera que dos renglones se peguen en uno. */
function withBreaks(lines: string[], keyRoot: string): ReactNode[] {
  return lines.flatMap((line, index) => {
    const content = inline(line, `${keyRoot}-${index}`);
    return index === 0 ? content : [<br key={`${keyRoot}-br-${index}`} />, ...content];
  });
}

/** Los tipos de lista que entiende la ficha.
 *
 * La marca que se escribe es la viñeta que se ve: `• punto`, `– guión`,
 * `▪ cuadrado`, `✓ tilde`. Así el texto guardado se lee como una lista aun sin
 * el editor —en la etiqueta QR, en un correo, en el campo de Firestore— y quien
 * escribe no tiene que acordarse de ninguna equivalencia.
 *
 * `-` y `*` siguen valiendo como punto: es lo que trae cualquier texto pegado
 * desde otro editor, y es lo que ya está guardado en los productos cargados. */
interface ListKind {
  id: string;
  re: RegExp;
  /** Viñeta dibujada a mano, o `null` si la numera el navegador. */
  marker?: string;
  markerClass?: string;
  /** `list-style-type` del `<ol>`. */
  ordered?: "decimal" | "lower-alpha" | "upper-alpha";
}

const LIST_KINDS: ListKind[] = [
  { id: "dot", re: /^[-*•]\s+/, marker: "•", markerClass: "text-terracotta" },
  { id: "dash", re: /^[–—]\s+/, marker: "–", markerClass: "text-terracotta" },
  { id: "square", re: /^[▪▫◼]\s+/, marker: "▪", markerClass: "text-sage" },
  { id: "check", re: /^[✓✔]\s+/, marker: "✓", markerClass: "text-sage" },
  { id: "number", re: /^\d+[.)]\s+/, ordered: "decimal" },
  { id: "letter", re: /^[a-záéíóúñ][.)]\s+/i, ordered: "lower-alpha" },
];

function listKind(line: string): ListKind | null {
  return LIST_KINDS.find((kind) => kind.re.test(line)) ?? null;
}

const HEADING_RE = /^\s{0,3}(#{1,3})\s+(.*)$/;
const RULE_RE = /^---+$/;

/** ¿La línea abre un bloque distinto del párrafo en curso? Se consulta al cortar
 * un párrafo: una lista puede venir pegada al texto anterior sin línea en blanco
 * en medio, que es justo como la deja la barra del editor. */
function startsBlock(line: string): boolean {
  const trimmed = line.trimStart();
  return (
    line.trim().length === 0 ||
    HEADING_RE.test(line) ||
    RULE_RE.test(line.trim()) ||
    trimmed.startsWith(">") ||
    listKind(trimmed) !== null
  );
}

function renderBlocks(text: string): ReactNode[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let cursor = 0;

  while (cursor < lines.length) {
    const line = lines[cursor];
    const trimmed = line.trimStart();
    const key = `b${cursor}`;

    if (line.trim().length === 0) {
      cursor += 1;
      continue;
    }

    if (RULE_RE.test(line.trim())) {
      blocks.push(<hr key={key} className="my-1 border-0 border-t border-line" />);
      cursor += 1;
      continue;
    }

    const heading = HEADING_RE.exec(line);
    if (heading) {
      const level = heading[1].length;
      const content = inline(heading[2], key);
      blocks.push(
        level === 1 ? (
          <h2
            key={key}
            className="mt-2 font-display text-[30px] leading-tight text-forest md:text-[34px]"
          >
            {content}
          </h2>
        ) : level === 2 ? (
          <h3
            key={key}
            className="mt-2 font-display text-[24px] leading-tight text-forest md:text-[27px]"
          >
            {content}
          </h3>
        ) : (
          <h4
            key={key}
            className="mt-2 font-display text-[21px] leading-tight text-forest md:text-[22px]"
          >
            {content}
          </h4>
        ),
      );
      cursor += 1;
      continue;
    }

    if (trimmed.startsWith(">")) {
      const quoted: string[] = [];
      while (cursor < lines.length && lines[cursor].trimStart().startsWith(">")) {
        quoted.push(lines[cursor].trimStart().replace(/^>\s?/, ""));
        cursor += 1;
      }
      blocks.push(
        <blockquote
          key={key}
          className="border-l-2 border-terracotta/60 pl-5 font-display text-[21px] italic leading-[1.5] text-forest md:text-[23px]"
        >
          {withBreaks(quoted, key)}
        </blockquote>,
      );
      continue;
    }

    const kind = listKind(trimmed);
    if (kind) {
      // La lista corta donde cambia el tipo de viñeta: dos tipos seguidos son
      // dos listas, no una con las marcas mezcladas.
      const items: string[] = [];
      while (cursor < lines.length && listKind(lines[cursor].trimStart())?.id === kind.id) {
        items.push(lines[cursor].trimStart().replace(kind.re, ""));
        cursor += 1;
      }

      if (kind.ordered) {
        // Con letras se respeta la caja de la primera: quien escribió `A.`
        // espera ver `A.`, no `a.`.
        const upper = kind.ordered === "lower-alpha" && /^[A-ZÁÉÍÓÚÑ]/.test(trimmed);
        const style = upper ? "upper-alpha" : kind.ordered;
        // Y el número de arranque es el que se escribió: una lista que sigue a
        // un párrafo suele empezar en 3, no en 1.
        const first = kind.ordered === "decimal" ? Number.parseInt(trimmed, 10) : NaN;

        blocks.push(
          <ol
            key={key}
            start={Number.isFinite(first) && first > 0 ? first : undefined}
            className="flex flex-col gap-2 pl-5"
            style={{ listStyleType: style }}
          >
            {items.map((item, index) => (
              <li key={`${key}-${index}`} className="pl-1.5 leading-[1.7] marker:text-terracotta">
                {inline(item, `${key}-${index}`)}
              </li>
            ))}
          </ol>,
        );
        continue;
      }

      // Las viñetas se dibujan a mano en vez de dejárselas al `::marker`: así
      // cada tipo tiene su glifo y su color, y el texto que da la vuelta queda
      // alineado con el primer renglón en lugar de meterse bajo la viñeta.
      blocks.push(
        <ul key={key} className="flex flex-col gap-2">
          {items.map((item, index) => (
            <li key={`${key}-${index}`} className="flex gap-2.5 leading-[1.7]">
              <span aria-hidden className={cn("select-none", kind.markerClass)}>
                {kind.marker}
              </span>
              <span className="min-w-0 flex-1">{inline(item, `${key}-${index}`)}</span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    const paragraph: string[] = [];
    while (cursor < lines.length && !startsBlock(lines[cursor])) {
      paragraph.push(lines[cursor]);
      cursor += 1;
    }

    blocks.push(
      <p key={key} className="leading-[1.75]">
        {withBreaks(paragraph, key)}
      </p>,
    );
  }

  return blocks;
}

export interface MarkdownProps {
  text: string;
  className?: string;
}

/** El texto del CMS, ya formateado. Devuelve `null` cuando no hay nada que
 * mostrar, para que quien lo llama no dibuje un bloque vacío. */
export function Markdown({ text, className }: MarkdownProps) {
  if (!text.trim()) return null;
  return <div className={cn("flex flex-col gap-4", className)}>{renderBlocks(text)}</div>;
}

/** El mismo texto sin marcas, para donde no se puede formatear: la descripción
 * de los metadatos, la bajada de las cards, la etiqueta QR impresa. */
export function markdownToPlain(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/^\s{0,3}[-*•–—▪▫◼✓✔]\s+/gm, "")
    .replace(/^\s{0,3}(?:\d+|[a-záéíóúñ])[.)]\s+/gim, "")
    .replace(/^\s*---+\s*$/gm, "")
    .replace(/\[([^\]]+?)\]\([^)\s]+?\)/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/~~(.+?)~~/g, "$1")
    .replace(/\+\+(.+?)\+\+/g, "$1")
    .replace(/`([^`]+?)`/g, "$1")
    .replace(/\*(?!\s)(.+?)(?<!\s)\*/g, "$1")
    .replace(new RegExp(UNDERSCORE_ITALIC_SOURCE, "gu"), "$1")
    .replace(/\s*\n\s*/g, " ")
    .trim();
}

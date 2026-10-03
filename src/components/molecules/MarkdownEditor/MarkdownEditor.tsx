"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Markdown } from "@/lib/cms/markdown";
import { cn } from "@/lib/utils";

/** Emojis a mano, los que se usan al describir una planta. Un selector completo
 * sería otro componente entero y acá alcanza con una grilla corta: el teclado
 * del sistema sigue estando para cualquier otro. */
const EMOJIS = [
  "🌿", "🌱", "🪴", "🌵", "🌴", "🍃", "🌳", "🌾",
  "🌸", "🌺", "🌻", "🌼", "🌹", "💐", "🍂", "🍄",
  "☀️", "⛅", "🌙", "💧", "💦", "🌡️", "❄️", "🔥",
  "✅", "⚠️", "❌", "💚", "✨", "📏", "🐾", "🏡",
];

type Tool =
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "heading"
  | "subheading"
  | "quote"
  | "rule"
  | "link"
  | ListTool;

type ListTool = "dot" | "dash" | "square" | "check" | "numbers" | "letters";

/** Los tipos de lista de la barra. La marca que se inserta es la viñeta que se
 * va a ver en la ficha —`• – ▪ ✓`—, así el texto guardado ya se lee como una
 * lista; el renderizador las reconoce todas (`src/lib/cms/markdown.tsx`). */
const LIST_TOOLS: Record<ListTool, { label: string; glyph: string; marker: (index: number) => string }> = {
  dot: { label: "Lista con puntos", glyph: "•", marker: () => "• " },
  dash: { label: "Lista con guiones", glyph: "–", marker: () => "– " },
  square: { label: "Lista con cuadrados", glyph: "▪", marker: () => "▪ " },
  check: { label: "Lista con tildes", glyph: "✓", marker: () => "✓ " },
  numbers: { label: "Lista numerada", glyph: "1.", marker: (index) => `${index + 1}. ` },
  letters: {
    label: "Lista con letras",
    glyph: "a.",
    marker: (index) => `${String.fromCharCode(97 + (index % 26))}. `,
  },
};

const LIST_ORDER: ListTool[] = ["dot", "dash", "square", "check", "numbers", "letters"];

function isListTool(tool: Tool): tool is ListTool {
  return tool in LIST_TOOLS;
}

/** Cualquier marca de línea ya puesta: se saca antes de poner la nueva, para que
 * cambiar de viñeta no deje la anterior adelante. */
const LINE_MARKER_RE = /^\s*(?:#{1,6}\s+|[-*•–—▪▫◼✓✔]\s+|(?:\d+|[a-záéíóúñ])[.)]\s+|>\s?)/i;

/** Lo que envuelve cada marca de texto. El subrayado usa `++` porque `__` en
 * markdown es otro alias de la negrita; ver `src/lib/cms/markdown.tsx`. */
const WRAPPERS: Partial<Record<Tool, string>> = {
  bold: "**",
  italic: "_",
  underline: "++",
  strike: "~~",
};

const PLACEHOLDERS: Partial<Record<Tool, string>> = {
  bold: "texto en negrita",
  italic: "texto en cursiva",
  underline: "texto subrayado",
  strike: "texto tachado",
  heading: "Título",
  subheading: "Subtítulo",
  quote: "Una línea que quieras destacar",
};

export interface MarkdownEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
}

/** Editor de texto con formato para el CMS.
 *
 * Escribe markdown —lo que se guarda es texto plano, legible aun sin el editor—
 * y lo muestra como va a verse en el sitio con el botón de vista previa, que usa
 * el mismo componente que la ficha pública: no hay dos maneras de interpretar lo
 * que se escribió.
 *
 * Las marcas se insertan con `insertText` cuando el navegador lo soporta, para
 * no romper el deshacer del textarea: reemplazar el valor a mano vacía la pila
 * de Ctrl+Z y se pierde todo el párrafo de un saque. */
export function MarkdownEditor({
  label,
  value,
  onChange,
  rows = 10,
  placeholder,
  className,
}: MarkdownEditorProps) {
  const fieldId = useId();
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);

  // El panel de emojis se cierra al tocar fuera o con Escape, como cualquier
  // menú: queda abierto encima del texto y estorba.
  useEffect(() => {
    if (!emojiOpen) return;

    function onPointerDown(event: PointerEvent) {
      if (!emojiRef.current?.contains(event.target as Node)) setEmojiOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setEmojiOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [emojiOpen]);

  /** Reemplaza un tramo del textarea y deja el cursor donde se pide. */
  function replace(start: number, end: number, text: string, caretStart: number, caretEnd = caretStart) {
    const field = fieldRef.current;
    if (!field) return;

    field.focus();
    field.setSelectionRange(start, end);

    let inserted = false;
    try {
      inserted = document.execCommand("insertText", false, text);
    } catch {
      inserted = false;
    }
    if (!inserted) onChange(field.value.slice(0, start) + text + field.value.slice(end));

    requestAnimationFrame(() => {
      field.focus();
      field.setSelectionRange(caretStart, caretEnd);
    });
  }

  function apply(tool: Tool) {
    const field = fieldRef.current;
    if (!field) return;

    const { selectionStart: start, selectionEnd: end } = field;
    const current = field.value;
    const selected = current.slice(start, end);
    const wrapper = WRAPPERS[tool];

    if (wrapper) {
      // Con la marca ya puesta, el botón la saca: es el mismo gesto de ida y
      // vuelta que en cualquier editor.
      const outer = current.slice(start - wrapper.length, end + wrapper.length);
      if (outer === wrapper + selected + wrapper && selected.length > 0) {
        replace(start - wrapper.length, end + wrapper.length, selected, start - wrapper.length, end - wrapper.length);
        return;
      }

      const text = selected || PLACEHOLDERS[tool] || "";
      replace(start, end, wrapper + text + wrapper, start + wrapper.length, start + wrapper.length + text.length);
      return;
    }

    if (tool === "link") {
      const text = selected || "texto del enlace";
      // El cursor queda al final de `https://`, que es lo único que falta
      // escribir: `[` + texto + `](https://` son los caracteres que lo preceden.
      const caret = start + text.length + 11;
      replace(start, end, `[${text}](https://)`, caret);
      return;
    }

    if (tool === "rule") {
      const atLineStart = start === 0 || current[start - 1] === "\n";
      const text = `${atLineStart ? "" : "\n"}\n---\n\n`;
      replace(start, end, text, start + text.length);
      return;
    }

    // Lo que queda son marcas de línea: se aplican sobre las líneas completas
    // que toca la selección, no sobre el tramo seleccionado.
    const lineStart = current.lastIndexOf("\n", start - 1) + 1;
    const lineEnd = current.indexOf("\n", end) === -1 ? current.length : current.indexOf("\n", end);
    const block = current.slice(lineStart, lineEnd) || PLACEHOLDERS[tool] || "";

    const lines = block.split("\n");

    // Si las líneas ya tienen esta misma marca, el botón la saca: volver a
    // tocarlo es cómo se deshace una lista.
    const listTool = isListTool(tool) ? LIST_TOOLS[tool] : null;
    if (listTool && lines.every((line, index) => line.startsWith(listTool.marker(index)))) {
      const cleared = lines.map((line, index) => line.slice(listTool.marker(index).length)).join("\n");
      replace(lineStart, lineEnd, cleared, lineStart + cleared.length);
      return;
    }

    const prefixed = lines
      .map((line, index) => {
        const clean = line.replace(LINE_MARKER_RE, "");
        if (listTool) return listTool.marker(index) + clean;
        if (tool === "heading") return `## ${clean}`;
        if (tool === "subheading") return `### ${clean}`;
        return `> ${clean}`;
      })
      .join("\n");

    replace(lineStart, lineEnd, prefixed, lineStart + prefixed.length);
  }

  function insertEmoji(emoji: string) {
    const field = fieldRef.current;
    if (!field) return;
    const { selectionStart: start, selectionEnd: end } = field;
    replace(start, end, emoji, start + emoji.length);
    setEmojiOpen(false);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!(event.ctrlKey || event.metaKey)) return;
    const key = event.key.toLowerCase();
    const tool: Tool | null =
      key === "b" ? "bold" : key === "i" ? "italic" : key === "u" ? "underline" : key === "k" ? "link" : null;
    if (!tool) return;
    event.preventDefault();
    apply(tool);
  }

  return (
    <div className={cn("flex flex-col gap-[7px]", className)}>
      {label ? (
        <label htmlFor={fieldId} className="text-[13px] text-ink">
          {label}
        </label>
      ) : null}

      <div className="overflow-hidden rounded-md border border-line bg-paper-light focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-sage">
        <div className="flex flex-wrap items-center gap-0.5 border-b border-[#EDE6D6] bg-[#F7F2E6] px-[9px] py-[7px]">
          <ToolButton label="Negrita (Ctrl+B)" onClick={() => apply("bold")} disabled={preview}>
            <span className="font-semibold">B</span>
          </ToolButton>
          <ToolButton label="Cursiva (Ctrl+I)" onClick={() => apply("italic")} disabled={preview}>
            <span className="italic font-display">I</span>
          </ToolButton>
          <ToolButton label="Subrayado (Ctrl+U)" onClick={() => apply("underline")} disabled={preview}>
            <span className="underline underline-offset-2">U</span>
          </ToolButton>
          <ToolButton label="Tachado" onClick={() => apply("strike")} disabled={preview}>
            <span className="line-through">S</span>
          </ToolButton>

          <Divider />

          <ToolButton label="Título" onClick={() => apply("heading")} disabled={preview}>
            Título
          </ToolButton>
          <ToolButton label="Subtítulo" onClick={() => apply("subheading")} disabled={preview}>
            Subtítulo
          </ToolButton>

          <Divider />

          {LIST_ORDER.map((tool) => (
            <ToolButton
              key={tool}
              label={LIST_TOOLS[tool].label}
              onClick={() => apply(tool)}
              disabled={preview}
            >
              {LIST_TOOLS[tool].glyph}
            </ToolButton>
          ))}

          <Divider />

          <ToolButton label="Cita" onClick={() => apply("quote")} disabled={preview}>
            ❝
          </ToolButton>
          <ToolButton label="Separador" onClick={() => apply("rule")} disabled={preview}>
            —
          </ToolButton>

          <Divider />

          <ToolButton label="Enlace (Ctrl+K)" onClick={() => apply("link")} disabled={preview}>
            🔗
          </ToolButton>

          <div ref={emojiRef} className="relative">
            <ToolButton
              label="Emoji"
              onClick={() => setEmojiOpen((open) => !open)}
              disabled={preview}
              active={emojiOpen}
            >
              😊
            </ToolButton>
            {emojiOpen ? (
              <div className="absolute left-0 top-[calc(100%+6px)] z-20 grid w-[268px] grid-cols-8 gap-0.5 rounded-lg border border-line bg-paper-light p-2 shadow-[0_12px_28px_rgba(23,48,31,0.14)]">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    aria-label={`Insertar ${emoji}`}
                    onClick={() => insertEmoji(emoji)}
                    className="rounded p-1 text-lg leading-none transition-colors hover:bg-[#EFE9DA]"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => {
              setEmojiOpen(false);
              setPreview((on) => !on);
            }}
            className={cn(
              "ml-auto rounded px-[11px] py-1 text-[13px] transition-colors",
              preview ? "bg-sage text-paper-light" : "text-ink hover:bg-[#EFE9DA]",
            )}
          >
            {preview ? "Seguir escribiendo" : "Vista previa"}
          </button>
        </div>

        {preview ? (
          <div className="min-h-[180px] bg-paper-light p-[18px]">
            {value.trim() ? (
              <Markdown text={value} className="text-[15px] text-ink" />
            ) : (
              <p className="text-[15px] text-taupe">Todavía no hay texto para mostrar.</p>
            )}
          </div>
        ) : (
          <textarea
            id={fieldId}
            ref={fieldRef}
            rows={rows}
            value={value}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={onKeyDown}
            className="w-full resize-y border-0 bg-transparent p-[13px] text-[15px] leading-[1.7] text-forest outline-none placeholder:text-taupe"
          />
        )}
      </div>

      <p className="text-[12px] leading-[1.5] text-stone">
        Se guarda tal cual se escribe: <b>**negrita**</b>, <i>_cursiva_</i>, ++subrayado++,
        ~~tachado~~, <code>##</code> para títulos y <code>&gt;</code> para una cita. Las listas
        empiezan con la viñeta que querés ver —<code>•</code> <code>–</code> <code>▪</code>{" "}
        <code>✓</code> <code>1.</code> <code>a.</code>— una por línea. La ficha pública lo muestra
        así.
      </p>
    </div>
  );
}

function Divider() {
  return <span aria-hidden className="mx-1 h-4 w-px bg-[#E2DAC6]" />;
}

function ToolButton({
  label,
  onClick,
  disabled,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "min-w-[30px] rounded px-[9px] py-1 text-[13px] text-ink transition-colors hover:bg-[#EFE9DA] disabled:cursor-not-allowed disabled:opacity-40",
        active && "bg-[#EFE9DA]",
      )}
    >
      {children}
    </button>
  );
}

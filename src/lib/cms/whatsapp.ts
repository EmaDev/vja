/** Arma el link de WhatsApp a partir de lo que cargó el cliente en el CMS.
 *
 * `wa.me` sólo acepta el número en formato internacional y sin separadores, así
 * que se limpia todo lo que no sea dígito: el `+`, los espacios y los guiones con
 * los que se escribe un teléfono en el panel. Devuelve `null` si lo que quedó no
 * puede ser un número, para que quien llama decida no mostrar nada en vez de
 * dejar un botón que lleva a un error de WhatsApp. */
export function whatsappHref(phone: string, message?: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 8) return null;

  const text = message?.trim();
  return text ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : `https://wa.me/${digits}`;
}

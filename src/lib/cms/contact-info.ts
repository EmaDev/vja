import type { BusinessHours, ContactSection } from "./types";

/** Horarios con algo cargado. Un renglón vacío —recién agregado en el panel y
 * todavía sin escribir— no tiene que dibujar una línea en blanco en la landing. */
export function filledHours(contact?: ContactSection): BusinessHours[] {
  return (contact?.hours ?? []).filter((row) => row.days.trim() || row.time.trim());
}

/** Los mismos horarios en una línea por tramo, para los lugares angostos que no
 * pueden dibujar la tabla de dos columnas (el header lateral, por ejemplo). */
export function hoursLines(contact?: ContactSection): string[] {
  return filledHours(contact).map((row) =>
    [row.days.trim(), row.time.trim()].filter(Boolean).join(" · "),
  );
}

/** Arma el `src` del iframe de Google Maps a partir de una dirección escrita a
 * mano, que es lo que el cliente tiene a mano. El `output=embed` es lo que hace
 * que Maps devuelva el mapa suelto y no la página entera. */
export function mapsEmbedUrl(address: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}

export function mapsDirectionsUrl(address: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

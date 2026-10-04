/** Dominio público del sitio, leído una sola vez.
 *
 * Vivía en `qr-labels.ts`, que fue el primero en necesitarlo. Ahora también lo
 * usan el canónico, el sitemap, el robots y los datos estructurados, así que
 * vive acá y `qr-labels` lo reexporta para no mover los imports del panel.
 *
 * Sin `server-only`: el editor de productos lo lee en el cliente para avisar
 * que falta configurar la variable. Por eso todo lo de este archivo sale de
 * `NEXT_PUBLIC_SITE_URL`, la única que viaja al navegador. */

/** Hosts que sólo existen en la máquina de quien desarrolla. Se los sirve por
 * `http`: en local no hay certificado, y asumir `https` daría un QR que no
 * abre. */
const LOCAL_HOST = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?$/i;

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";

/** Deja el valor del `.env` en forma de URL absoluta, o devuelve `""` si no hay
 * manera de leerlo como tal.
 *
 * Tolera dos descuidos habituales al escribirlo, porque ninguno de los dos
 * cambia a qué host apunta: la barra final y el esquema ausente
 * (`vjaplantas.com.ar`, `localhost:3000`). Lo segundo importa más de lo que
 * parece: sin `://`, `new URL` lee `localhost:3000` como el protocolo
 * `localhost:` con la ruta `3000`, así que el QR quedaba en nada y la pantalla
 * culpaba a la variable por faltar cuando en realidad estaba escrita. */
export function normalizeSiteUrl(raw: string): string {
  const value = raw.trim().replace(/\/+$/, "");
  if (value === "") return "";

  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(value);
  const host = value.split("/")[0];
  const candidate = hasScheme
    ? value
    : `${LOCAL_HOST.test(host) ? "http" : "https"}://${value}`;

  try {
    // Un esquema raro puede parsear sin host al que apuntar (`file:///x`).
    if (new URL(candidate).host === "") return "";
    return candidate;
  } catch {
    return "";
  }
}

/** Dominio público del sitio, o `""` si la variable falta o no se puede leer.
 *
 * No tiene valor por defecto a propósito: los QR se imprimen en papel y es
 * preferible que la pantalla se bloquee y pida el dominio a que genere códigos
 * que escanean a la nada. Lo que sí tiene fallback es `SITE_ORIGIN`
 * (`src/lib/seo/site.ts`), porque un canónico ausente rompe el build. */
export const SITE_URL = normalizeSiteUrl(RAW_SITE_URL);

export const siteUrlConfigured = SITE_URL !== "";

/** La variable tiene algo escrito pero no se pudo leer como URL. Se distingue
 * de "falta configurarla" para que el mensaje en pantalla mande a corregir el
 * valor en vez de a agregar uno que ya está. */
export const siteUrlInvalid = RAW_SITE_URL.trim() !== "" && !siteUrlConfigured;

# Plan de desarrollo — VJA Plantas

Plan de ejecución de los 6 días presupuestados en `PRESUPUESTO-VJA-PLANTAS.md`.
Documento interno de trabajo, no es el que ve el cliente.

---

## 1. Estado actual del repositorio

Revisado sobre el código existente al 20/09/2026.

### Ya está hecho

| Área | Detalle |
|---|---|
| Shell del CMS | `CmsSidebar`, `CmsTopbar`, `CmsWorkspace` con navegación entre secciones y animación de transición |
| Editores | `HeaderEditor`, `HeroEditor`, `FooterEditor`, `CustomSectionEditor` + `ListEditor` genérico |
| Modelo de dominio | `CmsSection` como unión discriminada por `kind` (`header`/`hero`/`footer`/`custom`) |
| Variantes de hero | 5 diseños registrados en `hero-variants.ts`, cada uno con su `getProps()` |
| Plantillas | Catálogo de 4 bloques en `section-templates.ts` |
| Plumbing de sesión | `createSessionCookie()`, `verifySessionCookie(cookie, true)`, `POST`/`DELETE /api/auth/session`, `proxy.ts`, layout protegido |
| Componentes de landing | 5 heros, headers, cards de producto, átomos varios |

### Falta

| Área | Estado | Día |
|---|---|:---:|
| Firestore | **Sin uso.** Cero imports en todo `src/` | 2 |
| Cloud Storage | **Sin uso.** Solo la variable de entorno del bucket | 3 |
| Login real | `LoginForm` llama a `mockLogin`, que setea una cookie falsa | 1 |
| Persistencia del CMS | `CmsWorkspace` es `useState` sobre `mock-data.ts`; al recargar se pierde todo | 2 |
| Borrador / publicado | No existe | 2 |
| Landing pública | `page.tsx` es `<main className="min-h-screen bg-white" />` — literalmente vacía | 4 |
| Carga de imágenes | El `HeroEditor` pide pegar una URL a mano | 3 |
| `next.config.ts` | Vacío, sin `remotePatterns` | 3 |
| SEO | `lang="en"`, metadata mínima, sin sitemap, robots, OG ni JSON-LD | 5 |
| Reglas de seguridad | No escritas | 1 |

---

## 2. Cuatro cosas del código actual que hay que resolver

**1. El fallback de la cookie mock es un bypass de autenticación.**
`session-guard.ts` devuelve `true` con solo presentar la cookie `__mock_session`, que `mockLogin` setea sin validar nada contra Firebase. Cualquiera que setee esa cookie en el navegador entra al CMS. Tiene que desaparecer del código el día 1, no quedar como "después lo saco".

**2. El proxy verifica la sesión contra Google en cada request.**
`proxy.ts` llama a `isCmsAuthenticated()` → `verifySessionCookie(cookie, true)`. El flag `checkRevoked: true` obliga a un round-trip de red a Google **en cada navegación del CMS**. Los docs de Next 16 (`01-getting-started/16-proxy.md`) son explícitos: el proxy no es para gestión de sesión completa, solo para chequeos optimistas.

> Corrección sobre un supuesto previo: en Next 16 el proxy corre en **Node.js**, no en Edge, así que `firebase-admin` sí funciona ahí. El problema es de latencia, no de compatibilidad.

Solución: el proxy chequea solo *presencia* de cookie (barato); la verificación real con `verifySessionCookie` queda en el layout de `(protected)`, que ya la hace. Defensa en dos capas sin pagar la red dos veces.

**3. Todo el trabajo está sin versionar.**
Un solo commit (`Initial commit from Create Next App`) y todo lo demás sin trackear. Seis días de trabajo sin historial es un riesgo que no vale la pena correr. Commit inicial antes de tocar nada.

**4. `layout.tsx` carga cuatro familias tipográficas y declara `lang="en"`.**
Geist, Geist Mono, DM Sans e Instrument Serif. El idioma equivocado afecta SEO y accesibilidad. Se limpia el día 5, pero conviene dejar solo las que realmente usa el diseño.

---

## 3. Modelo de datos (decisión previa al día 2)

**Firestore**

```
sites/vja-plantas
  draft:     { sections: CmsSection[], seo: SeoData, updatedAt, updatedBy }
  published: { sections: CmsSection[], seo: SeoData, publishedAt, publishedBy }

sites/vja-plantas/versions/{versionId}
  { sections, seo, publishedAt, publishedBy }   ← últimas 10 publicaciones

media/{mediaId}
  { storagePath, url, width, height, alt, bytes, createdAt, createdBy }
```

Un solo documento con dos campos, en vez de dos documentos: la landing se lee con **una sola lectura** de Firestore, y publicar es copiar un campo sobre el otro en una transacción. El array de secciones son unos pocos KB de texto, muy lejos del límite de 1 MB por documento.

**Storage**

```
media/{yyyy}/{mm}/{uuid}.webp
```

---

## 4. Antes de escribir código

- [ ] Crear el proyecto en Firebase y activar **plan Blaze** (Storage lo exige en proyectos nuevos).
- [ ] Habilitar **Auth** (email/contraseña), **Firestore** y **Storage**, región `southamerica-east1`.
- [ ] Crear el usuario del equipo de VJA Plantas desde la consola.
- [ ] Generar Service Account y completar `.env.local` a partir de `.env.example`.
- [ ] Verificar que `.env.local` está en `.gitignore`.
- [ ] Alerta de presupuesto en **US$ 8** (el techo de la propuesta).
- [ ] `git add` de todo lo actual + commit inicial. Rama `develop`, merge a `master` en cada entrega.
- [ ] Proyecto en Vercel conectado al repo, con las variables de entorno cargadas.

---

## 5. Plan día por día

### Día 1 — Autenticación real y cierre del bypass

**Objetivo:** que entrar al CMS requiera un usuario real de Firebase.

- Reemplazar `mockLogin` por sign-in real: `signInWithEmailAndPassword` en el cliente → `POST /api/auth/session` con el `idToken` → cookie de sesión. El endpoint ya está escrito.
- Borrar `MOCK_SESSION_COOKIE_NAME` de `constants.ts`, su fallback en `session-guard.ts` y `mockLogin` de `actions.ts`.
- Aligerar `proxy.ts` a chequeo de presencia de cookie.
- `logout()`: `DELETE /api/auth/session` + `revokeRefreshTokens()`.
- Custom claims de rol (`admin` / `editor`) y lectura en el guard.
- Escribir las reglas de seguridad de Firestore y Storage: lectura pública solo de `published`, escritura solo autenticado.
- Manejo de errores del login en español (credencial inválida, usuario inexistente, demasiados intentos).

**Listo cuando:** se entra con el usuario real; borrando la cookie, `/cms` redirige a login; `grep -r "mock" src/` no devuelve nada de auth.

---

### Día 2 — Motor de secciones sobre Firestore

**Objetivo:** que lo que se edita en el panel sobreviva a una recarga.

- `src/lib/cms/repository.ts`: `getDraft()`, `getPublished()`, `saveDraft()`, `publish()`.
- `src/lib/cms/actions.ts`: Server Actions que validan el esquema **en el servidor** antes de escribir. Ninguna sección malformada llega a Firestore.
- `CmsWorkspace` deja de importar `mock-data.ts` y recibe las secciones por props desde el server component. `mock-data.ts` queda solo como seed inicial.
- Reordenar secciones (subir/bajar) y persistir el orden.
- Estados explícitos de guardado: pendiente / guardando / guardado / error.
- Botón **Publicar** en `CmsTopbar` con confirmación, escribiendo `draft → published` + entrada en `versions/`.

**Listo cuando:** se edita un texto, se recarga y sigue ahí; publicar copia el borrador; el contenido publicado no cambia hasta apretar Publicar.

---

### Día 3 — Carga de imágenes

**Objetivo:** subir una foto desde el celular y verla en la página.

- `next.config.ts`: `remotePatterns` apuntando al bucket.
- `POST /api/media/upload-url`: devuelve URL firmada de subida. La Service Account nunca sale del servidor.
- Componente `ImageUploader` (molécula):
  - Compresión en cliente vía `canvas`: máx. 2000px del lado mayor, salida WebP.
  - Validación de MIME y peso.
  - Barra de progreso y preview.
  - Campo `alt` **obligatorio**.
- Subida directa del navegador al bucket; al terminar se persiste el documento en `media/`.
- Reemplazar el input "URL de imagen" del `HeroEditor` por el uploader.
- Borrado: elimina el objeto de Storage y el documento de `media/`.

**Listo cuando:** una foto de 4 MB sacada con el celular termina pesando ~300 KB en el bucket y se ve en el hero; borrarla la saca de los dos lados.

---

### Día 4 — Landing dinámica + entrega de la DEMO

**Objetivo:** el link para mandarle al cliente.

- `src/lib/cms/renderers.ts`: registro `kind → componente`, gemelo del registro de editores.
- `page.tsx` lee `published`, mapea el array respetando `order` y `visible`, y omite secciones con datos incompletos en vez de romper.
- Conectar las 5 variantes de hero a través de su `getProps()`.
- Pasada de responsive en todos los breakpoints.
- Seed de contenido de ejemplo y deploy a Vercel.

**Listo cuando:** el link público abre, se navega en celular y escritorio, y un cambio publicado desde el CMS se ve reflejado. **Se envía al cliente.**

---

### Día 5 — SEO y rendimiento

**Objetivo:** Lighthouse ≥ 90 en las cuatro categorías.

- `layout.tsx`: `lang="es-AR"` y limpieza de las fuentes que no se usan.
- `generateMetadata()` alimentada desde los campos SEO del documento publicado.
- `opengraph-image.tsx` con `next/og` para las previews de WhatsApp e Instagram.
- `sitemap.ts` y `robots.ts`.
- JSON-LD `LocalBusiness` con dirección, horarios, teléfono y redes.
- `revalidateTag()` al publicar, para que la landing se regenere sin redeploy.
- Semántica: un solo `<h1>`, `<nav>`, `<section aria-label>`, `<footer>`.
- Imagen del hero con `priority`; dimensiones explícitas en toda imagen (CLS).

**Listo cuando:** Lighthouse ≥ 90 en Performance, SEO, Accesibilidad y Buenas Prácticas, y el link pegado en WhatsApp muestra la preview correcta.

---

### Día 6 — Ajustes, cierre y entrega

**Objetivo:** producción y traspaso.

- Aplicar la devolución de la demo (ver el alcance acordado en la sección 6 del presupuesto).
- Historial: pantalla para ver las últimas publicaciones y revertir.
- QA cruzado: Chrome, Safari iOS, Firefox.
- Transferencia del proyecto Firebase a la cuenta de Google del cliente.
- Manual del CMS con capturas.
- Deploy a producción con el dominio y HTTPS.
- Sesión de capacitación (~1 h).

**Listo cuando:** el cliente entra al panel con sus claves, publica un cambio y lo ve en su dominio.

---

## 6. Orden de dependencias

```
Día 1 (auth)  →  Día 2 (Firestore)  →  Día 3 (imágenes)
                        ↓
                  Día 4 (landing + DEMO)  →  Día 5 (SEO)
                        ↓
                  devolución del cliente  →  Día 6 (ajustes + entrega)
```

El día 2 es el cuello de botella: sin persistencia no hay nada que renderizar el día 4 ni que mostrar en la demo. Si un día se atrasa, el que se recorta es el 5 (el SEO se puede completar después de la demo sin bloquear la validación del cliente), nunca el 2.

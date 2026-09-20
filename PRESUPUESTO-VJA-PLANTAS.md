# VJA Plantas — Propuesta, alcance y presupuesto

**Cliente:** VJA Plantas
**Proyecto:** Landing institucional + CMS propio de gestión de contenido
**Duración estimada:** 6 días hábiles de trabajo
**Inversión total:** **$200.000 (pesos)**
**Fecha de propuesta:** 13/09/2026
**Validez de la propuesta:** 15 días corridos

---

## 1. Resumen para el cliente (sin tecnicismos)

Voy a construir **dos cosas que funcionan juntas**:

### 🌿 Módulo A — El panel de administración (CMS)

Es un sitio privado, con usuario y contraseña, donde ustedes entran y **cambian el contenido de la página sin depender de nadie**.

Desde ahí van a poder:

- Cambiar los textos de cualquier parte de la página (títulos, descripciones, botones).
- **Subir fotos de los artículos** desde la computadora o el celular. Las fotos se guardan en un servicio de alojamiento profesional (Firebase, de Google) y se muestran automáticamente en la página.
- Elegir **cómo se ve** cada sección. Por ejemplo, la portada principal tiene 5 diseños distintos ya armados: eligen uno de una lista y la página cambia sola.
- **Prender y apagar secciones**. Si una promoción terminó, la ocultan con un clic. Cuando vuelve la temporada, la vuelven a mostrar.
- **Agregar secciones nuevas** eligiendo de un catálogo de bloques (texto, galería de fotos, testimonios de clientes, datos de contacto).
- Editar el menú de navegación y el pie de página (redes sociales, contacto).

La idea de fondo: **la página no está "escrita a mano"**. Está armada con piezas intercambiables, como bloques de Lego. Eso significa que mañana pueden reordenar, sacar o agregar secciones sin llamarme.

### 🌱 Módulo B — La página pública (landing)

Es la página que ven sus clientes. Se construye sola con lo que ustedes cargaron en el panel.

- **Optimizada para Google (SEO)**: títulos, descripciones, imagen de vista previa cuando comparten el link por WhatsApp o Instagram, mapa del sitio para que Google encuentre todo, y datos estructurados para que el negocio aparezca mejor en los resultados de búsqueda.
- **Rápida**: la página se genera en el servidor, no en el celular del visitante. Carga en menos de 2 segundos incluso con datos móviles.
- **Adaptada a todas las pantallas**: celular, tablet, notebook y monitores grandes. Se diseña pensando primero en el celular, que es de donde va a venir la mayoría del tráfico.
- **Accesible**: contraste de colores correcto, textos alternativos en las imágenes, navegación con teclado.

### 📦 Cómo entregamos: primero una demo

**No entrego todo al final y listo.** Trabajo en dos etapas:

1. **Versión demo (día 4)**: les mando un link con el sistema funcionando y contenido de ejemplo. Ustedes lo prueban, navegan, cargan una foto, cambian un texto, lo muestran a quien quieran. Me mandan su devolución.
2. **Versión final (día 6)**: aplico los ajustes que surgieron de esa devolución y entrego el producto terminado.

Esto sirve para **validar el producto antes de que esté cerrado**. Es mucho más barato cambiar algo en el día 4 que descubrir en el día 6 que la portada no era la que querían.

---

## 2. Alcance técnico detallado

### 2.1 Stack y base ya establecida

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.3.5 (App Router, React Server Components) |
| UI | React 19.2, Tailwind CSS v4, Framer Motion 13 |
| Lenguaje | TypeScript 5 (modo estricto) |
| Backend / datos | Firebase — Auth, Firestore, Cloud Storage |
| SDK servidor | `firebase-admin` 14 (Service Account, credenciales solo en servidor) |
| Arquitectura de componentes | Atomic Design (`atoms` → `molecules` → `organisms` → `templates`) |
| Deploy | Vercel (preview automático por rama + producción) |

La base del repositorio ya cuenta con el modelo de dominio del CMS tipado (`src/lib/cms/types.ts`), el registro de variantes de hero (`src/lib/cms/hero-variants.ts`), el catálogo de plantillas de sección (`src/lib/cms/section-templates.ts`), la shell del panel (`CmsSidebar`, `CmsTopbar`, `CmsWorkspace`) y los editores por tipo de sección. El trabajo presupuestado parte de ahí.

---

### 2.2 Módulo A — CMS

#### A.1 Autenticación y control de acceso

- Migración del login mock actual (`mockLogin` con cookie `httpOnly` de 24 h) a **Firebase Auth real**: `signInWithEmailAndPassword` en cliente → `createSessionCookie()` en el endpoint `POST /api/auth/session` → cookie de sesión `httpOnly`, `secure`, `sameSite=lax`.
- Verificación server-side en `session-guard.ts` con `verifySessionCookie(cookie, true)` (chequeo de revocación), aplicada en el layout del grupo de rutas `(protected)`.
- Protección de borde en `src/proxy.ts` para redirigir a `/cms/login` antes de que se renderice nada.
- Logout con revocación de refresh tokens en Admin SDK.
- **Custom claims** para roles (`admin`, `editor`), leídos en el guard y usados para ocultar acciones destructivas.
- Reglas de seguridad de Firestore y Storage: lectura pública de contenido publicado, escritura únicamente para usuarios autenticados con claim válido.

#### A.2 Motor modular de secciones

El corazón del sistema. La landing es un **array ordenado de secciones tipadas** persistido en Firestore, no un archivo de código.

- Unión discriminada `CmsSection` por el campo `kind`: `header` | `hero` | `footer` | `custom`. Cada variante define sus propios campos y su propio editor.
- **Registro de editores**: mapa `kind → componente editor` (`HeaderEditor`, `HeroEditor`, `FooterEditor`, `CustomSectionEditor`). Agregar un tipo de sección nuevo = agregar una entrada al registro, sin tocar el workspace.
- **Registro de variantes visuales**: `heroVariants` expone 5 diseños (`editorial-split`, `cinematic`, `collage`, `announcement-arch`, `sidebar-product`), cada uno con su `Component` y una función `getProps()` que traduce los campos genéricos del CMS a las props específicas de ese diseño. El cliente elige el diseño desde un selector; el contenido se conserva.
- **Reordenamiento** de secciones (subir/bajar) y **toggle de visibilidad** por sección (`visible: boolean`).
- **Alta de secciones** desde el catálogo `sectionTemplates` (texto libre, galería, testimonios, contacto).
- Edición de colecciones anidadas (`navLinks`, `socialLinks`) mediante el componente genérico `ListEditor`.
- Validación de esquema en el borde servidor antes de persistir: ninguna sección malformada llega a Firestore.

#### A.3 Persistencia y publicación

- Documento de configuración del sitio en Firestore (`sites/{siteId}`) con el array de secciones y metadatos SEO.
- **Separación borrador / publicado**: el CMS escribe sobre el borrador; el botón "Publicar" promueve el borrador a publicado. La landing pública lee solo el publicado.
- **Vista previa** del borrador en una ruta protegida antes de publicar.
- Escrituras vía **Server Actions** con `revalidateTag()`: al publicar, la landing se regenera en el CDN en segundos, sin redeploy.
- Historial de las últimas N publicaciones para poder revertir.

#### A.4 Gestión de imágenes — Firebase Cloud Storage

Este es el punto que más impacta el costo operativo mensual, así que lo detallo aparte.

**Flujo de subida:**

1. El usuario elige una imagen en el editor de sección.
2. El cliente pide al servidor una **URL firmada de subida** (signed URL, vigencia corta). La credencial de Service Account nunca sale del servidor.
3. Subida directa del navegador a Cloud Storage — el archivo **no pasa por mi servidor**, lo que evita límites de payload y reduce costo de cómputo.
4. Al terminar, se persiste en Firestore la ruta del objeto + metadatos (ancho, alto, `alt`, peso).

**Optimización (crítica para el costo):**

- **Compresión en el cliente antes de subir**: redimensionado a un máximo de 2000 px en el lado mayor y conversión a WebP mediante `canvas`. Una foto de celular de 4 MB baja a ~250–400 KB **antes** de consumir ancho de banda.
- **Validación**: tipo MIME permitido (`image/jpeg`, `image/png`, `image/webp`), peso máximo, dimensiones mínimas.
- **Entrega optimizada** con `next/image`: la imagen se sirve en el formato moderno que soporte el navegador (AVIF/WebP), en el tamaño exacto del dispositivo, cacheada en el CDN de Vercel. **Cada imagen se descarga de Firebase una sola vez** y después la sirve el CDN — esto es lo que mantiene la factura de Firebase cerca de cero.
- **Campo `alt` obligatorio** en el editor: requisito de SEO y accesibilidad.
- Borrado del objeto en Storage al eliminar la imagen desde el CMS (evita archivos huérfanos acumulando costo).
- Configuración de `remotePatterns` en `next.config.ts` para el dominio del bucket.

#### A.5 Experiencia del panel

- Layout de tres zonas: sidebar de secciones, topbar con acciones globales (guardar, previsualizar, publicar, salir), workspace de edición.
- Estados de carga, guardado y error explícitos — el usuario siempre sabe si su cambio se guardó.
- Confirmación ante acciones destructivas (eliminar sección, eliminar imagen).
- Responsive: el panel es usable desde tablet.
- Textos de interfaz en español rioplatense, pensados para alguien sin formación técnica.

---

### 2.3 Módulo B — Landing pública

#### B.1 Renderizado dinámico

- La home (`src/app/page.tsx`) lee el documento publicado en Firestore y **mapea el array de secciones a componentes** mediante el registro de renderers, respetando orden y visibilidad.
- React Server Components: cero JavaScript de CMS enviado al navegador. Solo hidratan las piezas con interacción real (menú móvil, animaciones de Framer Motion).
- Renderizado estático con revalidación por tag (ISR): la página se sirve desde el CDN, pero se regenera al publicar.
- Fallbacks tipados: una sección con datos incompletos no rompe la página, se omite.

#### B.2 SEO técnico

- **Metadata API de Next.js**: `title`, `description`, canonical, `openGraph` y `twitter` — todos alimentados desde los campos que el cliente edita en el CMS.
- **Imagen Open Graph** generada dinámicamente con `next/og` (ImageResponse) para previsualizaciones en WhatsApp, Instagram, Facebook y X.
- **`sitemap.ts`** y **`robots.ts`** generados a partir del contenido publicado.
- **JSON-LD** con datos estructurados `LocalBusiness` / `Organization` (nombre, dirección, horarios, teléfono, redes) para rich results en Google.
- Jerarquía semántica correcta: un único `<h1>`, `<section>` con `aria-label`, `<nav>`, `<footer>`.
- `lang="es-AR"`, favicon y manifest.

#### B.3 Rendimiento y adaptabilidad

- Mobile-first en todos los breakpoints de Tailwind (`sm` → `2xl`).
- Fuentes autoalojadas vía `next/font` con `display: swap` — sin FOUT ni request a un tercero.
- Objetivo **Lighthouse ≥ 90** en Performance, SEO, Accesibilidad y Buenas Prácticas.
- Core Web Vitals: LCP < 2,5 s (imagen del hero con `priority`), CLS < 0,1 (dimensiones explícitas en toda imagen), INP < 200 ms.
- Verificación en navegadores reales: Chrome, Safari iOS y Firefox.

---

## 3. Cronograma — 6 días

| Día | Foco | Entregable verificable |
|---|---|---|
| **1** | Autenticación real con Firebase Auth, reglas de Firestore/Storage, modelado de datos, `proxy.ts`, variables de entorno y ambientes | Login funcional, rutas del CMS protegidas de verdad |
| **2** | Motor modular: registro de editores, alta/baja/reordenamiento/visibilidad de secciones, persistencia en Firestore | Se puede armar la estructura completa de la landing desde el panel |
| **3** | Pipeline de imágenes: URLs firmadas, compresión en cliente, subida directa, metadatos, borrado, `next/image` | Subida de fotos de artículos funcionando de punta a punta |
| **4** | Render dinámico de la landing, las 5 variantes de hero conectadas, responsive completo | 🚀 **Entrega de la versión DEMO** — link público para validar |
| **5** | SEO técnico completo, OG dinámico, sitemap, JSON-LD, performance, accesibilidad | Auditoría Lighthouse ≥ 90 en las 4 categorías |
| **6** | Ajustes surgidos de la devolución de la demo, borrador/publicado, QA cruzado, deploy a producción, documentación y capacitación | ✅ **Entrega FINAL** en producción |

> **Sobre la demo del día 4:** se entrega con contenido de ejemplo cargado. La devolución del cliente se recibe entre el día 4 y el inicio del día 6, y los ajustes de esa devolución están contemplados dentro del día 6 (ver alcance de ajustes en la sección 6).

---

## 4. Presupuesto

### 4.1 Desglose

| # | Ítem | Detalle | Monto |
|---|---|---|---:|
| **MÓDULO A — CMS** | | | **$120.000** |
| A.1 | Autenticación y seguridad | Firebase Auth, cookie de sesión, roles por claims, reglas de Firestore y Storage | $30.000 |
| A.2 | Motor modular de secciones | Secciones tipadas, registro de editores, variantes visuales, orden y visibilidad | $45.000 |
| A.3 | Gestión de imágenes | URLs firmadas, compresión en cliente, subida directa a Cloud Storage, metadatos, limpieza | $25.000 |
| A.4 | Panel de administración | Workspace, estados, publicación, borrador/publicado, UX en español | $20.000 |
| **MÓDULO B — LANDING** | | | **$65.000** |
| B.1 | Render dinámico desde el CMS | Mapeo secciones→componentes, RSC, ISR con revalidación por tag | $30.000 |
| B.2 | SEO técnico | Metadata API, OG dinámico, sitemap, robots, JSON-LD, semántica | $20.000 |
| B.3 | Responsive, performance y accesibilidad | Mobile-first, Core Web Vitals, Lighthouse ≥ 90, QA multi-navegador | $15.000 |
| **ENTREGA** | | | **$15.000** |
| C.1 | Demo, ciclo de validación y ajustes | Deploy de demo, relevamiento de devolución, aplicación de ajustes | $10.000 |
| C.2 | Producción, documentación y capacitación | Deploy final, manual de uso del CMS, sesión de traspaso | $5.000 |
| | | **TOTAL** | **$200.000** |

### 4.2 Condiciones comerciales

| Concepto | Detalle |
|---|---|
| Forma de pago | 50% al inicio ($100.000) — 50% contra entrega final ($100.000) |
| Plazo | 6 días hábiles desde la confirmación y la entrega de accesos |
| Incluye | Código fuente completo, repositorio Git con historial, documentación |
| Garantía | 15 días corridos de corrección de errores sobre lo entregado, sin cargo |
| Capacitación | 1 sesión de traspaso (aprox. 1 h) + manual escrito del CMS |
| No incluye | Redacción de contenidos, fotografía de producto, dominio, costos mensuales de Firebase/Vercel, diseño de identidad de marca |

**Para arrancar necesito de su parte:** logo en vector o PNG de alta resolución, paleta de colores si existe, textos de la landing, fotos de los artículos, datos de contacto y redes, y el dominio (o la decisión de comprarlo).

---

## 5. Costos mensuales de infraestructura — Firebase

Las imágenes se alojan en **Firebase Cloud Storage** (Google Cloud). Estos costos **no forman parte del presupuesto de desarrollo**: son un gasto operativo mensual que corre por cuenta del cliente, sobre su propia cuenta de Google.

Firebase tiene un **nivel sin costo** que cubre 5 GB almacenados y ~1 GB de descarga por día. Para un sitio de este tipo, la factura **arranca en US$ 0** y, en el escenario de mayor crecimiento proyectado, **no supera los US$ 8 por mes**.

### 5.1 Costo según cantidad de imágenes almacenadas

Asumo imágenes ya optimizadas por el sistema (~300 KB promedio tras la compresión a WebP descrita en A.4).

| Imágenes subidas | Espacio ocupado | Dentro del nivel gratuito | Costo mensual estimado (USD) |
|---:|---:|:---:|---:|
| 500 | ~0,15 GB | ✅ Sí | US$ 0,00 |
| 1.000 | ~0,3 GB | ✅ Sí | US$ 0,00 |
| 2.500 | ~0,75 GB | ✅ Sí | US$ 0,00 |
| 5.000 | ~1,5 GB | ✅ Sí | US$ 0,00 |
| 10.000 | ~3 GB | ✅ Sí | US$ 0,00 |
| 17.000 | ~5 GB | ⚠️ En el límite | US$ 0,00 |
| 34.000 | ~10 GB | ❌ No | ~US$ 0,13 |
| 170.000 | ~50 GB | ❌ No | ~US$ 1,17 |

> **Lectura simple:** el almacenamiento es prácticamente gratis. Con 10.000 fotos de artículos todavía no se paga nada, y aun con 170.000 el costo ronda un dólar por mes. Para un catálogo de plantas, el almacenamiento **nunca va a ser el problema**.

### 5.2 Costo según tráfico de visitantes (el factor real)

Lo que sí puede crecer es la **transferencia de datos** (cada vez que alguien ve una foto). Acá es donde la arquitectura elegida hace la diferencia: con `next/image` + CDN de Vercel, **cada imagen se descarga de Firebase una sola vez** y después la sirven los servidores de caché. Sin esa capa, el costo se multiplicaría.

Estimación asumiendo ~1,5 MB de imágenes por visita:

| Visitas mensuales | Tráfico total | Costo **sin** CDN (USD/mes) | Costo **con** la arquitectura propuesta |
|---:|---:|---:|---:|
| 1.000 | ~1,5 GB | US$ 0,00 (nivel gratuito) | US$ 0,00 |
| 5.000 | ~7,5 GB | US$ 0,00 (nivel gratuito) | US$ 0,00 |
| 20.000 | ~30 GB | ~US$ 0,00 (al límite) | US$ 0,00 |
| 50.000 | ~75 GB | ~US$ 5,40 | US$ 0,00 |
| 100.000 | ~150 GB | ~US$ 14,40 | ~US$ 0,90 |
| 200.000 | ~300 GB | ~US$ 32,40 | ~US$ 5,40 |

*Cálculo de la última columna: se asume que el CDN resuelve el 75 % de las descargas y solo el 25 % restante llega a Firebase, criterio conservador. Sobre ese volumen se descuentan los ~30 GB mensuales del nivel gratuito y el excedente se factura a US$ 0,12 por GB.*

### 5.3 Techo de costo — escenario de máxima

Este es el peor caso razonable para VJA Plantas: catálogo grande y tráfico alto sostenido.

| Concepto | Escenario | Costo mensual |
|---|---|---:|
| Almacenamiento | 50.000 imágenes (~15 GB), 10 GB facturables | ~US$ 0,26 |
| Transferencia de datos | 200.000 visitas/mes, 45 GB facturables | ~US$ 5,40 |
| Firestore (lecturas del contenido) | ~500.000 lecturas/mes | ~US$ 0,16 |
| Operaciones de Storage (subidas y descargas) | catálogo activo | ~US$ 0,10 |
| | **Subtotal calculado** | **~US$ 5,92** |
| | **Techo presupuestado con margen** | **~US$ 8,00** |

> **Conclusión:** en el uso previsto para VJA Plantas la factura de Firebase es **US$ 0 por mes**. Si el negocio crece fuerte —catálogo de 50.000 fotos y 200.000 visitas mensuales— el costo **escala hasta un techo aproximado de US$ 8 por mes**. Ese es el límite que conviene tomar como referencia al presupuestar.

**Notas sobre estas cifras:**

- Precios de referencia de Google Cloud Storage a la fecha de esta propuesta: ~US$ 0,026 por GB/mes almacenado y ~US$ 0,12 por GB descargado. Google puede modificarlos; conviene verificar en la calculadora oficial antes de contratar.
- Los proyectos nuevos de Firebase requieren el plan **Blaze** (pago por uso) para habilitar Cloud Storage. Blaze mantiene el nivel sin costo: **se activa una tarjeta, pero no se factura hasta superar los límites gratuitos.**
- Recomiendo configurar una **alerta de presupuesto en Google Cloud en US$ 8** (el techo de la tabla 5.3) para recibir un aviso por mail si el consumo se sale de lo previsto. Queda configurada en el traspaso del día 6.
- Para convertir a pesos: multiplicar el valor en USD por el tipo de cambio vigente al momento de la facturación (Google factura en dólares).

---

## 6. Alcance de los ajustes post-demo

Para que quede claro qué entra en el día 6 sin costo adicional y qué constituiría una nueva etapa:

**✅ Incluido en los ajustes de la demo:**

- Cambios de textos, colores, tipografías y espaciados.
- Cambio de variante visual en las secciones (elegir otro hero, por ejemplo).
- Reordenamiento de secciones.
- Reemplazo de imágenes.
- Corrección de errores, comportamientos inesperados o problemas de visualización.
- Ajustes de copy en la interfaz del CMS.

**➕ Constituye una etapa adicional a cotizar:**

- Tipos de sección nuevos que no estén en el catálogo (texto, galería, testimonios, contacto).
- Variantes visuales de hero adicionales a las 5 existentes.
- Funcionalidades no contempladas: carrito de compras, pasarela de pagos, multi-idioma, blog con paginación, buscador, integración con WhatsApp Business API, newsletter.
- Rediseño integral de la identidad visual.
- Migración de datos desde un sistema previo.

Toda ampliación se cotiza aparte con su propio alcance y plazo. Nada se agrega en silencio.

---

## 7. Qué se entrega concretamente

1. **Landing en producción**, funcionando en el dominio del cliente, con certificado HTTPS.
2. **Panel CMS** en `/cms`, con credenciales de acceso para el equipo de VJA Plantas.
3. **Repositorio Git** con el código fuente completo y el historial de trabajo.
4. **Proyecto de Firebase** configurado y transferido a la cuenta de Google del cliente (Auth, Firestore, Storage, reglas de seguridad y alerta de presupuesto).
5. **Manual del CMS** en formato escrito, con capturas, explicando cada operación paso a paso.
6. **Sesión de traspaso** de aproximadamente 1 hora, grabada si se desea.
7. **15 días de garantía** sobre errores de lo entregado.

---

*Presupuesto elaborado el 13/09/2026. Los valores de infraestructura son estimaciones basadas en las tarifas públicas de Google Cloud vigentes a esa fecha.*

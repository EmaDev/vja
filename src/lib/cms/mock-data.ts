import { defaultHeaderVariant } from "./header-variants";
import { defaultHeroVariant } from "./hero-variants";
import { defaultCardVariant } from "./card-variants";
import type { CmsSection } from "./types";

/** Seed usado por `repository.ts` cuando `sites/vja-plantas` todavía no tiene un draft en Firestore.
 *
 * El orden de este array es el orden de la landing: `normalizeSections()` recorre
 * el seed y busca cada `kind` en lo guardado, así que acá se decide dónde cae cada
 * sección en la página. Las fotos arrancan vacías a propósito —se cargan desde el
 * CMS, que las sube a Storage— y el sitio muestra el recuadro de papel hasta
 * entonces. */
export const initialSections: CmsSection[] = [
  {
    id: "header",
    kind: "header",
    variant: defaultHeaderVariant,
    logoText: "VJA Plantas",
    logoImageUrl: "",
    logoImageAlt: "",
    navLinks: [
      { id: "nav-1", label: "Inicio", href: "/" },
      { id: "nav-2", label: "Nosotros", href: "#nosotros" },
      { id: "nav-3", label: "Catálogo", href: "#catalogo" },
      { id: "nav-4", label: "Servicios", href: "#servicios" },
      { id: "nav-5", label: "Visitanos", href: "#visitanos" },
      { id: "nav-6", label: "Contacto", href: "#contacto" },
    ],
  },
  {
    id: "hero",
    kind: "hero",
    variant: defaultHeroVariant,
    eyebrow: "Temporada de interior",
    title: "Plantas que transforman",
    titleHighlight: "tu espacio",
    subtitle: "Cuidamos cada detalle para que tu jardín luzca siempre vivo.",
    ctaLabel: "Ver catálogo",
    ctaHref: "#catalogo",
    secondaryCtaLabel: "Escribinos",
    secondaryCtaHref: "#contacto",
    imageUrl: "",
    imageAlt: "",
  },
  {
    id: "about",
    kind: "about",
    visible: true,
    eyebrow: "Quiénes somos",
    title: "Una pasión",
    titleHighlight: "por las plantas",
    bodyFirst:
      "Somos un vivero y florería con pasión por la floricultura argentina. Cultivamos cada planta con dedicación y armamos cada ramo a mano, cuidando los detalles.",
    bodySecond:
      "Atendemos a quienes buscan plantas con carácter: para regalar, para decorar el living, para empezar a coleccionar, o para sumar verde a una oficina.",
    stats: [
      { id: "stat-1", value: "500+", label: "Productos disponibles" },
      { id: "stat-2", value: "Premium", label: "Calidad seleccionada" },
      { id: "stat-3", value: "365", label: "Días al año" },
      { id: "stat-4", value: "100%", label: "Atención personalizada" },
    ],
    imageUrl: "",
    imageAlt: "",
    accentImageUrl: "",
    accentImageAlt: "",
    badgeLabel: "VJA Plantas & Flores",
  },
  {
    id: "cards",
    kind: "cards",
    variant: defaultCardVariant,
  },
  {
    id: "services",
    kind: "services",
    visible: true,
    eyebrow: "Más que plantas",
    title: "Servicios del local",
    subtitle: "Hacemos mucho más que vender plantas en maceta — estamos para acompañarte.",
    items: [
      {
        id: "srv-1",
        tag: "Florería",
        title: "Arreglos florales a pedido",
        body:
          "Diseñamos arreglos personalizados a partir de tu foto o referencia. Seña del 50% y anticipación de una semana. Los hacemos a mano, con dedicación.",
        whatsappSubject: "Arreglo floral a pedido",
        imageUrl: "",
        imageAlt: "",
      },
      {
        id: "srv-2",
        tag: "Vivero",
        title: "Asesoría por WhatsApp",
        body:
          "¿Tu planta no está bien o no sabés cuál elegir? Mandanos una foto por WhatsApp y te ayudamos a diagnosticar, cuidar y elegir la indicada.",
        whatsappSubject: "Asesoría sobre una planta",
        imageUrl: "",
        imageAlt: "",
      },
      {
        id: "srv-3",
        tag: "Decoración",
        title: "Plantas y ramos para tu local",
        body:
          "Equipamos cafeterías, comercios y oficinas con plantas y arreglos. Renovaciones semanales o mensuales según lo que necesites.",
        whatsappSubject: "Decoración para mi local",
        imageUrl: "",
        imageAlt: "",
      },
      {
        id: "srv-4",
        tag: "Envíos",
        title: "Llevamos a tu casa",
        body:
          "Hacemos envíos a domicilio por la zona. Verificá tu código postal más abajo, o consultanos directamente por WhatsApp.",
        whatsappSubject: "Envío a domicilio",
        imageUrl: "",
        imageAlt: "",
      },
    ],
  },
  {
    id: "gallery",
    kind: "gallery",
    visible: true,
    eyebrow: "Nuestros espacios",
    title: "Galería",
    subtitle:
      "Una mirada a nuestros cultivos, instalaciones y la belleza que producimos cada día.",
    images: [
      { id: "gal-1", imageUrl: "", imageAlt: "" },
      { id: "gal-2", imageUrl: "", imageAlt: "" },
      { id: "gal-3", imageUrl: "", imageAlt: "" },
      { id: "gal-4", imageUrl: "", imageAlt: "" },
      { id: "gal-5", imageUrl: "", imageAlt: "" },
      { id: "gal-6", imageUrl: "", imageAlt: "" },
    ],
  },
  {
    id: "care",
    kind: "care",
    visible: true,
    eyebrow: "Aprendé",
    title: "Cuidados de tus plantas",
    subtitle: "Notas breves para que tus plantas estén siempre lindas. Hechas por nosotros, para vos.",
    items: [
      {
        id: "care-1",
        tag: "Riego",
        title: "El riego sin misterio",
        summary:
          "Cuántas veces y cómo regar según el tipo de planta. La regla simple para no equivocarse.",
        href: "",
        imageUrl: "",
        imageAlt: "",
      },
      {
        id: "care-2",
        tag: "Luz",
        title: "Cuánta luz necesita",
        summary:
          "Cómo leer una ventana y elegir el lugar justo para cada planta de interior.",
        href: "",
        imageUrl: "",
        imageAlt: "",
      },
      {
        id: "care-3",
        tag: "Trasplante",
        title: "Cuándo cambiar de maceta",
        summary:
          "Las señales de que a la raíz le quedó chica la maceta, y cómo trasplantar sin estresarla.",
        href: "",
        imageUrl: "",
        imageAlt: "",
      },
    ],
  },
  {
    id: "visit",
    kind: "visit",
    visible: true,
    eyebrow: "Visitanos",
    title: "Estamos para",
    titleHighlight: "recibirte",
    subtitle:
      "Pasá por el local y elegí en persona — o pedinos un arreglo y lo preparamos para que retires.",
    hours: [
      { id: "hrs-1", days: "Lunes a viernes", time: "9:00 – 18:00" },
      { id: "hrs-2", days: "Sábados", time: "9:00 – 18:30" },
      { id: "hrs-3", days: "Domingos", time: "Cerrado" },
    ],
    mapEmbedUrl: "",
    directionsUrl: "",
    ctaLabel: "Cómo llegar",
  },
  {
    id: "shipping",
    kind: "shipping",
    visible: true,
    eyebrow: "Envíos a domicilio",
    title: "Verificá tu zona",
    subtitle:
      "Por ahora hacemos envíos en San Justo y zonas cercanas. Poné tu código postal y vemos si llegamos.",
    zones: [
      { id: "zone-1", postalCode: "1754", locality: "San Justo" },
      { id: "zone-2", postalCode: "1755", locality: "San Justo" },
      { id: "zone-3", postalCode: "1768", locality: "Villa Luzuriaga" },
      { id: "zone-4", postalCode: "1769", locality: "Villa Luzuriaga" },
      { id: "zone-5", postalCode: "1704", locality: "Ramos Mejía" },
    ],
    coveredNote:
      "El precio del envío se cotiza según la distancia desde el local. Pasanos tu dirección por WhatsApp y te confirmamos el costo exacto en el momento.",
    notCoveredNote:
      "Todavía no llegamos a esa zona, pero estamos ampliando cobertura. Escribinos y te avisamos cuando lleguemos.",
    ctaLabel: "Consultar por WhatsApp",
  },
  {
    id: "faq",
    kind: "faq",
    visible: true,
    eyebrow: "Preguntas frecuentes",
    title: "Antes de venir,",
    titleHighlight: "resolvamos dudas",
    searchPlaceholder: "Buscá tu pregunta — ej. envíos, pagos, ramos…",
    items: [
      {
        id: "faq-1",
        question: "¿Hacen envíos a domicilio?",
        answer:
          "Sí, coordinamos envíos por zona. Escribinos por WhatsApp con tu dirección y te pasamos el costo.",
      },
      {
        id: "faq-2",
        question: "¿Qué medios de pago aceptan?",
        answer:
          "Efectivo, tarjeta de débito y crédito, transferencia y MercadoPago. Para arreglos a pedido pedimos seña del 50%.",
      },
      {
        id: "faq-3",
        question: "¿Puedo encargar un ramo o arreglo personalizado?",
        answer:
          "Sí — es lo que más nos gusta hacer. Decinos para qué ocasión, presupuesto aproximado y si tenés alguna preferencia de color o flor. Pedimos al menos 3 o 4 días de anticipación para ver si es posible realizarlo.",
      },
      {
        id: "faq-4",
        question: "¿Tienen estacionamiento? ¿Cómo llego?",
        answer:
          "Hay varios estacionamientos alrededor. En el bloque Visitanos tenés el botón Cómo llegar, que abre Google Maps con la ruta.",
      },
      {
        id: "faq-5",
        question: "¿Si mi planta se enferma me ayudan a recuperarla?",
        answer:
          "Sí. Mandanos fotos por WhatsApp y te decimos qué creemos que le pasa y cómo intentar recuperarla. No siempre se puede, pero damos pelea.",
      },
      {
        id: "faq-6",
        question: "¿Puedo tener un puesto de ramos en mi cafetería o local?",
        answer:
          "Sí. Armamos puestos de flores frescas para cafeterías, restaurantes y oficinas: vos los ofrecés en tu local y nosotros te abastecemos con renovación semanal o quincenal según el flujo. Escribinos con la dirección y coordinamos una visita.",
      },
    ],
  },
  {
    id: "contact",
    kind: "contact",
    storeName: "VJA Plantas — Vivero",
    phone: "+54 11 4820-9931",
    address: "Av. Libertador 4820, Buenos Aires",
    email: "hola@vjaplantas.com.ar",
    hours: "Mar a Dom · 10 a 19 h",
    whatsappEnabled: true,
    whatsappPhone: "+54 9 11 4820-9931",
    whatsappLabel: "Escribinos",
    whatsappMessage: "¡Hola! Vengo de la web y quería hacerles una consulta.",
  },
  {
    id: "footer",
    kind: "footer",
    closingPhrase: "Cultivado aquí, cortado hoy.",
    legalText: "© 2026 VJA Plantas",
    background: "forest",
    columns: [
      { id: "col-1", title: "Tienda", links: [
        { id: "l-1", label: "Interior", href: "#" },
        { id: "l-2", label: "Exterior", href: "#" },
        { id: "l-3", label: "Flores", href: "#" },
        { id: "l-4", label: "Macetas", href: "#" },
      ] },
      { id: "col-2", title: "Ayuda", links: [
        { id: "l-5", label: "Cuidados", href: "#cuidados" },
        { id: "l-6", label: "Envíos", href: "#envios" },
        { id: "l-7", label: "Preguntas", href: "#faq" },
      ] },
      { id: "col-3", title: "Nosotros", links: [
        { id: "l-8", label: "El vivero", href: "#nosotros" },
        { id: "l-9", label: "Galería", href: "#galeria" },
        { id: "l-10", label: "Contacto", href: "#contacto" },
      ] },
    ],
    instagram: "@vjaplantas",
    pinterest: "vjaplantas",
    newsletterEnabled: true,
  },
  {
    id: "seo",
    kind: "seo",
    metaTitle: "VJA Plantas · Vivero y floristería en Buenos Aires",
    metaDescription:
      "Plantas de interior, flores frescas y arreglos a medida. Vivero propio en Tigre y local en Av. Libertador.",
    shareImageUrl: "",
    shareImageAlt: "",
  },
];

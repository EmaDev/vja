// Carga inicial del catálogo en Firestore. Los datos vivían hardcodeados en
// `src/lib/cms/product-mock-data.ts` y `category-mock-data.ts`; ahora viven acá,
// en un script de una sola vez, y la app lee únicamente de la base.
//
//   node scripts/seed-catalog.mjs              # sólo crea lo que falta
//   node scripts/seed-catalog.mjs --overwrite  # pisa lo que ya está cargado
//
// Sin `--overwrite` no toca un documento existente: si el vivero ya editó una
// planta desde el CMS, volver a correr el seed no puede deshacer ese trabajo.
import { readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// Mismo criterio que `scripts/set-cms-role.mjs`: el .env se lee a mano porque
// no se puede confiar en `node --env-file` en todas las máquinas del equipo.
//
// El corte contempla CRLF: el .env.local de Windows los trae, y en JavaScript
// `.` no matchea `\r`, así que un `split("\n")` a secas deja un `\r` colgando
// que hace fallar la línea entera en silencio.
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split(/\r?\n/)) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (!match) continue;
  const [, key, rawValue] = match;
  const value = rawValue.replace(/^"(.*)"$/, "$1");
  process.env[key] ??= value;
}

const SITE_ID = "vja-plantas";
const overwrite = process.argv.includes("--overwrite");

const categories = [
  {
    id: "interior",
    name: "Interior",
    slug: "interior",
    short: "Plantas que viven bien puertas adentro",
    description:
      "Especies aclimatadas a la luz de una casa o una oficina. Llegan en maceta, con sustrato propio y una ficha de riego escrita a mano.",
    status: "live",
    imageUrl: "",
    imageAlt: "",
    featured: true,
  },
  {
    id: "exterior",
    name: "Exterior",
    slug: "exterior",
    short: "Para patio, balcón y jardín",
    description:
      "Plantas de sol directo y media sombra, criadas a la intemperie en nuestro vivero de Tigre para que no sufran el cambio.",
    status: "live",
    imageUrl: "",
    imageAlt: "",
    featured: true,
  },
  {
    id: "flores-de-corte",
    name: "Flores de corte",
    slug: "flores-de-corte",
    short: "Ramos de temporada, cortados el mismo día",
    description:
      "Lo que esté floreciendo esa semana. La disponibilidad cambia seguido: preguntanos antes de encargar un ramo grande.",
    status: "live",
    imageUrl: "",
    imageAlt: "",
    featured: false,
  },
  {
    id: "accesorios",
    name: "Accesorios",
    slug: "accesorios",
    short: "Macetas, sustratos y herramientas",
    description:
      "Cerámica esmaltada y terracota de ceramistas del conurbano, más el sustrato que usamos nosotros en el vivero.",
    status: "draft",
    imageUrl: "",
    imageAlt: "",
    featured: false,
  },
];

const products = [
  {
    id: "monstera-deliciosa",
    name: "Monstera Deliciosa",
    latin: "Monstera deliciosa",
    category: "Interior",
    light: "Luz indirecta",
    water: "Semanal",
    height: "1,4 m",
    difficulty: "Fácil",
    pot: "Cerámica esmaltada",
    petSafe: "No",
    status: "live",
    photos: [],
    short: "Interior · Media · semanal",
    long: "Una de las plantas de interior más agradecidas: tolera el olvido ocasional y crece rápido cuando encuentra su lugar. La cultivamos en nuestro vivero de Tigre y la entregamos ya aclimatada, con sustrato propio y una ficha de riego escrita a mano.",
    tags: ["Fácil de cuidar", "Hoja grande", "Purifica el aire", "Regalo"],
    featured: true,
  },
  {
    id: "ficus-lyrata",
    name: "Ficus Lyrata",
    latin: "Ficus lyrata",
    category: "Interior",
    light: "Luz indirecta",
    water: "Semanal",
    height: "1,6 m",
    difficulty: "Media",
    pot: "Terracota",
    petSafe: "No",
    status: "live",
    photos: [],
    short: "Interior · Indirecta · semanal",
    long: "Hojas grandes en forma de violín que hacen de esta planta una pieza escultórica en cualquier living. Prefiere luz brillante pero indirecta y odia los cambios de lugar frecuentes.",
    tags: ["Hoja grande", "Decorativa"],
    featured: false,
  },
  {
    id: "calathea-orbifolia",
    name: "Calathea Orbifolia",
    latin: "Goeppertia orbifolia",
    category: "Interior",
    light: "Media sombra",
    water: "Dos veces por semana",
    height: "60 cm",
    difficulty: "Requiere experiencia",
    pot: "Cerámica esmaltada",
    petSafe: "Sí",
    status: "draft",
    photos: [],
    short: "Interior · Media · 2 por semana",
    long: "Conocida como la planta de la oración por el movimiento de sus hojas. Necesita humedad ambiente alta y agua sin cloro para lucir sus rayas plateadas.",
    tags: ["Apta mascotas", "Follaje decorativo"],
    featured: false,
  },
  {
    id: "olivo-en-maceta",
    name: "Olivo en maceta",
    latin: "Olea europaea",
    category: "Exterior",
    light: "Pleno sol",
    water: "Quincenal",
    height: "1,8 m",
    difficulty: "Fácil",
    pot: "Terracota",
    petSafe: "Sí",
    status: "live",
    photos: [],
    short: "Exterior · Pleno sol · quincenal",
    long: "Pleno sol y poca agua. Aguanta el balcón más expuesto de la ciudad y da un aire mediterráneo a cualquier terraza.",
    tags: ["Exterior", "Bajo mantenimiento"],
    featured: true,
  },
  {
    id: "tulipanes-blancos",
    name: "Tulipanes blancos",
    latin: "Tulipa gesneriana",
    category: "Flores de corte",
    light: "Interior",
    water: "Agua diaria",
    height: "40 cm",
    difficulty: "Fácil",
    pot: "Sin maceta",
    petSafe: "No",
    status: "live",
    photos: [],
    short: "Flores de corte · Interior · agua diaria",
    long: "Llegan cerrados para que los veas abrir en casa. Diez varas por atado, papel kraft y cinta de algodón.",
    tags: ["Temporada", "Regalo"],
    featured: false,
  },
  {
    id: "kokedama-de-musgo",
    name: "Kokedama de musgo",
    latin: "Nephrolepis exaltata",
    category: "Accesorios",
    light: "Sombra",
    water: "Inmersión",
    height: "18 cm",
    difficulty: "Media",
    pot: "Sin maceta",
    petSafe: "Sí",
    status: "draft",
    photos: [],
    short: "Accesorios · Sombra · inmersión",
    long: "Sin maceta: la raíz va envuelta en musgo y se riega por inmersión una vez por semana. Edición limitada del taller.",
    tags: ["Edición limitada", "Sin maceta"],
    featured: false,
  },
  {
    id: "zamioculca",
    name: "Zamioculca",
    latin: "Zamioculcas zamiifolia",
    category: "Interior",
    light: "Luz baja",
    water: "Mensual",
    height: "70 cm",
    difficulty: "Fácil",
    pot: "Cerámica esmaltada",
    petSafe: "No",
    status: "live",
    photos: [],
    short: "Interior · Baja · mensual",
    long: "Prácticamente indestructible: aguanta rincones oscuros y riego espaciado. Ideal para quien recién empieza con plantas.",
    tags: ["Fácil de cuidar", "Poca luz"],
    featured: false,
  },
  {
    id: "lavanda",
    name: "Lavanda",
    latin: "Lavandula angustifolia",
    category: "Exterior",
    light: "Pleno sol",
    water: "Semanal",
    height: "45 cm",
    difficulty: "Fácil",
    pot: "Terracota",
    petSafe: "Sí",
    status: "live",
    photos: [],
    short: "Exterior · Pleno sol · semanal",
    long: "Aroma intenso y flores color violeta durante todo el verano. Perfecta para balcón soleado y atrae polinizadores.",
    tags: ["Aromática", "Exterior"],
    featured: false,
  },
];

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const siteDoc = getFirestore(app).collection("sites").doc(SITE_ID);

/** El índice del array es el campo `order`: el orden en que se cargaron acá es
 * el orden en que se muestran en el sitio. */
async function seed(collectionName, items) {
  const ref = siteDoc.collection(collectionName);
  let written = 0;
  let skipped = 0;

  for (const [index, { id, ...fields }] of items.entries()) {
    const doc = ref.doc(id);

    if (!overwrite && (await doc.get()).exists) {
      skipped++;
      continue;
    }

    await doc.set({
      ...fields,
      order: index,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: "seed",
    });
    written++;
  }

  console.log(`${collectionName}: ${written} escritos, ${skipped} ya existían`);
}

await seed("categories", categories);
await seed("products", products);

console.log(
  overwrite
    ? "Listo. Publicá desde el CMS o esperá la revalidación para verlo en el sitio."
    : "Listo. Usá --overwrite para pisar los documentos que ya estaban.",
);

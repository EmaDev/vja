export type ProductStatus = "live" | "draft";

export interface Product {
  id: string;
  name: string;
  latin: string;
  category: string;
  light: string;
  water: string;
  height: string;
  difficulty: string;
  pot: string;
  petSafe: string;
  status: ProductStatus;
  photos: number;
  short: string;
  long: string;
  tags: string[];
  featured: boolean;
}

/** Catálogo de ejemplo — no hay colección de productos en Firestore todavía, esta
 * pantalla trabaja en memoria mientras se define el modelo de datos real. */
export const mockProducts: Product[] = [
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
    photos: 4,
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
    photos: 5,
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
    photos: 2,
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
    photos: 3,
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
    photos: 3,
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
    photos: 2,
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
    photos: 4,
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
    photos: 3,
    short: "Exterior · Pleno sol · semanal",
    long: "Aroma intenso y flores color violeta durante todo el verano. Perfecta para balcón soleado y atrae polinizadores.",
    tags: ["Aromática", "Exterior"],
    featured: false,
  },
];

import type { ComponentType } from "react";
import { ProductCardOverlay } from "@/components/molecules/ProductCardOverlay";
import { ProductCardArch } from "@/components/molecules/ProductCardArch";
import { ProductCardDrawer } from "@/components/molecules/ProductCardDrawer";
import { ProductCardEditorialRow } from "@/components/molecules/ProductCardEditorialRow";
import { ProductCardCircle } from "@/components/molecules/ProductCardCircle";
import type { WireKind } from "@/components/molecules/VariantWireframe/VariantWireframe";

export type CardVariantId = "overlay" | "arch" | "drawer" | "row" | "circle";

export interface CardVariantDefinition {
  id: CardVariantId;
  code: string;
  label: string;
  description: string;
  wireKind: WireKind;
  /** Fondo de vitrina recomendado para que la card se lea bien (algunas usan texto claro). */
  previewBg: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: ComponentType<any>;
  sampleItems: Record<string, unknown>[];
}

export const cardVariants: CardVariantDefinition[] = [
  {
    id: "overlay",
    code: "2a",
    label: "Foto a sangre",
    description: "Los chips de cuidado aparecen al pasar el mouse.",
    wireKind: "bleed",
    previewBg: "bg-paper",
    Component: ProductCardOverlay,
    sampleItems: [
      { category: "Interior · luz media", name: "Monstera Deliciosa", imageLabel: "Monstera", tags: ["Riego semanal", "Crece rápido"] },
      { category: "Flores · corte del día", name: "Ramo de temporada", imageLabel: "Ramo de temporada", tags: ["Dura 7 días", "Aroma suave"] },
      { category: "Interior · resistente", name: "Sansevieria", imageLabel: "Sansevieria", tags: ["Riego mensual", "Poca luz"] },
    ],
  },
  {
    id: "arch",
    code: "2b",
    label: "Ficha botánica",
    description: "Imagen en arco con luz, riego y altura.",
    wireKind: "arch",
    previewBg: "bg-paper-light",
    Component: ProductCardArch,
    sampleItems: [
      {
        name: "Ficus Lyrata",
        subtitle: "Higuera hoja de violín",
        imageLabel: "Ficus Lyrata",
        specs: [
          { label: "Luz", value: "Indirecta" },
          { label: "Riego", value: "Semanal" },
          { label: "Altura", value: "1,4 m" },
        ],
      },
      {
        name: "Calathea Orbifolia",
        subtitle: "Planta de la oración",
        imageLabel: "Calathea",
        specs: [
          { label: "Luz", value: "Media" },
          { label: "Riego", value: "2 por semana" },
          { label: "Altura", value: "60 cm" },
        ],
      },
      {
        name: "Zamioculca",
        subtitle: "Planta ZZ",
        imageLabel: "Zamioculca",
        specs: [
          { label: "Luz", value: "Baja" },
          { label: "Riego", value: "Mensual" },
          { label: "Altura", value: "70 cm" },
        ],
      },
    ],
  },
  {
    id: "drawer",
    code: "2c",
    label: "Cajón deslizante",
    description: "La descripción sube desde abajo sobre la foto.",
    wireKind: "drawer",
    previewBg: "bg-forest",
    Component: ProductCardDrawer,
    sampleItems: [
      { badge: "Sombra", name: "Helecho Nido de Ave", imageLabel: "Helecho", description: "Le gusta la humedad del baño y la luz filtrada. Nunca sol directo sobre la hoja." },
      { badge: "Escritorio", name: "Peperomia Sandía", imageLabel: "Peperomia", description: "Compacta y agradecida. Ideal para el primer intento con plantas de interior." },
      { badge: "Exterior", name: "Olivo en maceta", imageLabel: "Olivo", description: "Pleno sol y poca agua. Aguanta el balcón más expuesto de la ciudad." },
    ],
  },
  {
    id: "row",
    code: "2d",
    label: "Lista horizontal",
    description: "Filas numeradas con descripción larga.",
    wireKind: "row",
    previewBg: "bg-paper",
    Component: ProductCardEditorialRow,
    sampleItems: [
      { index: "01", category: "Colgante · fácil", name: "Pothos Marble Queen", imageLabel: "Pothos", description: "Crece hacia abajo y perdona los olvidos. La colgamos de un macramé teñido a mano en el taller." },
      { index: "02", category: "Flor de corte · septiembre", name: "Tulipanes blancos", imageLabel: "Tulipanes", description: "Llegan cerrados para que los veas abrir en casa. Diez varas por atado, papel kraft y cinta de algodón." },
      { index: "03", category: "Taller · edición limitada", name: "Kokedama de musgo", imageLabel: "Kokedama", description: "Sin maceta: la raíz va envuelta en musgo y se riega por inmersión una vez por semana." },
    ],
  },
  {
    id: "circle",
    code: "2e",
    label: "Retrato circular",
    description: "Cuatro por fila, foto redonda sobre papel.",
    wireKind: "circle",
    previewBg: "bg-cream",
    Component: ProductCardCircle,
    sampleItems: [
      { imageLabel: "Aloe", name: "Aloe Vera", meta: "Sol directo · riego escaso" },
      { imageLabel: "Lavanda", name: "Lavanda", meta: "Balcón · aroma fuerte" },
      { imageLabel: "Eucalipto", name: "Eucalipto seco", meta: "Sin agua · dura meses" },
      { imageLabel: "Suculentas", name: "Trío de suculentas", meta: "Ventana · riego mensual" },
    ],
  },
];

export const defaultCardVariant: CardVariantId = "arch";

export interface SectionTemplate {
  id: string;
  label: string;
  description: string;
}

export const sectionTemplates: SectionTemplate[] = [
  { id: "text", label: "Texto libre", description: "Título y contenido de texto." },
  { id: "gallery", label: "Galería", description: "Colección de imágenes." },
  { id: "testimonials", label: "Testimonios", description: "Opiniones de clientes." },
  { id: "contact", label: "Contacto", description: "Formulario o datos de contacto." },
];

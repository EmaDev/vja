/** Datos estructurados en el documento.
 *
 * El `</script>` escapado no es paranoia de más: todo lo que va acá adentro
 * —nombre del local, dirección, descripción de una planta— lo escribe el cliente
 * en el panel. Sin escapar, un `</script>` tipeado en una descripción cerraría
 * la etiqueta antes de tiempo y el resto del JSON se interpretaría como HTML.
 * Escapar `<` alcanza para que eso no pueda pasar y sigue siendo JSON válido,
 * porque `<` es la misma letra para cualquier parser. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

// Toma un valor que puede ser bilingüe ({ es, en }) o un texto común, y devuelve el del idioma pedido.
export default function tr(value, lang) {
  if (value && typeof value === "object" && !Array.isArray(value) && "es" in value) {
    return value[lang] ?? value.es;
  }
  return value;
}

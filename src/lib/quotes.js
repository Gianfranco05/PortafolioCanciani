// Easter egg — Meditaciones, Marco Aurelio (dominio público, citas breves de uso extendido).
export const MEDITATIONS_AUTHOR = "Marco Aurelio, Meditaciones";

export const MEDITATIONS_QUOTES = [
  "Tienes poder sobre tu mente, no sobre los eventos externos. Date cuenta de esto y encontrarás fuerza.",
  "El obstáculo en el camino se convierte en el camino.",
  "La felicidad de tu vida depende de la calidad de tus pensamientos.",
  "Lo que no beneficia a la colmena, tampoco beneficia a la abeja.",
  "Cuando te despiertes por la mañana, piensa en el privilegio de estar vivo: pensar, disfrutar, amar.",
  "No actúes como si fueras a vivir diez mil años. Mientras vivas, mientras puedas, hazte bueno.",
];

export function randomQuote() {
  return MEDITATIONS_QUOTES[Math.floor(Math.random() * MEDITATIONS_QUOTES.length)];
}

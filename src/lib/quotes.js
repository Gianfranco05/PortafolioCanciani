// Easter egg — Meditaciones, Marco Aurelio (dominio público, citas breves de uso extendido).
export const MEDITATIONS_AUTHOR = {
  es: "Marco Aurelio, Meditaciones",
  en: "Marcus Aurelius, Meditations",
};

export const MEDITATIONS_QUOTES = {
  es: [
    "Tienes poder sobre tu mente, no sobre los eventos externos. Date cuenta de esto y encontrarás fuerza.",
    "El obstáculo en el camino se convierte en el camino.",
    "La felicidad de tu vida depende de la calidad de tus pensamientos.",
    "Lo que no beneficia a la colmena, tampoco beneficia a la abeja.",
    "Cuando te despiertes por la mañana, piensa en el privilegio de estar vivo: pensar, disfrutar, amar.",
    "No actúes como si fueras a vivir diez mil años. Mientras vivas, mientras puedas, hazte bueno.",
  ],
  en: [
    "You have power over your mind, not outside events. Realize this, and you will find strength.",
    "The impediment to action advances action. What stands in the way becomes the way.",
    "The happiness of your life depends upon the quality of your thoughts.",
    "That which is not good for the swarm is not good for the bee.",
    "When you wake up in the morning, tell yourself: I have the privilege of being alive — to think, to enjoy, to love.",
    "You could leave life right now. Let that determine what you do and say and think.",
  ],
};

export function randomQuote(lang = "es") {
  const list = MEDITATIONS_QUOTES[lang] ?? MEDITATIONS_QUOTES.es;
  return list[Math.floor(Math.random() * list.length)];
}

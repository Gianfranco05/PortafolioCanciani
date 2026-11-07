let printed = false;

const LINES = {
  es: [
    "👋 Hola, dev.",
    "Si llegaste hasta acá inspeccionando el código... ya tenemos algo en común.",
    "¿Hablamos? gianfrancocanciani@gmail.com — o probá el Konami Code en esta página 😉",
  ],
  en: [
    "👋 Hi, dev.",
    "If you made it this far inspecting the code... we already have something in common.",
    "Let's talk? gianfrancocanciani@gmail.com — or try the Konami Code on this page 😉",
  ],
};

// Easter egg para quien esté mirando la consola — recruiters y curiosos técnicos.
// Se imprime una sola vez por visita, en el idioma activo al cargar.
export function printConsoleEgg(lang = "es") {
  if (printed) return;
  printed = true;

  const [hello, common, contact] = LINES[lang] ?? LINES.es;
  console.log(`%c${hello}`, "font-size:18px;font-weight:800;color:#f7f5f0;");
  console.log(`%c${common}`, "font-size:12px;color:#a8a29e;");
  console.log(`%c${contact}`, "font-size:12px;color:#a8a29e;");
}

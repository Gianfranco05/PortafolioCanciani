let printed = false;

// Easter egg para quien esté mirando la consola — recruiters y curiosos técnicos.
export function printConsoleEgg() {
  if (printed) return;
  printed = true;

  console.log(
    "%c👋 Hola, dev.",
    "font-size:18px;font-weight:800;color:#f7f5f0;"
  );
  console.log(
    "%cSi llegaste hasta acá inspeccionando el código... ya tenemos algo en común.",
    "font-size:12px;color:#a8a29e;"
  );
  console.log(
    "%c¿Hablamos? gianfrancocanciani@gmail.com — o probá el Konami Code en esta página 😉",
    "font-size:12px;color:#a8a29e;"
  );
}

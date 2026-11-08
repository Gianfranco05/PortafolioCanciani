// Tema del sitio: "dark" (por defecto) o "paper" (hoja clara con letra manuscrita).
// El atributo data-theme en <html> lo lee index.css; index.html lo aplica antes del
// primer render para que no haya parpadeo.
const KEY = "theme";
const FONT_ID = "hand-font";

// La fuente manuscrita se baja solo cuando hace falta (modo papel o la sección "Programo en papel").
export function loadHandFont() {
  if (typeof document === "undefined" || document.getElementById(FONT_ID)) return;
  const link = document.createElement("link");
  link.id = FONT_ID;
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap";
  document.head.appendChild(link);
}

export function getTheme() {
  return document.documentElement.dataset.theme === "paper" ? "paper" : "dark";
}

export function setTheme(theme) {
  const next = theme === "paper" ? "paper" : "dark";
  if (next === "paper") {
    document.documentElement.dataset.theme = "paper";
    loadHandFont();
  } else {
    delete document.documentElement.dataset.theme;
  }
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // sin persistencia: el tema dura solo esta visita
  }
  window.dispatchEvent(new Event("themechange"));
}

export function toggleTheme() {
  setTheme(getTheme() === "paper" ? "dark" : "paper");
}

if (typeof document !== "undefined" && getTheme() === "paper") loadHandFont();

import { useEffect, useState } from "react";
import { LanguageContext } from "./context";

const STORAGE_KEY = "lang";
const LANGS = ["es", "en"];

// Idioma inicial: el que eligió la persona antes; si no hay, el del navegador
// (español si empieza con "es", inglés para cualquier otro).
function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch {
    // localStorage no disponible — se usa el idioma del navegador
  }
  const nav = (navigator.language || "es").toLowerCase();
  return nav.startsWith("es") ? "es" : "en";
}

export default function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // sin persistencia: el idioma se mantiene solo durante la visita
    }
  }, [lang]);

  const toggleLang = () => setLang((l) => (l === "es" ? "en" : "es"));

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

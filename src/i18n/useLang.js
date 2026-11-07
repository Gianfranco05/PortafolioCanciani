import { useContext } from "react";
import { LanguageContext } from "./context";

// Devuelve { lang, setLang, toggleLang }.
export default function useLang() {
  return useContext(LanguageContext);
}

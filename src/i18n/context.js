import { createContext } from "react";

export const LanguageContext = createContext({ lang: "es", setLang: () => {}, toggleLang: () => {} });

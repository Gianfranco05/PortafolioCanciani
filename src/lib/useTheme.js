import { useSyncExternalStore } from "react";
import { getTheme } from "./theme";

const subscribe = (cb) => {
  window.addEventListener("themechange", cb);
  return () => window.removeEventListener("themechange", cb);
};

// Devuelve "dark" | "paper" y se actualiza cuando cambia (botón, terminal, etc.).
export default function useTheme() {
  return useSyncExternalStore(subscribe, getTheme, () => "dark");
}

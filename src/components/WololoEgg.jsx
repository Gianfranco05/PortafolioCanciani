import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useLang from "../i18n/useLang";

const TARGET = "wololo";
export const WOLOLO_EVENT = "wololo:trigger";

const SUBTITLE = {
  es: "Age of Empires II — unidad convertida",
  en: "Age of Empires II — unit converted",
};

// Easter egg — Age of Empires II. Escribí "wololo" en cualquier parte de la página
// (desktop, por teclado) o en el campo de mensaje de Contacto (mobile, dispara WOLOLO_EVENT).
export default function WololoEgg() {
  const [active, setActive] = useState(false);
  const { lang } = useLang();

  const trigger = () => {
    setActive(true);
    setTimeout(() => setActive(false), 2600);
  };

  useEffect(() => {
    let buffer = "";
    const handleKey = (e) => {
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-TARGET.length);
      if (buffer === TARGET) {
        buffer = "";
        trigger();
      }
    };
    window.addEventListener("keydown", handleKey);

    const handleCustomTrigger = () => trigger();
    window.addEventListener(WOLOLO_EVENT, handleCustomTrigger);

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener(WOLOLO_EVENT, handleCustomTrigger);
    };
  }, []);

  // Cursor "de conversión" (verde) mientras dura el easter egg
  useEffect(() => {
    document.body.classList.toggle("wololo-active", active);
    return () => document.body.classList.remove("wololo-active");
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
          aria-hidden="true"
        >
          <div className="flex items-center gap-3 bg-stone-950/90 border border-stone-700 text-white px-6 py-3 rounded-2xl shadow-2xl">
            <span className="text-2xl">🙏</span>
            <div>
              <p className="font-extrabold tracking-wide">¡WOLOLO!</p>
              <p className="text-xs text-stone-400">{SUBTITLE[lang]}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

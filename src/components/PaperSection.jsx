import { motion, useReducedMotion } from "framer-motion";
import { HiOutlineMoon, HiOutlineDocumentText } from "react-icons/hi";
import { EASE } from "../lib/motion";
import { toggleTheme } from "../lib/theme";
import useTheme from "../lib/useTheme";
import useLang from "../i18n/useLang";

const TEXT = {
  es: {
    badge: "Dato curioso: Programo en papel",
    toPaper: "Probar el modo papel",
    toDark: "Volver al modo oscuro",
  },
  en: {
    badge: "Fun fact: I code on paper",
    toPaper: "Try paper mode",
    toDark: "Back to dark mode",
  },
};

// Dato curioso con un botón que hace lo mismo que el del navbar: alterna el modo papel.
export default function PaperSection() {
  const shouldReduceMotion = useReducedMotion();
  const { lang } = useLang();
  const t = TEXT[lang];
  const paper = useTheme() === "paper";
  const fade = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 } };

  return (
    <motion.div {...fade} viewport={{ once: true }} transition={{ duration: 0.7, ease: EASE }} className="mt-32 max-w-2xl mx-auto text-center">
      <span className="block w-fit mx-auto py-1 px-3 rounded-full bg-white/5 text-stone-300 text-xs font-semibold tracking-wider uppercase mb-6 border border-white/15">
        ✎ {t.badge}
      </span>
      <button
        type="button"
        onClick={toggleTheme}
        aria-pressed={paper}
        className="inline-flex items-center gap-2 text-sm font-semibold bg-stone-100 hover:bg-white text-stone-950 px-5 py-2.5 rounded-lg transition-colors"
      >
        {paper ? <HiOutlineMoon /> : <HiOutlineDocumentText />}
        {paper ? t.toDark : t.toPaper}
      </button>
    </motion.div>
  );
}

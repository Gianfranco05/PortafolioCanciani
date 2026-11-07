import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "../lib/motion";
import useLang from "../i18n/useLang";
import useDocumentMeta from "../i18n/useDocumentMeta";

const TEXT = {
  es: {
    metaTitle: "Página no encontrada",
    metaDescription: "La página que buscás no existe o fue movida.",
    title: "Página no encontrada",
    text: "La página que buscas no existe o fue movida. Revisá la URL o volvé al inicio.",
    back: "Volver al Inicio",
  },
  en: {
    metaTitle: "Page not found",
    metaDescription: "The page you are looking for does not exist or has been moved.",
    title: "Page not found",
    text: "The page you are looking for does not exist or has been moved. Check the URL or go back home.",
    back: "Back to Home",
  },
};

export default function NotFound() {
  const shouldReduceMotion = useReducedMotion();
  const { lang } = useLang();
  const t = TEXT[lang];
  useDocumentMeta({ title: t.metaTitle, description: t.metaDescription });

  const anim = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section
      id="main-content"
      className="min-h-screen flex items-center justify-center bg-stone-900 pt-28 pb-12"
    >
      <div className="container mx-auto px-6 text-center">
        <motion.div {...anim} transition={{ duration: 0.7, ease: EASE }}>
          <motion.span
            animate={shouldReduceMotion ? {} : { scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-stone-300 via-stone-100 to-white select-none"
          >
            404
          </motion.span>

          <h1 className="text-3xl md:text-4xl font-bold text-white mt-6 mb-4">
            {t.title}
          </h1>

          <p className="text-stone-400 text-lg max-w-md mx-auto mb-10 leading-relaxed">
            {t.text}
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              to="/"
              className="btn-shine inline-flex items-center gap-3 bg-stone-100 hover:bg-white text-stone-950 px-8 py-4 rounded-xl font-medium transition-all shadow-lg shadow-black/30"
            >
              <FaHome />
              {t.back}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import useLang from "../i18n/useLang";
import tr from "../i18n/tr";

const navLinks = [
  { path: "/", label: { es: "Inicio", en: "Home" } },
  { path: "/projects", label: { es: "Proyectos", en: "Projects" } },
  { path: "/experience", label: { es: "Experiencia", en: "Experience" } },
  { path: "/lab", label: "Lab" },
  { path: "/contact", label: { es: "Contacto", en: "Contact" } },
];

// Selector ES / EN: muestra los dos idiomas y resalta el activo.
function LanguageToggle() {
  const { lang, toggleLang } = useLang();
  return (
    <button
      type="button"
      onClick={toggleLang}
      className="flex items-center rounded-full border border-stone-700 bg-stone-900/60 p-0.5 text-xs font-semibold tracking-wide"
      aria-label={lang === "es" ? "Cambiar idioma a inglés" : "Switch language to Spanish"}
      title={lang === "es" ? "English" : "Español"}
    >
      {["es", "en"].map((code) => (
        <span
          key={code}
          className={`px-2.5 py-1 rounded-full transition-colors ${
            lang === code ? "bg-stone-100 text-stone-950" : "text-stone-400 hover:text-white"
          }`}
        >
          {code.toUpperCase()}
        </span>
      ))}
    </button>
  );
}

const mobileStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const mobileItem = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0 }
};

export default function Navbar() {
  const location = useLocation();
  const { lang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-lock robusto para mobile: solo "overflow: hidden" no alcanza en iOS/Android,
  // el fondo se sigue moviendo detrás del menú. Fijar el body en su posición actual lo evita.
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const { body } = document;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.overflow = "hidden";

    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);
  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <nav
      className={`fixed w-full z-[70] transition-all duration-500 ${
        scrolled
          ? "bg-stone-900/75 backdrop-blur-md shadow-lg shadow-black/20 border-b border-stone-800/60 py-4"
          : "bg-transparent border-b border-transparent py-6"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-white hover:text-stone-300 transition-colors"
            onClick={closeMenu}
          >
            GC<span className="text-stone-400">.</span>
          </Link>
        </motion.div>

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <motion.div
              key={item.path}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to={item.path} 
                className={`relative text-sm font-medium tracking-wide transition-colors pb-1 ${
                  isActive(item.path)
                    ? "text-white"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                {tr(item.label, lang)}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-stone-400 via-white to-stone-400"
                  />
                )}
              </Link>
            </motion.div>
          ))}
          <LanguageToggle />
        </div>

        {/* Mobile: idioma siempre visible + botón hamburguesa */}
        <div className="md:hidden flex items-center gap-3">
          <LanguageToggle />
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-stone-300 hover:text-white transition-colors"
            aria-label={
              lang === "es" ? (isOpen ? "Cerrar menú" : "Abrir menú") : isOpen ? "Close menu" : "Open menu"
            }
            aria-expanded={isOpen}
          >
            {isOpen ? <HiX size={26} /> : <HiMenu size={26} />}
          </motion.button>
        </div>
      </div>

      {/* Menú mobile overlay — backdrop y panel como hijos directos con key propia:
          envolverlos en un Fragment rompe la animación de salida de AnimatePresence. */}
      <AnimatePresence>
        {isOpen && [
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 md:hidden z-40"
            onClick={closeMenu}
            aria-hidden="true"
          />,
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-dvh w-64 bg-stone-900 border-l border-stone-800 shadow-2xl md:hidden z-50 overflow-y-auto"
          >
            <motion.div
              variants={mobileStagger}
              initial="hidden"
              animate="show"
              className="flex flex-col pt-24 px-8 gap-2"
            >
              {navLinks.map((item) => (
                <motion.div
                  key={item.path}
                  variants={mobileItem}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.path}
                    onClick={closeMenu}
                    className={`text-lg font-medium py-3 px-4 rounded-xl transition-colors block ${
                      isActive(item.path)
                        ? "text-white bg-white/10"
                        : "text-stone-300 hover:text-white hover:bg-stone-800/50"
                    }`}
                  >
                    {tr(item.label, lang)}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>,
        ]}
      </AnimatePresence>
    </nav>
  );
}

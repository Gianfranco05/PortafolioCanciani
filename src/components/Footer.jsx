import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MEDITATIONS_AUTHOR, randomQuote } from '../lib/quotes';

const footerLinks = [
  { to: "/", label: "Inicio" },
  { to: "/projects", label: "Proyectos" },
  { to: "/experience", label: "Experiencia" },
  { to: "/lab", label: "Lab" },
  { to: "/contact", label: "Contacto" },
];

const socialLinks = [
  { href: "https://github.com/Gianfranco05", icon: FaGithub, hoverClass: "hover:bg-stone-100 hover:text-stone-950", label: "GitHub" },
  { href: "https://www.linkedin.com/in/gianfranco-canciani-6a5189255", icon: FaLinkedin, hoverClass: "hover:bg-stone-100 hover:text-stone-950", label: "LinkedIn" },
  { href: "https://instagram.com/gianfranco.c05", icon: FaInstagram, hoverClass: "hover:bg-pink-600 hover:text-white", label: "Instagram" },
];

const COFFEE_LINES = [
  "compilando ideas...",
  "sin esto no hay commits.",
  "nivel de cafeína: óptimo.",
  "el código fluye mejor así.",
  "un bug menos gracias a este café.",
];

export default function Footer() {
  const year = new Date().getFullYear();
  const shouldReduceMotion = useReducedMotion();

  // Easter egg: 3 clicks rápidos en "GC." — cita de Meditaciones, Marco Aurelio
  const [quote, setQuote] = useState(null);
  const clickTimes = useRef([]);

  const handleBrandClick = () => {
    const now = Date.now();
    clickTimes.current = [...clickTimes.current.filter((t) => now - t < 700), now];
    if (clickTimes.current.length >= 3) {
      clickTimes.current = [];
      setQuote(randomQuote());
      setTimeout(() => setQuote(null), 6500);
    }
  };

  // Easter egg: taza de café — contador persistente en localStorage
  const [coffeeCount, setCoffeeCount] = useState(0);
  const [coffeeMsg, setCoffeeMsg] = useState(null);
  // Ref (no state) para bloquear clicks superpuestos: el estado tarda un render en
  // reflejarse, y varios taps muy rápidos podían colarse antes de que se actualice.
  const coffeeBusyRef = useRef(false);

  useEffect(() => {
    try {
      setCoffeeCount(parseInt(localStorage.getItem("coffeeCount") || "0", 10));
    } catch {
      // localStorage no disponible — el contador arranca en 0
    }
  }, []);

  const handleCoffeeClick = () => {
    if (coffeeBusyRef.current) return; // ya hay un mensaje activo — no se suma ni se superpone otro
    coffeeBusyRef.current = true;

    setCoffeeCount((c) => {
      const next = c + 1;
      try {
        localStorage.setItem("coffeeCount", String(next));
      } catch {
        // localStorage no disponible — el contador no persiste, no pasa nada
      }
      return next;
    });
    setCoffeeMsg(COFFEE_LINES[Math.floor(Math.random() * COFFEE_LINES.length)]);
    setTimeout(() => {
      setCoffeeMsg(null);
      coffeeBusyRef.current = false;
    }, 3800);
  };

  return (
    <footer className="bg-stone-900 border-t border-stone-800/80">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Marca */}
          <div>
            <motion.p
              onClick={handleBrandClick}
              whileHover={{ scale: 1.02 }}
              className="text-2xl font-bold text-white tracking-tight mb-2 inline-block cursor-default select-none"
            >
              GC<span className="text-stone-400">.</span>
            </motion.p>
            <p className="text-stone-400 text-sm leading-relaxed">
              Desarrollador de software y docente IT.
              <br />
              Mendoza, Argentina.
            </p>
          </div>

          {/* Navegación rápida */}
          <div>
            <h4 className="text-sm font-semibold text-stone-300 uppercase tracking-wider mb-4">
              Navegación
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <motion.li
                  key={link.to}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Link
                    to={link.to}
                    className="text-stone-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Redes */}
          <div>
            <h4 className="text-sm font-semibold text-stone-300 uppercase tracking-wider mb-4">
              Redes
            </h4>
            <div className="flex gap-4">
              {socialLinks.map(({ href, icon: Icon, hoverClass, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-9 h-9 bg-stone-800 rounded-lg flex items-center justify-center text-stone-400 transition-all ${hoverClass}`}
                  aria-label={label}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800/50 pt-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3">
          <p className="text-stone-500 text-xs order-2 sm:order-1">
            &copy; {year} Gianfranco Canciani. Todos los derechos reservados.
          </p>

          {/* Easter egg: taza de café — clic para sumar una */}
          <div className="relative order-1 sm:order-2">
            <button
              type="button"
              onClick={handleCoffeeClick}
              disabled={!!coffeeMsg}
              className={`flex items-center gap-1.5 transition-colors ${
                coffeeMsg ? "text-stone-300 cursor-default" : "text-stone-600 hover:text-stone-300"
              }`}
              aria-label="Invitame un café"
            >
              <span className="relative text-base leading-none">
                ☕
                <AnimatePresence>
                  {!shouldReduceMotion && coffeeMsg && (
                    <>
                      <motion.span
                        initial={{ opacity: 0.7, y: 0 }}
                        animate={{ opacity: 0, y: -14 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.1, ease: "easeOut" }}
                        className="absolute -top-1 left-1 text-[10px] pointer-events-none"
                      >
                        ~
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0.7, y: 0 }}
                        animate={{ opacity: 0, y: -18 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.3, ease: "easeOut", delay: 0.15 }}
                        className="absolute -top-1 left-2.5 text-[10px] pointer-events-none"
                      >
                        ~
                      </motion.span>
                    </>
                  )}
                </AnimatePresence>
              </span>
              <span className="text-[11px] tabular-nums">{coffeeCount}</span>
            </button>

            <AnimatePresence>
              {coffeeMsg && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-full right-0 mb-2 text-[11px] text-stone-300 whitespace-nowrap bg-stone-800 border border-stone-700 px-3 py-1.5 rounded-lg shadow-lg z-10"
                >
                  ☕ café #{coffeeCount} — {coffeeMsg}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Easter egg: 3 clics en "GC." — cita de Meditaciones, Marco Aurelio */}
      <AnimatePresence>
        {quote && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90vw] max-w-md px-6 py-5 rounded-2xl border border-stone-700 bg-stone-950/95 shadow-2xl text-center"
            role="status"
          >
            <p className="text-stone-100 italic leading-relaxed">&ldquo;{quote}&rdquo;</p>
            <p className="text-stone-500 text-xs mt-3 tracking-wide">— {MEDITATIONS_AUTHOR}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}

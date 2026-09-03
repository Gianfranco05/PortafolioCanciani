import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const KEY_SEQUENCE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
// Equivalente táctil para mobile: mismos 8 swipes direccionales + doble tap (b, a)
const SWIPE_SEQUENCE = ["up", "up", "down", "down", "left", "right", "left", "right"];
const SYMBOLS = ["🪙", "✨", "GF", "⚡"];

export default function KonamiEgg() {
  const shouldReduceMotion = useReducedMotion();
  const [active, setActive] = useState(false);

  const trigger = () => {
    setActive(true);
    setTimeout(() => setActive(false), 3200);
  };

  // Desktop: secuencia de teclas clásica
  useEffect(() => {
    let progress = 0;
    const handleKey = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expected = KEY_SEQUENCE[progress];
      if (key === expected) {
        progress += 1;
        if (progress === KEY_SEQUENCE.length) {
          progress = 0;
          trigger();
        }
      } else {
        progress = key === KEY_SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Mobile: swipe ↑↑↓↓←→←→ y después doble tap
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let swipeProgress = 0;
    let awaitingDoubleTap = false;
    let lastTapTime = 0;
    const SWIPE_THRESHOLD = 40;
    const TAP_THRESHOLD = 15;
    const DOUBLE_TAP_MS = 450;

    const reset = () => {
      swipeProgress = 0;
      awaitingDoubleTap = false;
    };

    const handleTouchStart = (e) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
    };

    const handleTouchEnd = (e) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (awaitingDoubleTap) {
        if (absDx < TAP_THRESHOLD && absDy < TAP_THRESHOLD) {
          const now = Date.now();
          if (now - lastTapTime < DOUBLE_TAP_MS) {
            reset();
            trigger();
            return;
          }
          lastTapTime = now;
        } else {
          reset();
        }
        return;
      }

      if (Math.max(absDx, absDy) < SWIPE_THRESHOLD) return;

      const dir = absDx > absDy ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";

      if (dir === SWIPE_SEQUENCE[swipeProgress]) {
        swipeProgress += 1;
        if (swipeProgress === SWIPE_SEQUENCE.length) {
          awaitingDoubleTap = true;
          lastTapTime = Date.now();
        }
      } else {
        swipeProgress = dir === SWIPE_SEQUENCE[0] ? 1 : 0;
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] pointer-events-none overflow-hidden bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
        >
          {!shouldReduceMotion &&
            Array.from({ length: 24 }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ y: -40, opacity: 1 }}
                animate={{ y: "110vh", rotate: 360 }}
                transition={{ duration: 2 + Math.random() * 1.2, ease: "linear", delay: Math.random() * 0.4 }}
                className="absolute text-2xl font-bold select-none text-stone-100"
                style={{ left: `${Math.random() * 100}vw` }}
              >
                {SYMBOLS[i % SYMBOLS.length]}
              </motion.span>
            ))}

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-8 py-5 rounded-2xl border border-stone-700 bg-stone-950/80"
          >
            <p className="text-xl md:text-3xl font-extrabold text-white">🎮 Konami Code activado</p>
            <p className="text-sm text-stone-400 mt-1">Sabía que alguien lo iba a probar.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

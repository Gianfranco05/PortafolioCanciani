// Curva de easing "expo-out" — sensación premium, snappy pero suave.
export const EASE = [0.16, 1, 0.3, 1];

export const fadeUp = (reduce, distance = 28) => ({
  hidden: reduce ? { opacity: 1 } : { opacity: 0, y: distance, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: reduce ? { duration: 0 } : { duration: 0.7, ease: EASE },
  },
});

export const staggerContainer = (reduce, stagger = 0.1, delayChildren = 0) => ({
  hidden: { opacity: reduce ? 1 : 0 },
  show: {
    opacity: 1,
    transition: reduce ? {} : { staggerChildren: stagger, delayChildren },
  },
});

// Glow radial que sigue al cursor — usar junto a la clase CSS "spotlight".
// Sin useState/ref: escribe directo las CSS vars sobre el elemento, así no re-renderiza React en cada mousemove.
export function handleSpotlightMove(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
}

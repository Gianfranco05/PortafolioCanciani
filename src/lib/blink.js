// Detección aproximada de parpadeo a partir de los blendshapes de MediaPipe
// (eyeBlinkLeft / eyeBlinkRight, 0 = abierto, 1 = cerrado). No es una medición médica.

// Histéresis: umbrales distintos para cerrar y abrir, así el ruido cerca de un
// único umbral no cuenta parpadeos falsos. El de cierre es alto a propósito: una
// sonrisa entrecierra los ojos y lleva eyeBlink a ~0.5–0.6 sin que haya parpadeo.
export const CLOSE_THRESHOLD = 0.7;
const OPEN_THRESHOLD = 0.4;

export function eyeClosureScore(blendshapes) {
  const categories = blendshapes?.categories;
  if (!categories) return null;
  const left = categories.find((c) => c.categoryName === "eyeBlinkLeft")?.score;
  const right = categories.find((c) => c.categoryName === "eyeBlinkRight")?.score;
  if (left == null || right == null) return null;
  return (left + right) / 2;
}

export function createBlinkTracker() {
  let closed = false;
  return {
    // Devuelve si el ojo está cerrado y si en este frame se completó un parpadeo (cerrado → abierto).
    update(score) {
      if (score == null) return { closed, blinked: false };
      if (!closed && score >= CLOSE_THRESHOLD) {
        closed = true;
        return { closed, blinked: false };
      }
      if (closed && score <= OPEN_THRESHOLD) {
        closed = false;
        return { closed, blinked: true };
      }
      return { closed, blinked: false };
    },
    reset() {
      closed = false;
    },
  };
}

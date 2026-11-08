import { lazy, Suspense, useCallback, useEffect, useState } from "react";

// La terminal se descarga recién cuando se abre por primera vez.
const HiddenTerminal = lazy(() => import("./HiddenTerminal"));

export const OPEN_TERMINAL_EVENT = "open-terminal";

function isEditable(el) {
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

// Escucha el atajo (tecla ` o escribir "help" fuera de un campo de texto) y el evento
// OPEN_TERMINAL_EVENT que dispara el botón del footer (para celular, sin teclado físico).
export default function TerminalHost() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    let typed = "";
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "`" || (e.key === "Dead" && e.code === "Backquote")) {
        if (isEditable(e.target) && !e.target.closest?.("[data-terminal]")) return;
        e.preventDefault();
        setOpen((o) => !o);
        typed = "";
        return;
      }
      if (isEditable(e.target)) {
        typed = "";
        return;
      }
      if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
        typed = (typed + e.key.toLowerCase()).slice(-4);
        if (typed === "help") {
          typed = "";
          setOpen(true);
        }
      } else {
        typed = "";
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_TERMINAL_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_TERMINAL_EVENT, onOpen);
    };
  }, []);

  if (!open) return null;
  return (
    <Suspense fallback={null}>
      <HiddenTerminal onClose={close} />
    </Suspense>
  );
}

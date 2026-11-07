import { useEffect } from "react";

const SITE = "Gianfranco Canciani";

// Título y descripción propios de cada página (los usa Google al renderizar la SPA
// y se ven en la pestaña). En el inicio (`home`) el nombre va primero.
export default function useDocumentMeta({ title, description, home = false }) {
  useEffect(() => {
    document.title = home ? `${SITE} — ${title}` : `${title} | ${SITE}`;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    }
  }, [title, description, home]);
}

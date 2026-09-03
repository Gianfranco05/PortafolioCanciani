## Context

El portafolio es una SPA con React 19 + Vite 7 + Tailwind CSS v4. Actualmente tiene 3 rutas estáticas con `BrowserRouter`, un Navbar fijo con scroll detection, y un diseño oscuro basado en slate/indigo. El cambio aborda 5 mejoras de pulido que no requieren nuevas dependencias ni cambios arquitectónicos profundos.

## Goals / Non-Goals

**Goals:**
- Reemplazar el favicon default de Vite por uno personalizado con la marca GF
- Agregar footer con información de copyright y redes sociales
- Resetear scroll al cambiar de ruta
- Optimizar carga de imágenes con lazy loading
- Manejar rutas inexistentes con página 404

**Non-Goals:**
- No se agregan nuevas funcionalidades (blog, filtros, etc.)
- No se modifican estilos existentes ni el sistema de diseño
- No se agregan dependencias externas
- No se toca la lógica de animaciones existente

## Decisions

### 1. Favicon: SVG inline en lugar de archivo externo
**Decisión**: Reemplazar el link a `/vite.svg` por un favicon SVG inline con el logo "GF".
**Por qué**: Un SVG inline evita un request HTTP adicional, escala a cualquier resolución, y es compatible con todos los navegadores modernos. Se usa un diseño minimalista con las iniciales GF y el degradado indigo-cyan existente.
**Alternativa considerada**: Generar .ico con múltiples resoluciones — excesivo para un portafolio personal.

### 2. Footer: Componente independiente con año dinámico
**Decisión**: Crear `Footer.jsx` como componente funcional que se renderiza en `App.jsx` después de `<Routes>`.
**Por qué**: El footer debe aparecer en todas las rutas. Renderizarlo en App garantiza consistencia. El año se obtiene con `new Date().getFullYear()` para no requerir actualización manual.
**Diseño**: Fondo slate-900 con borde superior sutil, 3 columnas en desktop (marca, links, redes).

### 3. Scroll to top: Hook personalizado + wrapper en App
**Decisión**: Crear hook `useScrollToTop` que escucha cambios en `useLocation()` y ejecuta `window.scrollTo(0, 0)`.
**Por qué**: Es el patrón React Router recomendado. Un hook es más limpio que un componente wrapper. No requiere dependencias.
**Alternativa considerada**: `<ScrollRestoration>` de React Router DOM v7 — existe pero tiene comportamiento inconsistente con animaciones. El hook es más predecible.

### 4. Lazy loading: `loading="lazy"` nativo del browser
**Decisión**: Agregar `loading="lazy"` a los `<img>` en `Projects.jsx`.
**Por qué**: Es soportado por todos los navegadores modernos, zero cost de implementación, y difiere la carga de imágenes fuera de viewport.
**Riesgo**: Mínimo — las imágenes de proyectos están debajo del fold de todas formas.

### 5. Página 404: Ruta catch-all con diseño consistente
**Decisión**: Crear `NotFound.jsx` y agregar `<Route path="*" element={<NotFound />}>` al final de las rutas.
**Por qué**: React Router renderiza el primer match, así que `path="*"` al final captura todo lo que no matcheó antes. El diseño sigue el mismo dark theme con un mensaje claro y botón de volver al inicio.

## Risks / Trade-offs

- **[Favicon]** Algunos browsers cachean el favicon agresivamente — puede requerir hard refresh o un cache-buster (`?v=2`) para verse.
- **[Scroll to top]** Si en el futuro se implementan transiciones de página con AnimatePresence, el scroll to top debe coordinarse con la animación de salida para evitar parpadeos.
- **[Footer]** Si el contenido de una página es muy corto, el footer puede quedar flotando a media altura. Solución opcional: `min-h-screen` en páginas (ya está implementado).

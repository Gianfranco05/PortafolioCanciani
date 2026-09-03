## Context

SPA con React 19 + Vite 7. 4 páginas, todas importadas estáticamente en `App.jsx`. Bundle único de producción: ~405KB JS (129KB gzipped). Datos de proyectos mezclados con lógica de presentación. Sin manejo de errores de renderizado. Sin datos estructurados para SEO.

## Goals / Non-Goals

**Goals:**
- Separar datos de proyectos en `src/data/projects.js`
- Code splitting por ruta con `React.lazy()` + `Suspense`
- Error Boundary que capture errores y muestre fallback
- JSON-LD Structured Data (Schema.org Person) en `index.html`

**Non-Goals:**
- No se cambian los datos de proyectos ni su estructura
- No se agregan nuevas dependencias
- No se modifican animaciones ni estilos
- No se toca la lógica de routing (BrowserRouter se mantiene)

## Decisions

### 1. Extracción de datos de proyectos
**Decisión**: Crear `src/data/projects.js` que exporta el array exactamente como está hoy.
**Por qué**: Es un refactor puro. No se toca ni una línea del componente Projects.jsx salvo el import. El archivo queda listo para que en el futuro los datos vengan de un API.
**Alternativa**: `src/data/` vs `src/constants/` — `data/` es más semántico (son datos, no constantes).

### 2. Lazy loading de rutas
**Decisión**: Usar `React.lazy(() => import("./pages/Home"))` para cada página. Envolver `<Routes>` con `<Suspense fallback={<Loading />}>`.
**Por qué**: 
- Vite code-splittea automáticamente los imports dinámicos en chunks separados
- React.lazy es el mecanismo nativo de React, sin dependencias externas
- Loading state mínimo (spinner simple) para no impactar UX

**Riesgo**: Framer Motion + AnimatePresence y lazy loading pueden tener conflictos si la página no está cargada cuando se intenta animar. Mitigación: `<Suspense>` va DENTRO de `<AnimatePresence>`.

### 3. Error Boundary
**Decisión**: Componente clase `ErrorBoundary` que envuelve `<AppContent>`. Muestra un mensaje amigable con botón "Recargar" que hace `window.location.reload()`.
**Por qué**: 
- React requiere componente clase para `componentDidCatch` — los hooks no tienen equivalente para error boundaries
- El botón de recarga es la recuperación más simple y confiable
- Se renderiza encima del layout (Navbar + Footer se mantienen)

**Riesgo**: Si el error está en App.jsx mismo, el ErrorBoundary no lo captura. Mitigación: poner el boundary dentro de Router pero envolviendo AppContent.

### 4. JSON-LD Structured Data
**Decisión**: Inyectar un bloque `<script type="application/ld+json">` en `<head>` de `index.html` con Schema.org `Person`.
**Por qué**: 
- JSON-LD es el formato recomendado por Google
- No requiere librerías — es JSON puro inline
- Mejora el rich snippet en resultados de búsqueda

**Campos a incluir**: name, givenName, jobTitle, description, url, sameAs (GitHub, LinkedIn, Instagram), knowsAbout (skills), address (Mendoza, Argentina).

## Risks / Trade-offs

- **[Lazy loading]** Cada ruta carga su chunk bajo demanda. En redes lentas, la primera navegación a Projects/Contact puede tener un pequeño delay (loading state). Mitigación: prefetch de la ruta más probable con `<link rel="prefetch">`.
- **[Error Boundary]** Solo captura errores en el árbol de componentes descendiente. Errores en event handlers, async code, o SSR no se capturan — habría que usar `window.onerror` como complemento.
- **[JSON-LD]** Si los datos del portafolio cambian (nuevas skills, etc.), el JSON-LD debe actualizarse manualmente. No hay sincronización automática.
- **[Refactor projects-data]** El import cambia pero los datos son idénticos. Riesgo mínimo — verificar con `npm run build`.

# AGENTS — mi-portafolio

## Descripción del Proyecto

Portafolio profesional de Gianfranco — desarrollador backend y docente IT radicado en Mendoza, Argentina. SPA construida con React 19 + Vite + Tailwind CSS v4. Muestra proyectos, experiencia, un Lab con demos interactivas y un formulario de contacto. Deploy en Vercel: https://portafolio-canciani.vercel.app

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| React | ^19.1.1 | UI Library |
| Vite | ^7.1.7 | Bundler / Dev Server |
| Tailwind CSS | ^4.1.16 | Utility-first CSS (vía Vite plugin) |
| React Router DOM | ^7.14.0 | Routing SPA (BrowserRouter) |
| Framer Motion | ^12.38.0 | Animaciones (entradas, scroll, stagger) |
| React Icons | ^5.6.0 | Iconos (Fa, Hi, Md en el núcleo; Lu solo en el Lab) |
| MediaPipe Tasks Vision | ^1.0.1 | Detección facial en el navegador (solo demo FaceTrack, import dinámico) |
| ESLint | ^9.36.0 | Linter con config plana |

## Scripts Disponibles

Requiere **Node 20.19+ o 22.12+** (lo exige Vite 7).

```bash
npm run dev      # Inicia servidor de desarrollo Vite
npm run build    # Build de producción
npm run preview  # Previsualiza el build localmente
npm run lint     # ESLint sobre todo el proyecto
```

## Estructura del Proyecto

```
mi-portafolio/
├── index.html                    # Entry point HTML (lang=es, SEO + OG + Twitter Cards + JSON-LD)
├── vite.config.js                # Config Vite + React + Tailwind plugin
├── eslint.config.js              # ESLint flat config (react/jsx-uses-vars)
├── package.json
├── AGENTS.md                     # ← Este archivo
├── CHANGES.md                    # Historial de cambios por fase
├── README.md
├── vercel.json                   # Rewrite de todas las rutas a index.html (SPA)
├── public/
│   ├── favicon.svg               # Favicon personalizado GC
│   ├── og-image.png              # Imagen para compartir (1200×630, PNG: LinkedIn/WhatsApp no leen SVG)
│   ├── robots.txt / sitemap.xml
│   ├── CV-Gianfranco-Canciani.pdf
│   └── images/                   # foto de perfil, portadas-logo SVG de cada proyecto (las tarjetas NO usan capturas) + capturas reales de SyncTune en images/synctune/ (galería del Lab)
└── src/
    ├── main.jsx                  # Entry point React (StrictMode + render)
    ├── App.jsx                   # Router + Layout (Navbar + Footer + ErrorBoundary + lazy routes)
    ├── index.css                 # @import "tailwindcss" + skip-link + scrollbar estilos
    ├── data/
    │   ├── projects.js           # 7 proyectos con datos reales
    │   ├── experience.js         # 2 roles de experiencia laboral
    │   ├── lab.js                # Demos del Lab (usado por Lab.jsx y Home.jsx)
    │   └── synctuneCatalog.js    # Catálogo de ejemplo + títulos para la demo de SyncTune
    ├── lib/
    │   ├── motion.js             # Easing, variantes y spotlight compartidos
    │   ├── faceLandmarker.js     # Carga diferida de MediaPipe (import dinámico + fallback GPU→CPU)
    │   ├── blink.js              # Detección de parpadeo con histéresis
    │   ├── synctuneMatcher.js    # Port del matching de SyncTune
    │   ├── siemEngine.js         # Port del motor de la tesis (IF + DBSCAN + reglas)
    │   ├── quotes.js / consoleEgg.js  # Easter eggs
    ├── components/
    │   ├── Navbar.jsx            # Navbar fijo con scroll detection + hamburger mobile
    │   ├── Footer.jsx            # Footer con año dinámico + links + redes sociales
    │   ├── ErrorBoundary.jsx     # Error Boundary (class component) con fallback UI
    │   ├── PageTransition.jsx    # Transiciones animadas entre rutas (AnimatePresence)
    │   ├── Loading.jsx           # Spinner para Suspense fallback
    │   ├── ScrollProgress.jsx    # Barra de progreso de scroll
    │   ├── KonamiEgg.jsx / WololoEgg.jsx  # Easter eggs
    │   └── useScrollToTop.js     # Custom hook: scroll to top al cambiar de ruta
    └── pages/
        ├── Home.jsx              # Hero + Skills Técnicas + Soft Skills + CV download
        ├── Projects.jsx          # Grid de 7 proyectos con animaciones stagger
        ├── Experience.jsx        # Timeline de experiencia laboral (docencia y tutoría)
        ├── Lab.jsx               # Índice de demos interactivas (datos en src/data/lab.js)
        ├── lab/FaceTrackDemo.jsx # Demo MediaPipe: landmarks, parpadeo, liveness (webcam o foto)
        ├── lab/SyncTuneDemo.jsx  # Port del matching de SyncTune (src/lib/synctuneMatcher.js)
        ├── lab/SiemDemo.jsx      # Port del motor de la tesis (src/lib/siemEngine.js)
        ├── Contact.jsx           # Formulario con validación React + Formspree + WhatsApp
        └── NotFound.jsx          # Página 404 con diseño consistente
```

## Arquitectura

```
src/main.jsx
  └── <StrictMode>
       └── <App />
            └── <BrowserRouter>
                 └── <AppContent />
                      ├── <SkipLink />              (accesibilidad: "Saltar al contenido principal")
                      ├── <Navbar />                (fixed, scroll-aware, hamburger mobile + overlay)
                      ├── <ErrorBoundary>           (captura errores de renderizado)
                      │    └── <AnimatePresence>    (transiciones entre rutas)
                      │         └── <Suspense fallback={<Loading />}>
                      │              └── <Routes>
                      │                   ├── "/"            → lazy(Home)
                      │                   ├── "/projects"    → lazy(Projects)
                      │                   ├── "/experience"  → lazy(Experience)
                      │                   ├── "/lab"         → lazy(Lab)
                      │                   ├── "/lab/facetrack" → lazy(FaceTrackDemo)
                      │                   ├── "/lab/synctune"  → lazy(SyncTuneDemo)
                      │                   ├── "/lab/siem"      → lazy(SiemDemo)
                      │                   ├── "/contact"     → lazy(Contact)
                      │                   └── "*"            → lazy(NotFound)  (404)
                      └── <Footer />               (año dinámico, navegación, redes sociales)
```

### Patrones Actuales

- **Routing**: `BrowserRouter` con 9 rutas. Code splitting con `React.lazy()` + `Suspense` (una chunk por página). Ruta comodín `*` para 404.
- **Lab / performance**: `@mediapipe/tasks-vision` se importa SOLO con `import()` dinámico dentro de `src/lib/faceLandmarker.js`, al iniciar la demo. WASM y modelo vienen de CDN en runtime. Nunca importarlo estáticamente: metería ~46 kB gzip en el bundle y dispararía descargas de ~7 MB.
- **Íconos en el Lab**: usar `react-icons/lu` (Lucide), NO `react-icons/fa`. El núcleo (Footer, ErrorBoundary) ya importa `fa`, así que cualquier ícono `Fa*` nuevo se empaqueta en el bundle principal y se carga en todas las páginas. `lu` queda en un chunk aparte que solo bajan las páginas del Lab.
- **Ports fieles**: `synctuneMatcher.js` y `siemEngine.js` replican el código de los proyectos originales (patrones, pesos, umbrales, hiperparámetros). Si cambia el original, actualizar el port; no "mejorarlo" por separado.
- **Estado**: `useState` + `useEffect` + custom hooks (`useScrollToTop`). Sin estado global, Context API, ni librerías externas.
- **Data flow**: Datos de proyectos en `src/data/projects.js` y de experiencia en `src/data/experience.js`, importados por `Projects.jsx` y `Experience.jsx` respectivamente. Sin llamadas API externas.
- **Estilos**: 100% Tailwind utility classes. CSS global solo en `index.css` (skip-link, scrollbar, body defaults).
- **Formulario**: Estado React con `useState` + validación client-side + estados `idle | loading | success | error`. Submit vía `fetch` a Formspree (ID: `xeedoklk`). Fallback con botón de WhatsApp.
- **Animaciones**: Framer Motion con `useReducedMotion` (respeta `prefers-reduced-motion`). `AnimatePresence` para transiciones entre rutas. Stagger children en grid de proyectos.
- **Accesibilidad**: Skip-link al contenido principal, `aria-label` en botones, `aria-expanded` en menú mobile, `loading="lazy"` en imágenes.
- **SEO**: Meta tags (description, keywords, OG, Twitter Cards) + JSON-LD Structured Data (Schema.org Person) en `index.html`.
- **Error handling**: `ErrorBoundary` (class component) con `getDerivedStateFromError` y `componentDidCatch`. Fallback UI con botón de recarga.
- **Performance**: Scroll listener con `{ passive: true }`, lazy loading de imágenes y rutas, body scroll lock en menú mobile abierto.

### Convenciones de Código

1. **Componentes**: Functional components con `export default function Nombre()`
2. **Archivos**: PascalCase para componentes (`Navbar.jsx`, `Home.jsx`)
3. **Imports**: Librerías externas primero, luego componentes locales. Sin separación con blank line.
4. **Export**: `export default` siempre. Sin named exports para componentes.
5. **JSX**: Atributos con comillas dobles. Self-closing tags cuando no hay children.
6. **Estado**: `useState` / `useEffect`. Custom hooks en `src/components/` cuando aportan reutilización (`useScrollToTop`).

### Reglas para Agentes

1. **NO** agregar TypeScript sin consultar — el proyecto usa JSX puro.
2. **NO** agregar estado global (Redux, Zustand, Context) sin justificación — no hay necesidad actual.
3. **NO** modificar el sistema de animación principal sin entender que Framer Motion es core del diseño visual.
4. **SEO**: Las meta-etiquetas deben agregarse en `index.html` (SSR no disponible).
5. **i18n**: El proyecto está en español. NO mezclar idiomas. El `lang` en HTML debe ser `es`.
6. **Placeholders**: Buscar `placeholder`, `tu-usuario`, `TU_ID_DE` antes de asumir que los datos son reales.
7. **Tailwind**: Usar siempre clases de Tailwind. NO agregar CSS manual salvo en `index.css` para estilos globales.
8. **Animaciones**: Respetar `prefers-reduced-motion` — los `motion` elements deben soportar `useReducedMotion`.
9. **Keys en listas**: NO usar índices de array como `key`. Usar identificadores únicos.
10. **Performance**: Event listeners deben usar `{ passive: true }` para scroll/wheel.
11. **Cross-browser**: Estilos WebKit deben tener equivalentes para Firefox (scrollbar, etc.).
12. **Imports**: Limpiar imports no utilizados antes de commitear.

### Próximos Pasos Conocidos (Backlog)

1. ✅ ~~Renombrar `Proyects.jsx` → `Projects.jsx` (fix typo)~~
2. ✅ ~~Limpiar dependencias muertas (`postcss`, `autoprefixer`, `@types/*`)~~
3. ✅ ~~Eliminar `App.css` y su import~~
4. ✅ ~~Arreglar ESLint para reconocer `motion.div`~~
5. ✅ ~~Agregar 2 nuevos proyectos (Ecommerce + SIEM ML)~~
6. ✅ ~~Agregar meta tags SEO (description, OG, Twitter Cards)~~
7. ✅ ~~Agregar `prefers-reduced-motion` en animaciones~~
8. ✅ ~~Agregar skip-link para accesibilidad~~
9. ✅ ~~Agregar estilos scrollbar para Firefox~~
10. ✅ ~~Agregar `passive: true` en scroll listener~~
11. ✅ ~~Reemplazar placeholders (email, GitHub, LinkedIn, imágenes)~~
12. ✅ ~~Agregar manejo de estado al formulario con validación + Formspree~~
13. ✅ ~~Extraer datos de proyectos a archivo separado~~
14. ✅ ~~Agregar App de Gestión Personal Integral (Web con repo; Mobile espera repo)~~
15. ✅ ~~Portadas~~: decisión del owner — las tarjetas usan logos SVG, no capturas. Capturas reales solo en el Lab (SyncTune)
16. ✅ ~~Actualizar `README.md` — quitar placeholder `tu-usuario` en clone URL~~
17. Repo pendiente: Gestión Personal Mobile
18. (Opcional) Tests automáticos para `synctuneMatcher`, `siemEngine` y `blink`

## Skills Relacionados

- **tailwind-design-system**: Para patrones de diseño con Tailwind CSS
- **judgment-day**: Para revisiones adversariales antes de merges
- **branch-pr**: Para creación de PRs siguiendo el flujo issue-first

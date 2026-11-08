# Mapa de Changes — mi-portafolio

> Mapa completo de correcciones y mejoras priorizadas para el portafolio.
> Organizado como cambios OPSX con dependencias, tareas y criterios de aceptación.

---

## ✅ Fase 1: Quick Wins — Correcciones Inmediatas (P0)

> Completada — todos los cambios aplicados y verificados.

### 1.1 fix/typo-proyects ✅

**Problema**: El archivo `src/pages/Proyects.jsx` tiene un typo — le falta la "j".

**Tareas**:
- [x] Renombrar `src/pages/Proyects.jsx` → `src/pages/Projects.jsx`
- [x] Actualizar import en `src/App.jsx`
- [x] Verificar que `npm run build` funciona

---

### 1.2 fix/deps-cleanup ✅

**Problema**: Dependencias muertas: `postcss`, `autoprefixer`, `@types/react`, `@types/react-dom`.

**Tareas**:
- [x] Eliminar `postcss`, `autoprefixer` de devDependencies
- [x] Eliminar `@types/react`, `@types/react-dom` de devDependencies
- [x] Eliminar `tailwind.config.cjs`
- [x] Eliminar `src/App.css` y su import en `src/main.jsx`
- [x] Ejecutar `npm run build` — OK

---

### 1.3 fix/lang-es ✅

**Problema**: `<html lang="en">` con contenido en español.

**Tareas**:
- [x] Cambiar `<html lang="en">` → `<html lang="es">`
- [x] Título descriptivo "Gianfranco — Portafolio | Backend Developer & Docente IT"

---

### 1.4 fix/eslint-motion ✅

**Problema**: Falsos positivos de `'motion' is defined but never used`.

**Tareas**:
- [x] Agregar `eslint-plugin-react` a devDependencies
- [x] Configurar `react/jsx-uses-vars` en `eslint.config.js`
- [x] `npm run lint` — 0 errores

---

## Fase 2: Contenido Real — Datos y SEO (P1)

Cambios que hacen que el sitio sea publicable.

### 2.1 fix/seo-meta-tags ✅

**Problema**: El `index.html` no tiene meta tags para SEO. Los crawlers ven un HTML casi vacío.

**Tareas**:
- [x] Agregar `<meta name="description">` con descripción del portafolio
- [x] Agregar `<meta name="keywords">` con tecnologías y rol
- [x] Agregar `<meta name="author">` y `<meta name="robots">`
- [x] Agregar Open Graph tags (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`)
- [x] Agregar Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`)
- [x] Agregar `<link rel="canonical">`
- [ ] Reemplazar favicon (`/vite.svg`) con uno personalizado

---

### 2.2 fix/placeholder-data

**Problema**: Múltiples placeholders en todo el proyecto: email, GitHub, LinkedIn, fotos, URLs de proyectos, Formspree ID.

**Tareas**:
- [ ] Reemplazar `tu-email@gmail.com` por el email real (6 ocurrencias en Home.jsx, Contact.jsx)
- [ ] Reemplazar `https://github.com/tu-usuario` por la URL real (Home.jsx, Contact.jsx, Proyects.jsx)
- [ ] Reemplazar `https://linkedin.com/in/tu-usuario` por la URL real (Home.jsx, Contact.jsx)
- [ ] Reemplazar `https://via.placeholder.com/400x400.png?text=Foto+Profesional` por foto real (Home.jsx)
- [ ] Reemplazar imágenes placeholder de proyectos por capturas reales (Proyects.jsx)
- [ ] Reemplazar URLs de repositorios (Proyects.jsx)
- [ ] Reemplazar `TU_ID_DE_FORMSPREE` por el ID real de Formspree (Contact.jsx)
- [ ] Reemplazar `https://tu-api.com/docs` por URL real si aplica (Proyects.jsx)

**Archivos afectados**:
- `src/pages/Home.jsx`
- `src/pages/Proyects.jsx`
- `src/pages/Contact.jsx`

---

## ✅ Fase 3: Accesibilidad y Cross-Browser (P1)

> Completada — todos los cambios aplicados y verificados.

### 3.1 feat/reduced-motion ✅

**Problema**: Animaciones no respetan `prefers-reduced-motion`.

**Tareas**:
- [x] Importar `useReducedMotion` de framer-motion en cada página
- [x] Condicionar animaciones: si reduce motion, omitir animaciones
- [x] `npm run build` — OK

---

### 3.2 feat/skip-link ✅

**Problema**: No hay enlace "Saltar al contenido principal" para navegación por teclado.

**Tareas**:
- [x] Agregar skip-link al inicio de `App.jsx` (primer elemento focusable)
- [x] Estilos del skip-link en `index.css`
- [x] Agregar `id="main-content"` en página principal de cada ruta

---

### 3.3 fix/scrollbar-firefox ✅

**Problema**: Estilos scrollbar solo para WebKit.

**Tareas**:
- [x] Agregar reglas Firefox (`scrollbar-width`, `scrollbar-color`)

---

### 3.4 fix/passive-listener ✅

**Problema**: Scroll listener sin `{ passive: true }`.

**Tareas**:
- [x] Agregar `{ passive: true }` al addEventListener en Navbar.jsx

---

## Fase 4: Refactor Técnico (P2)

### 4.1 refactor/projects-data

**Problema**: Los datos de proyectos están hardcodeados dentro del componente `Projects.jsx`. Esto mezcla lógica de datos con presentación y dificulta el mantenimiento.

**Tareas**:
- [ ] Crear `src/data/projects.js` con el array de proyectos exportado
- [ ] Importar datos en `Projects.jsx`
- [ ] Agregar `id` único a cada proyecto (uuid simple o slug)
- [ ] Usar `proj.id` como `key` en lugar del índice del array

**Archivos afectados**:
- `src/data/projects.js` (nuevo)
- `src/pages/Projects.jsx`

---

### 4.2 fix/keys-and-lists

**Problema**: Además del `key={idx}` en `Proyects.jsx` (cubierto en 4.1), hay otros patrones de listas que usan índices.

**Tareas**: (se resuelve con 4.1, verificar que no haya más usos de índice como key)

---

### 4.3 feat/form-validation ✅

**Problema**: El formulario de contacto usa submit nativo HTML a Formspree sin manejo de estado React ni validación del lado del cliente.

**Tareas**:
- [x] Agregar estado React para campos del formulario (name, email, message)
- [x] Implementar validación básica (email válido, campos no vacíos)
- [x] Mostrar mensajes de error inline
- [x] Mostrar estado de envío (enviando, éxito, error)
- [x] Conectar con Formspree real (ID: xeedoklk)

---

## Resumen de Prioridades

| Prioridad | Change | Esfuerzo | Estado |
|-----------|--------|----------|--------|
| P0 | fix/typo-proyects | 5 min | ✅ |
| P0 | fix/deps-cleanup | 10 min | ✅ |
| P0 | fix/lang-es | 2 min | ✅ |
| P0 | fix/eslint-motion | 10 min | ✅ |
| P1 | fix/seo-meta-tags | 15 min | ✅ |
| P1 | fix/placeholder-data | 20 min | ✅ |
| P1 | feat/reduced-motion | 15 min | ✅ |
| P1 | feat/skip-link | 10 min | ✅ |
| P1 | fix/scrollbar-firefox | 2 min | ✅ |
| P1 | fix/passive-listener | 2 min | ✅ |
| P1 | feat/add-projects | 10 min | ✅ 2 proyectos agregados |
| P2 | refactor/projects-data | 15 min | ✅ |
| P2 | feat/form-validation | 30 min | ✅ |

## ✅ Fase 5: Nivel 1 — Quick Wins de UX (P0)

> Completada — 5 mejoras de bajo esfuerzo aplicadas y verificadas.

### 5.1 feat/nivel1-mejoras ✅

**Problema**: El portafolio tenía favicon default de Vite, sin footer, sin scroll to top en navegación, imágenes sin lazy loading, y sin página 404.

**Tareas**:
- [x] Favicon personalizado GF con degradado indigo-cyan
- [x] Footer con año dinámico, links y redes sociales
- [x] Scroll to top automático al cambiar de ruta
- [x] `loading="lazy"` en todas las imágenes
- [x] Página 404 con diseño dark consistente

**Archivos nuevos**: `public/favicon.svg`, `src/components/Footer.jsx`, `src/pages/NotFound.jsx`, `src/components/useScrollToTop.js`

**Archivos modificados**: `index.html`, `src/App.jsx`, `src/pages/Projects.jsx`, `src/pages/Home.jsx`

---

## ✅ Fase 6: Nivel 2 — Mejoras de UX (P1)

> Completada — 4 mejoras de experiencia de usuario aplicadas y verificadas.

### 6.1 feat/nivel2-ux ✅

**Problema**: Navegación mobile no optimizada, sin opción de descargar CV, transiciones abruptas entre páginas, y proyectos sin links a demo.

**Tareas**:
- [x] Menú hamburguesa mobile con overlay animado y body scroll lock
- [x] Botón "Descargar CV" en Hero con placeholder PDF
- [x] Transiciones animadas entre rutas con AnimatePresence
- [x] Campo opcional `demoUrl` en proyectos con botón "Ver Demo"

**Archivos nuevos**: `src/components/PageTransition.jsx`, `public/CV-Gianfranco-Canciani.pdf`

**Archivos modificados**: `src/components/Navbar.jsx`, `src/pages/Home.jsx`, `src/pages/Projects.jsx`, `src/App.jsx`

---

## ✅ Fase 7: Nivel 3 — Arquitectura y Refactor (P2)

> Completada — 4 mejoras arquitectónicas aplicadas y verificadas.

### 7.1 feat/nivel3-arquitectura ✅

**Problema**: Datos hardcodeados en componentes, bundle único sin code splitting, sin manejo de errores de renderizado, sin datos estructurados para SEO.

**Tareas**:
- [x] Extraer datos de proyectos a `src/data/projects.js`
- [x] Lazy loading de rutas con `React.lazy()` + Suspense (5 chunks separados)
- [x] Error Boundary con fallback UI y botón de recarga
- [x] JSON-LD Structured Data (Schema.org Person)

**Archivos nuevos**: `src/data/projects.js`, `src/components/ErrorBoundary.jsx`, `src/components/Loading.jsx`

**Archivos modificados**: `src/pages/Projects.jsx`, `src/App.jsx`, `index.html`

**Métrica**: Bundle monolítico de 405KB → Core 383KB + chunks lazy de 1-11KB cada uno 🚀

---

## ✅ Fase 8: Correcciones de Documentación y Datos (P1)

> Completada — 5 cambios de corrección y actualización aplicados.

### 8.1 fix/footer-spa-links ✅

**Problema**: El `Footer.jsx` usaba `<a href>` para navegación interna (Inicio, Proyectos, Contacto) en vez de `<Link to>`. Cada clic en el footer causaba un full page reload, perdiendo el comportamiento SPA.

**Tareas**:
- [x] Importar `Link` de `react-router-dom` en Footer.jsx
- [x] Reemplazar `<a href={link.to}>` por `<Link to={link.to}>` en los 3 links de navegación
- [x] `npm run build` — OK

**Archivos afectados**: `src/components/Footer.jsx`

---

### 8.2 fix/datos-proyectos ✅

**Problema**: Las descripciones de los ecommerce no reflejaban el stack completo usado (Mercado Pago, WebSocket, JWT, PostgreSQL, Tailwind). Faltaba el proyecto "App de Gestión Personal Integral".

**Tareas**:
- [x] Actualizar Ecommerce Componentes PC: agregar PostgreSQL, Mercado Pago explícito
- [x] Actualizar Ecommerce Alimentos: agregar Tailwind, WebSocket, JWT, Mercado Pago
- [x] Agregar App de Gestión Personal Integral (FastAPI + React + TypeScript + PostgreSQL)
- [x] Refinar descripciones de SIEM (mención "Proyecto de tesis"), API FastAPI, Gestor CRUD, Detector Rostros
- [x] `npm run build` — OK

**Archivos afectados**: `src/data/projects.js`

---

### 8.3 feat/sdd-opsx-visibilidad ✅

**Problema**: La metodología SDD con flujo OPSX solo aparecía como un tag genérico en skills. No se comunicaba como parte central del approach de desarrollo.

**Tareas**:
- [x] Agregar mención en el párrafo Hero de Home.jsx
- [x] Agregar mención en la card "Desarrollo Fullstack"
- [x] Agregar SDD/OPSX en meta description del index.html
- [x] Agregar SDD/OPSX en JSON-LD knowsAbout
- [x] `npm run build` — OK

**Archivos afectados**: `src/pages/Home.jsx`, `index.html`

---

### 8.4 docs/agents-md-actualizacion ✅

**Problema**: `AGENTS.md` describía el estado INICIAL del proyecto (antes de las 3 fases de mejoras). Mencionaba "sin lazy loading", "datos hardcodeados", "sin Footer", "formulario sin estado React", etc. — todo falso en el estado actual.

**Tareas**:
- [x] Actualizar "Estructura del Proyecto" con todos los componentes y archivos reales
- [x] Reescribir "Arquitectura" con el árbol completo (SkipLink, Footer, ErrorBoundary, lazy routes, AnimatePresence)
- [x] Reescribir "Patrones Actuales" con 10 bullets del estado real
- [x] Eliminar sección duplicada de patrones viejos
- [x] Actualizar convenciones (item 6: custom hooks)
- [x] Marcar item 13 del backlog como completado
- [x] Agregar items 14-16 al backlog (imágenes, README)

**Archivos afectados**: `AGENTS.md`

---

### 8.5 docs/readme-actualizacion ✅

**Problema**: `README.md` mostraba estructura vieja, 3 rutas en vez de 4, features list desactualizada, y clone URL con placeholder `tu-usuario`.

**Tareas**:
- [x] Corregir clone URL (`tu-usuario` → `Gianfranco05`)
- [x] Actualizar estructura del proyecto con todos los archivos reales
- [x] Agregar ruta 404 a la tabla de rutas
- [x] Reescribir features con las 13 capacidades reales
- [x] Agregar mención SDD/OPSX en la descripción

**Archivos afectados**: `README.md`

---

## ✅ Fase 9: Pulido y Corrección de Bugs Críticos (P0)

> Completada — se detectó que las imágenes de proyectos y los links a repos estaban rotos en producción.

### 9.1 fix/project-cover-images ✅

**Problema**: `src/data/projects.js` apuntaba a `/images/*.jpg` que nunca existieron en `public/images/` (solo estaba `foto-perfil.jpg`). Los 7 proyectos mostraban el ícono de imagen rota.

**Tareas**:
- [x] Generar 7 covers SVG con gradiente de marca (indigo/cyan/emerald/etc.) e ícono representativo por proyecto
- [x] Guardar en `public/images/<id>.svg`
- [x] Actualizar `src/data/projects.js` para apuntar a los `.svg`
- [x] Verificar visualmente en `/projects` — sin imágenes rotas

**Archivos afectados**: `src/data/projects.js`, `public/images/*.svg` (nuevos)

---

### 9.2 fix/seo-assets ✅

**Problema**: Faltaban `robots.txt`, `sitemap.xml` y el archivo real de `og:image` (el meta tag apuntaba a `og-image.png`, inexistente).

**Tareas**:
- [x] Crear `public/robots.txt`
- [x] Crear `public/sitemap.xml` con las 3 rutas públicas
- [x] Generar `public/og-image.svg` con el mismo lenguaje visual del sitio
- [x] Actualizar `og:image` / `twitter:image` en `index.html` para apuntar al archivo real

**Archivos afectados**: `public/robots.txt`, `public/sitemap.xml`, `public/og-image.svg` (nuevos), `index.html`

---

### 9.3 fix/repo-links-rotos ✅ (5 de 6 resueltos)

**Problema**: Los `repoUrl` en `src/data/projects.js` eran placeholders que devolvían 404.

**Tareas**:
- [x] `ecommerce-alimentos` → `FoodStore_SDD_Canciani` (200)
- [x] `siem-ml` → `Tesis_SiemInteligenteMachineLearning_Canciani` (200)
- [x] `detector-rostros` → `reconocimiento_facial` (200)
- [x] `gestion-personal` → `AgendaPersonalWeb` (200)
- [x] `ecommerce-componentes`: tiene 2 repos (front/back) — se cambió `repoUrl` por `repos: [{label, url}]` y `Projects.jsx` ahora renderiza un botón por repo cuando ese campo existe. Frontend → `EcommercePetaByte` (200). Backend → `E-commerce_Back` (era privado, el owner lo hizo público — 200)
- [x] `gestor-crud` (Java CRUD consola) — reemplazado por completo, ver 9.4

**Archivos afectados**: `src/data/projects.js`, `src/pages/Projects.jsx`

---

### 9.4 feat/split-gestion-personal-web-mobile ✅

**Problema**: "Gestor CRUD Persistente" salió del portafolio (a pedido del owner) y se reemplazó por la App de Gestión Personal Integral — pero ahora como 2 proyectos separados: versión Web y versión Mobile (React Native + Expo), en vez de uno solo.

**Tareas**:
- [x] Eliminar `gestor-crud` de `src/data/projects.js`
- [x] Borrar cover huérfana `public/images/java-crud.svg`
- [x] Split de `gestion-personal` → `gestion-personal-web` (FastAPI + React + TS + Tailwind, sin repo aún) y `gestion-personal-mobile` (React Native + Expo + FastAPI, repo: `AgendaPersonalWeb` — es la versión mobile pese al nombre del repo)
- [x] Nuevas covers SVG: `gestion-personal-web.svg` (ícono monitor) y `gestion-personal-mobile.svg` (ícono celular), reemplazando la cover única `gestion-personal.svg`
- [x] `Projects.jsx`: agregado un tercer estado para el botón de repo — badge "Repo próximamente" (disabled, sin link) cuando un proyecto no tiene ni `repoUrl` ni `repos` todavía, para no mostrar una card rota mientras no está el repo de la versión web
- [x] `npm run lint` y `npm run build` — OK, verificado en navegador (las 2 cards, tags y el badge "Repo próximamente")

**Corrección**: el owner aclaró que `AgendaPersonalWeb` es en realidad la versión **Web** (la mobile todavía no está subida a GitHub) — quedó al revés en la primera pasada. Se movió el `repoUrl` de `gestion-personal-mobile` a `gestion-personal-web`; la card mobile ahora es la que muestra "Repo próximamente".

**Pendiente**: falta la URL del repo de la versión **Mobile** (React Native + Expo) cuando se suba a GitHub.

**Archivos nuevos**: `public/images/gestion-personal-web.svg`, `public/images/gestion-personal-mobile.svg`

**Archivos afectados**: `src/data/projects.js`, `src/pages/Projects.jsx` — **eliminados**: `public/images/java-crud.svg`, `public/images/gestion-personal.svg`

---

### 9.5 fix/deploy-y-branding ✅

**Problema**: Preparación para el primer deploy en Vercel + pedido de cambiar las iniciales de marca de "GF" a "GC".

**Tareas**:
- [x] Agregado `vercel.json` con rewrite catch-all a `index.html` — sin esto, entrar directo a `/projects`, `/experience` o `/contact` en producción tira 404 (React Router es client-side, Vercel no lo sabe resolver solo)
- [x] Reemplazadas todas las apariciones de "GF" por "GC" (logo del Navbar, logo del Footer, moneda del easter egg de la foto, confeti del Konami Code, favicon)
- [x] Favicon: `?v=2` → `?v=3` en `index.html` para forzar refresh de caché del navegador
- [x] `npm run lint` y `npm run build` — OK, verificado en navegador que el Navbar dice "GC."

**Archivos nuevos**: `vercel.json`

**Archivos afectados**: `src/components/Navbar.jsx`, `src/components/Footer.jsx`, `src/components/KonamiEgg.jsx`, `src/pages/Home.jsx`, `public/favicon.svg`, `index.html`, `AGENTS.md`

---

### 9.6 fix/dominio-vercel ✅

**Problema**: `index.html` (canonical, Open Graph, JSON-LD) y `public/sitemap.xml`/`public/robots.txt` tenían hardcodeado `gianfranco.dev`, un dominio que el owner todavía no compró.

**Tareas**:
- [x] Reemplazado `gianfranco.dev` → `portafolio-canciani.vercel.app` en las 4 URLs de `index.html` (canonical, og:url, og:image, JSON-LD url), `robots.txt` y las 4 URLs de `sitemap.xml`
- [x] `npm run lint` y `npm run build` — OK

**Nota**: cuando compre un dominio propio, hay que volver a este mismo find-and-replace con el dominio nuevo.

**Archivos afectados**: `index.html`, `public/robots.txt`, `public/sitemap.xml`

---

### 9.7 fix/mobile-menu-y-cafe ✅

**Problema**: Reporte del owner probando desde el celular real — el menú hamburguesa "se buguea" al abrir/cerrar, y el mensaje de la taza de café queda tapado por el texto del footer.

**Causas encontradas**:
1. El overlay + panel del menú mobile estaban envueltos en un `<>Fragment</>` como hijo de `AnimatePresence` sin `key` individual — patrón que rompe la animación de salida (un gotcha conocido de Framer Motion).
2. `document.body.style.overflow = "hidden"` no alcanza para bloquear el scroll en iOS/Android: el fondo se sigue moviendo/rebotando detrás del menú abierto.
3. El panel usaba `h-full` (`height: 100%`), que en mobile con barra de direcciones dinámica (Chrome/Safari) puede saltar de tamaño.
4. El mensaje del café estaba con `position: absolute` hacia **abajo** del botón (`top-6`), y en mobile el layout se apila en columna con el copyright justo debajo — quedaban pisados.
5. `<nav>` estaba en `z-50`, igual o por debajo del `ScrollProgress` (`z-[60]`), que podía asomarse por encima del panel del menú abierto.

**Tareas**:
- [x] Backdrop y panel ahora son hijos directos de `AnimatePresence` con `key="backdrop"`/`key="panel"` (array, sin Fragment)
- [x] Scroll-lock robusto: fija el `body` en `position: fixed` con el `top` en el scroll actual, y lo restaura (incluyendo `window.scrollTo`) al cerrar
- [x] `h-full` → `h-dvh` (dynamic viewport height) en el panel
- [x] Mensaje del café: de `top-6` (abajo, se solapaba) a `bottom-full mb-2` (arriba del botón, con fondo propio) — nunca más choca con el copyright
- [x] `<nav>`: `z-50` → `z-[70]`, por encima del `ScrollProgress`
- [x] Verificado por DOM/JS (el pane de pruebas se background-ea y frena `requestAnimationFrame`, así que la animación se confirmó por el valor de `transform` avanzando, no por captura visual continua): el menú abre y cierra, el `body` vuelve a `static` con el scroll restaurado, y el mensaje del café no se superpone al copyright
- [x] `npm run lint` y `npm run build` — OK

**Archivos afectados**: `src/components/Navbar.jsx`, `src/components/Footer.jsx`

---

### 9.8 fix/contacto-icono-y-cafe-doble-tap ✅

**Problema**: Segundo reporte probando desde el celular — el ícono de correo en Contacto se ve angosto/aplastado, y el mensaje del café dura muy poco y se puede disparar varias veces seguidas superponiéndose.

**Causas encontradas**:
1. El círculo del ícono (`w-12 h-12`) no tenía `shrink-0` — al ser un item flex sin ancho protegido, el email largo (`gianfrancocanciani@gmail.com`) lo empujaba y lo aplastaba en vez de hacer wrap.
2. El guard para evitar doble-tap en el café (`if (coffeeMsg) return`) leía **estado de React**, que tarda un render en actualizarse — varios taps muy rápidos (antes de que React llegue a re-renderizar) pasaban igual el guard y se sumaban todos.

**Tareas**:
- [x] `shrink-0` en el círculo del ícono + `min-w-0 break-words` en el texto, para que el email haga wrap a 2 líneas en vez de aplastar el ícono
- [x] Guard del café movido a un `useRef` (`coffeeBusyRef`) en vez de leer el estado — se actualiza al instante, así que ni 5 clicks pegados uno atrás del otro se cuelan (probado: 5 clicks seguidos = +1 solo)
- [x] Duración del mensaje: `2400ms` → `3800ms`
- [x] Botón queda `disabled` (con estilo distinto) mientras el mensaje está activo, y se reactiva justo cuando termina
- [x] Verificado con clicks simulados: 5 taps rápidos solo suman 1 café, el botón se reactiva a los ~3.8s, y el mensaje queda en `opacity: 0` (invisible) al terminar
- [x] `npm run lint` y `npm run build` — OK

**Archivos afectados**: `src/pages/Contact.jsx`, `src/components/Footer.jsx`

---

### 9.9 feat/synctune-y-facetrack ✅

**Problema**: Sumar el proyecto nuevo de YouTube ⇄ Spotify y actualizar el de reconocimiento facial, que evolucionó a FaceTrack.

**Tareas**:
- [x] Nuevo proyecto **SyncTune** (primero en la grilla): FastAPI + React/TS + PostgreSQL, OAuth de Spotify y Google, tokens cifrados, matching con nivel de confianza. Datos tomados del README real en `C:\Proyectos\proyecto_YTySpoty`. Todavía sin repo remoto → badge "Repo próximamente"
- [x] Portada nueva `public/images/synctune.svg` (ícono de sincronización + play)
- [x] "Detector de Rostros con Python" → **FaceTrack — Reconocimiento Facial**: descripción y stack actualizados. Se chequeó el repo local antes de escribirla: solo se listan funcionalidades ya implementadas (reconocimiento, personas/embeddings, asistencia con cooldown, historial, estadísticas, landmarks, liveness básico); auth JWT y Docker siguen pendientes y no se mencionan. Mismo repo: `reconocimiento_facial`
- [x] Texto de la portada `detector-rostros.svg` actualizado a "FaceTrack / Reconocimiento Facial"
- [x] Conteo de proyectos 6 → 7 en `README.md` y `AGENTS.md`
- [x] `npm run lint` y `npm run build` — OK, verificado en navegador

**Pendiente**: URL del repo de SyncTune cuando se suba a GitHub.

**Archivos nuevos**: `public/images/synctune.svg`

**Archivos afectados**: `src/data/projects.js`, `public/images/detector-rostros.svg`, `README.md`, `AGENTS.md`

---

### 9.10 feat/lab-facetrack ✅

**Problema**: Pedido del owner de que el portafolio sea un "hub" donde se puedan probar los proyectos. Se eligió una sección **Lab** con demos, empezando por FaceTrack (la única que puede ser 100% real sin backend). Condición explícita: **no hacer más lento el resto del portafolio**.

**Tareas**:
- [x] `/lab`: índice de demos (FaceTrack disponible, SyncTune y SIEM como "Próximamente"). Datos en `src/data/lab.js`
- [x] `/lab/facetrack`: webcam en vivo o subida de foto → detección de hasta 4 rostros, malla de 478 landmarks, recuadro por rostro, estado de ojos, contador de parpadeos, FPS, desafío de liveness (2 parpadeos en 10 s → LIVE / UNKNOWN) y un panel de pipeline paso a paso. Aviso de privacidad y bloque "qué es real / qué queda en el proyecto completo"
- [x] `src/lib/faceLandmarker.js`: carga diferida con `import()` dinámico + promesa cacheada; GPU con fallback automático a CPU; reintento si falla la red
- [x] `src/lib/blink.js`: detección de parpadeo por blendshapes con histéresis (cerrar ≥ 0.7, abrir ≤ 0.4)
- [x] Link "Lab" en Navbar y Footer; `isActive` ahora marca "Lab" también en subrutas (`/lab/facetrack`)
- [x] Card de FaceTrack en Proyectos: botón "Probar demo" (link interno con `Link`; los `demoUrl` externos siguen abriendo en pestaña nueva)
- [x] Sitemap: `/lab` y `/lab/facetrack`
- [x] Dependencia nueva: `@mediapipe/tasks-vision@1.0.1`

**Performance (medido con `npm run build`)**:
| | Antes | Después |
|---|---|---|
| Bundle principal (gzip) | 131.15 kB | 132.13 kB (+1 kB: rutas y links nuevos) |
| CSS (gzip) | 8.31 kB | 8.58 kB |
| MediaPipe | — | chunk propio `vision_bundle` (46 kB gzip) + WASM ~3 MB + modelo ~3.7 MB desde CDN |

`index.html` solo referencia el bundle principal y el CSS; `vision_bundle` se importa exclusivamente dentro de `loadFaceLandmarker()`, que corre al tocar "Iniciar cámara" / "Subir foto". Verificado en el navegador: la home, `/lab` y `/lab/facetrack` no hacen ninguna request de MediaPipe hasta ese click.

**Bugs encontrados y corregidos durante la prueba**:
- Con umbral de parpadeo 0.5, una foto sonriendo daba "ojos cerrados": la sonrisa sube `eyeBlink` a ~0.5–0.6 (medido: 0.51 / 0.63). Se subió el umbral y se agregó histéresis; probado con secuencias simuladas (parpadeo real, doble parpadeo, sonrisa, ruido, sin datos): 5/5 correctos.
- El loop leía `stats.fps` de un closure viejo: movido a la ref.

**Verificado**: modo foto de punta a punta en el navegador (1 rostro, 478 landmarks, 52 blendshapes, recuadro sobre la cara, ojos "abierto"; segunda carga 0.4 s por caché). **No verificado acá**: el modo webcam (el navegador de pruebas no tiene cámara) — probar en un equipo real y en celular.

**Archivos nuevos**: `src/pages/Lab.jsx`, `src/pages/lab/FaceTrackDemo.jsx`, `src/lib/faceLandmarker.js`, `src/lib/blink.js`, `src/data/lab.js`

**Archivos afectados**: `src/App.jsx`, `src/components/Navbar.jsx`, `src/components/Footer.jsx`, `src/pages/Projects.jsx`, `src/data/projects.js`, `public/sitemap.xml`, `package.json`, `package-lock.json`, `README.md`, `AGENTS.md`

---

### 9.11 feat/lab-completo ✅

**Problema**: El Lab tenía 2 de 3 demos en "Próximamente", y el modo webcam de FaceTrack nunca se había probado.

**Tareas**:
- [x] **Demo SyncTune** (`/lab/synctune`): port a JS de `matching_service.py` (limpieza de título, artista/canción, versión, queries, score 40/40/10/10, niveles alta/media/baja). `difflib.SequenceMatcher.ratio()` reimplementado (Ratcliff/Obershelp). **Verificado contra el Python original: puntajes idénticos en 7 casos.** Catálogo de ejemplo con varias versiones de cada canción; los 5 ejemplos eligen la versión correcta
- [x] **Demo SIEM** (`/lab/siem`): port de `motor_ml.py` + formato de logs de `simulador_ataques.py`: 7 features, StandardScaler, Isolation Forest (100 árboles, contamination 0.18), DBSCAN (eps 1.5, min 3), reglas de ráfaga (≥5) y movimiento lateral (≥3 hosts), fusión OR. Toggle de RU-1/2/3/6, gráfico por evento, métricas. **101 corridas del escenario de la tesis: recall 100% en todas, F1 mediano 0.83 (0.65–0.89).** ~12 ms por análisis
- [x] FaceTrack **modo webcam probado** con una cámara simulada (stream desde la foto de perfil): 1 rostro, ~12 FPS, pipeline completo, desafío de liveness → UNKNOWN ante foto estática (correcto), "Detener" libera la cámara
- [x] Links "Probar demo" en las cards de SyncTune y SIEM; sitemap con las 2 rutas nuevas

**Bugs encontrados y corregidos**:
- FaceTrack: el canvas de la malla se estiraba a la altura mínima del visor (280 px) y no a la del video → en celular (video de ~257 px de alto) la malla quedaba **desalineada**. Ahora video y canvas van en un wrapper del tamaño exacto del video (medido: 724×543 ambos). Fotos verticales limitadas a 70vh
- Íconos: los `Fa*` nuevos del Lab inflaban el bundle principal (132.1 → 133.0 kB gzip) porque `react-icons/fa` ya vive ahí. Pasados a `react-icons/lu` → chunk aparte de 0.8 kB; bundle principal **131.54 kB (+0.39 kB vs. antes del Lab)**
- SIEM: la ventana inicial (semilla 7) era casi el peor caso (F1 0.67). Se usa la semilla de F1 **mediano** (18) para que la primera impresión sea representativa, no la mejor
- SyncTune: label de duración inline; ejemplo inicial cambiado (ver abajo)
- `siemEngine`: shuffle sesgado (`sort(() => rng()-0.5)`) → Fisher-Yates

**Limitaciones del algoritmo original de SyncTune** (detectadas al comparar; el port las replica a propósito): "(Official Video Remastered)" deja un `( )` colgado en el título limpio, y "letra" sin paréntesis no se elimina. Arreglarlas en SyncTune y luego actualizar el port.

**Verificado en mobile (375 px)**: `/lab`, `/lab/facetrack`, `/lab/synctune`, `/lab/siem` sin desborde horizontal.

**Archivos nuevos**: `src/pages/lab/SyncTuneDemo.jsx`, `src/pages/lab/SiemDemo.jsx`, `src/lib/synctuneMatcher.js`, `src/lib/siemEngine.js`, `src/data/synctuneCatalog.js`

**Archivos afectados**: `src/App.jsx`, `src/data/lab.js`, `src/data/projects.js`, `src/pages/Lab.jsx`, `src/pages/lab/FaceTrackDemo.jsx`, `public/sitemap.xml`, `README.md`, `AGENTS.md`

---

### 9.12 feat/og-png-home-lab-capturas ✅

**Problema**: (1) `og:image` era SVG, que LinkedIn/WhatsApp/Facebook no muestran → el link compartido salía sin imagen. (2) La home no mencionaba el Lab. (3) Portadas de proyectos generadas, sin capturas reales.

**Tareas**:
- [x] `public/og-image.png` 1200×630 (219 KB) generado con Pillow: misma paleta y tipografía (Segoe UI), + foto de perfil en círculo y nombre completo. Verificada separación nombre/foto (100 px). Borrado `og-image.svg`
- [x] `index.html`: `og:image`/`twitter:image` → PNG, + `og:image:width/height/alt`. Título con nombre completo y descripción que menciona las demos en vivo
- [x] Home: bloque "Probá mis proyectos en vivo" entre el hero y Especialidades, con las 3 demos (datos de `src/data/lab.js`). Solo usa `HiOutlineArrowRight`, ya presente en el núcleo → bundle principal sin cambios (131.58 kB)
- [x] Tagline de FaceTrack acortado ("Visión artificial en vivo") para que las 3 tarjetas queden alineadas
- [x] **Captura real** de FaceTrack (`docs/capturas/dashboard.png` del repo local) → `public/images/facetrack-dashboard.jpg` (960×600, 44 KB). Borrada la portada SVG vieja. Card con `object-top` para no cortar el encabezado
- [x] FaceTrack movido al primer lugar de Proyectos (tiene captura real, repo y demo)
- [x] Botones de las cards con `whitespace-nowrap`: "Probar demo"/"Repo próximamente" ya no se parten en dos líneas
- [x] Verificado en navegador (desktop + home a 375 px sin desborde)

**Pendiente**: capturas reales del resto de los proyectos — no hay imágenes en sus carpetas locales; las tiene que pasar el owner.

**Archivos nuevos**: `public/og-image.png`, `public/images/facetrack-dashboard.jpg` — **eliminados**: `public/og-image.svg`, `public/images/detector-rostros.svg`

**Archivos afectados**: `index.html`, `src/pages/Home.jsx`, `src/pages/Projects.jsx`, `src/data/projects.js`, `src/data/lab.js`

---

### 9.13 fix/seguridad-docs-limpieza ✅

**Problema**: `npm audit` reportaba 7 vulnerabilidades altas en dependencias de producción; README con datos incorrectos; archivo muerto de la plantilla.

**Tareas**:
- [x] `npm audit fix` (sin cambios de versión mayor): vite 7.1.12 → 7.3.6, react-router 7.14.0 → 7.18.4, más rollup/postcss/picomatch/nanoid → **0 vulnerabilidades**. Solo cambió `package-lock.json`. Verificado: lint, build, rutas directas, navegación con `<Link>` y 404
- [x] README reescrito: URL de clonado corregida (`mi-portafolio.git` → `PortafolioCanciani.git`, la vieja daba error), quitada la mención falsa a "Server Components y Actions", **Node ≥ 18 → 20.19+ / 22.12+** (Vite 7 no corre en Node 18), agregados MediaPipe, el Lab, deploy y link al sitio en vivo. Easter eggs mencionados sin spoilers
- [x] AGENTS.md: stack (MediaPipe, Lucide), requisito de Node, estructura con `lib/`, `data/lab.js`, `vercel.json`, `og-image.png`; backlog actualizado
- [x] Borrado `src/assets/react.svg` (resto de la plantilla de Vite, sin uso)

**Archivos afectados**: `package-lock.json`, `README.md`, `AGENTS.md`, `CHANGES.md` — **eliminado**: `src/assets/react.svg`

---

### 9.14 feat/synctune-rediseno ✅

**Problema**: SyncTune rediseñó su interfaz (oscura con acento verde #1db954, header fijo con pestañas, tarjetas, badges de confianza, Conexiones, responsive) y el portafolio mostraba una portada genérica y una descripción vieja.

**Tareas**:
- [x] Capturas reales de la interfaz con **datos de ejemplo**: el frontend de SyncTune corrió contra una API falsa (sin login, sin cuentas reales, sin tocar el repo de SyncTune). Carátulas generadas, artistas ficticios, "Usuario demo"
- [x] Tarjetas de Proyectos: todas usan portada-logo SVG (sin capturas). FaceTrack vuelve a logo (`facetrack.svg`, basado en el viejo `detector-rostros.svg` con el nombre nuevo); SyncTune mantiene `synctune.svg`
- [x] Link al repo de SyncTune: `https://github.com/Gianfranco05/SyncTune_v1`
- [x] Descripción y stack actualizados en `src/data/projects.js` (importar canción/playlist, confianza alta/media/baja, duplicados, confirmación, historial, dashboard, Conexiones, herramientas de playlists, Ctrl+K, modos, tema claro/oscuro; OAuth2 solo lectura, Fernet, 132 tests).
- [x] Sección "La app real" en `/lab/synctune` con 6 capturas (bienvenida, importar canción, importar playlist, dashboard, conexiones, responsive 375 px): WebP de 15–47 KB, `loading="lazy"`, solo se descargan en esa página
- [x] Badge de confianza "baja" de la demo en rojo, igual que en la app

**Archivos afectados**: `src/data/projects.js`, `src/pages/lab/SyncTuneDemo.jsx`, `AGENTS.md`, `CHANGES.md` — **nuevos**: `public/images/synctune/*.webp` (6 capturas para el Lab), `public/images/facetrack.svg`

---

## ✅ Fase 10: Animaciones y Estética Premium (P1)

> Completada — refinamiento del lenguaje de motion para una estética más elegante y profesional.

### 10.1 feat/motion-premium ✅

**Problema**: Las animaciones eran funcionales pero genéricas (`easeOut` estándar, sin profundidad, sin micro-interacciones distintivas). El pedido fue una estética "elegante y profesional".

**Tareas**:
- [x] Curva de easing propia tipo "expo-out" (`EASE = [0.16, 1, 0.3, 1]`) aplicada a transiciones de sección en todas las páginas, reemplazando `easeOut`/duraciones sueltas
- [x] Reveal con blur-in (`opacity + y + filter:blur`) en vez de solo fade+slide, para más profundidad
- [x] Barra de progreso de scroll (`ScrollProgress.jsx`) con gradiente indigo→cyan fija arriba de todo, usando `useScroll` + `useSpring`
- [x] Spotlight cursor-aware: glow radial que sigue al mouse sobre cards (proyectos, especialidades, skills, soft skills, panel de contacto) vía CSS vars (`--x`/`--y`), sin re-renders de React
- [x] Shine sweep en botones primarios (CTA hero, submit, WhatsApp, demo/repo, 404) — barrido de luz diagonal al hover
- [x] Segundo blob de fondo con rotación lenta detrás de la foto de perfil (parallax sutil)
- [x] Indicador de tab activo del Navbar con gradiente y spring más suave
- [x] Spinner de carga rediseñado (doble anillo con gradiente + pulso) en vez del spinner genérico
- [x] Textura de grain sutil (SVG feTurbulence, opacity 3.5%, mix-blend overlay) para profundidad editorial
- [x] Transición entre rutas con blur + easing premium (`PageTransition.jsx`)
- [x] Todos los efectos respetan `prefers-reduced-motion` (variantes reducidas o `display:none` en el shine)
- [x] `npm run lint` y `npm run build` — OK

**Archivos nuevos**: `src/lib/motion.js`, `src/components/ScrollProgress.jsx`

**Archivos afectados**: `src/index.css`, `src/App.jsx`, `src/components/Navbar.jsx`, `src/components/Loading.jsx`, `src/components/PageTransition.jsx`, `src/pages/Home.jsx`, `src/pages/Projects.jsx`, `src/pages/Contact.jsx`, `src/pages/NotFound.jsx`

---

### 10.2 feat/paleta-monocromatica ✅

**Problema**: La paleta indigo/cyan (azul) no era la que quería el owner. Pidió negro, blanco, plateado y crema.

**Tareas**:
- [x] Reemplazar `slate` (gris azulado) por `stone` (gris cálido) en todo el proyecto — fondo, bordes, texto secundario
- [x] Reemplazar todos los `indigo`/`cyan` por blanco/plateado (`stone-100`–`stone-400`) o gradientes plata→blanco
- [x] Invertir los botones primarios (CTA hero, submit del form, "Ver Demo", 404, ErrorBoundary) a fondo crema/blanco con texto negro — look "premium" de marca de lujo
- [x] Ajustar el `btn-shine` (barrido de luz) a `mix-blend-mode: overlay` para que se vea bien tanto en botones oscuros como en los nuevos claros
- [x] Regenerar `favicon.svg`, `og-image.svg` y las 7 portadas de proyectos en la nueva paleta (antes tenían gradientes indigo/cyan/emerald/rosa por proyecto)
- [x] Mantener colores semánticos/de marca sin tocar: verde de WhatsApp, rosa de Instagram, ámbar de advertencia en ErrorBoundary, rojo/verde de estados de formulario
- [x] `npm run lint` y `npm run build` — OK, verificado visualmente en las 3 páginas

**Archivos afectados**: todo `src/` (componentes y páginas), `src/index.css`, `public/favicon.svg`, `public/og-image.svg`, `public/images/*.svg` (las 7 portadas)

---

### 10.3 feat/easter-eggs ✅

**Problema**: Ninguno — pedido explícito de agregar sorpresas ocultas para darle personalidad al portafolio.

**Tareas**:
- [x] **Foto → moneda**: tocar la foto de perfil la gira en 3D (`rotateY`, `preserve-3d`/`backface-visibility`) y del otro lado aparece una moneda metálica con "GIANFRANCO / GF / FULL STACK DEV" grabado. Hint sutil "🪙 tocá la foto" que se desvanece a los 5s o al primer click. Instantáneo (sin flip) si `prefers-reduced-motion`.
- [x] **Konami Code** (↑↑↓↓←→←→ b a): dispara una lluvia de emojis (🪙✨GF⚡) y un mensaje "Konami Code activado" por ~3s. Se salta la animación de partículas con `prefers-reduced-motion`.
- [x] **Mensaje en consola**: saludo estilizado + contacto para quien inspeccione el código desde devtools.
- [x] De paso, corregidos dos restos de azul (`#6366f1`) que habían quedado del cambio de paleta: el `skip-link` de accesibilidad y el `borderColor` del hover de la foto.
- [x] `npm run lint` y `npm run build` — OK, flip probado en navegador

**Archivos nuevos**: `src/components/KonamiEgg.jsx`, `src/lib/consoleEgg.js`

**Archivos afectados**: `src/pages/Home.jsx`, `src/App.jsx`, `src/index.css`

---

### 10.4 feat/easter-eggs-2 ✅

**Problema**: Ninguno — segunda ronda de easter eggs pedida: un libro (Meditaciones de Marco Aurelio), Age of Empires II, y una taza de café.

**Tareas**:
- [x] **Cita de Marco Aurelio**: 3 clics rápidos (<700ms) en el "GF." del footer muestran una cita aleatoria de *Meditaciones* en una card elegante tipo placa, con auto-cierre a los 6.5s
- [x] **Age of Empires II — "wololo"**: escribir la palabra en cualquier parte de la página (listener global de teclado, buffer de últimos N caracteres) dispara un toast "¡WOLOLO!" con referencia al juego
- [x] **Taza de café**: botón discreto ☕ junto al copyright del footer — cada clic suma una taza (contador persistido en `localStorage`, sobrevive a recargas), con animación de vapor y un mensaje random tipo "sin esto no hay commits."
- [x] Todo con fallback accesible: sin animación de vapor si `prefers-reduced-motion`; `localStorage` envuelto en `try/catch` por si el navegador lo bloquea
- [x] `npm run lint` y `npm run build` — OK; los tres eggs probados y confirmados (wololo con `key` real, cita y café verificados por DOM/localStorage — el click simulado del navegador de test tiene demasiada latencia entre llamadas para el triple-click, no es un problema del sitio)

**Archivos nuevos**: `src/lib/quotes.js`, `src/components/WololoEgg.jsx`

**Archivos afectados**: `src/components/Footer.jsx`, `src/App.jsx`

---

### 10.5 feat/wololo-cursor ✅

**Problema**: Ninguno — mejora pedida sobre el easter egg de Wololo: que además cambie el color del cursor mientras dura el efecto.

**Tareas**:
- [x] Cursor personalizado (SVG data-URI, anillo verde) vía clase `body.wololo-active` con `cursor: url(...) !important` aplicado también a `*` para que gane a los `cursor-pointer` de botones y links
- [x] `WololoEgg.jsx` togglea la clase en el mismo `useEffect` que controla `active`, se limpia sola al desmontar
- [x] Verificado por DOM: `getComputedStyle(document.body).cursor` cambia al `data:image/svg+xml...` mientras `active` es `true`, y vuelve a `auto` al expirar
- [x] `npm run lint` y `npm run build` — OK

**Archivos afectados**: `src/index.css`, `src/components/WololoEgg.jsx`

---

### 10.6 fix/quitar-proyecto-fastapi ✅

**Problema**: Ninguno — pedido explícito de quitar el proyecto "API RESTful con FastAPI" del portafolio.

**Tareas**:
- [x] Eliminar la entrada `api-fastapi` de `src/data/projects.js`
- [x] Borrar la portada huérfana `public/images/fastapi-backend.svg`
- [x] Actualizar menciones de "7 proyectos" → "6 proyectos" en `README.md` y `AGENTS.md`
- [x] `npm run lint` y `npm run build` — OK

**Archivos afectados**: `src/data/projects.js`, `README.md`, `AGENTS.md` — **eliminado**: `public/images/fastapi-backend.svg`

---

### 10.7 feat/easter-egg-jack-ross ✅

**Problema**: Ninguno — pedido de reemplazar el nombre/email de ejemplo del formulario de contacto por otro easter egg.

**Tareas**:
- [x] Placeholder del campo nombre: "Ej. Juan Pérez" → "Ej. Jack Ross"
- [x] Placeholder del campo email: "juan@ejemplo.com" → "jack.ross@ejemplo.com"
- [x] Si el visitante escribe exactamente "Jack Ross" (case-insensitive) en el campo nombre, aparece un guiño "🚢 Jack... había lugar para los dos en la puerta." (Jack + Ross ≈ Jack + Rose, Titanic) que se autodesvanece a los 5s o al corregir el texto
- [x] `npm run lint` y `npm run build` — OK; verificado por DOM que el placeholder y el disparo del egg funcionan

**Archivos afectados**: `src/pages/Contact.jsx`

---

### 10.8 feat/easter-eggs-mobile ✅

**Problema**: Konami Code y Wololo dependen de eventos de teclado físico (`keydown` global) — en mobile sin teclado externo nunca se disparan. Los otros 4 easter eggs (moneda, cita de Marco Aurelio, café, Jack Ross) ya funcionan en mobile porque son táctiles o van por un `<input>` con teclado virtual.

**Tareas**:
- [x] **Konami en mobile**: equivalente táctil — swipe ↑↑↓↓←→←→ (mismos 8 movimientos, umbral 40px) seguido de doble tap (equivalente a "b, a"). Reutiliza el mismo overlay de confeti
- [x] **Wololo en mobile**: se agregó `WOLOLO_EVENT`, un evento custom de `window` que dispara el mismo toast+cursor. El campo de mensaje del formulario de Contacto lo dispara si el texto tipeado contiene "wololo" (el teclado virtual sí genera eventos `input` confiables, a diferencia de `keydown`)
- [x] Verificado con eventos táctiles y de input simulados en viewport mobile (375×812): ambos disparan correctamente
- [x] `npm run lint` y `npm run build` — OK

**Archivos nuevos**: ninguno

**Archivos afectados**: `src/components/KonamiEgg.jsx`, `src/components/WololoEgg.jsx`, `src/pages/Contact.jsx`

---

## ✅ Fase 13: Modo papel, visualizador de algoritmos y terminal escondida

### 13.1 feat/modo-papel ✅

- [x] Tema "papel" (hoja de cuaderno con renglones y letra manuscrita Caveat) con botón en el navbar. Se logra invirtiendo la escala `stone` y `white` con variables CSS de Tailwind v4 bajo `html[data-theme="paper"]`, sin tocar los componentes. Se guarda en `localStorage` (`theme`) y `index.html` lo aplica antes del primer render. La fuente Caveat se baja solo al usar el modo papel o la sección
- [x] Sección **Programo en papel** en Inicio (`PaperSection`, datos en `src/data/papel.js`): hoja manuscrita a la izquierda y el mismo algoritmo en código a la derecha, con botón Ejecutar que corre el algoritmo real. Para usar fotos reales del cuaderno: guardarlas en `public/images/papel/` y poner la ruta en `image`

### 13.2 feat/visualizador-algoritmos ✅

- [x] Demo `/lab/algoritmos`: Burbuja, Selección, Inserción, Quick sort, búsqueda lineal y binaria. Play/pausa, paso atrás/adelante, velocidad, cantidad, valor a buscar, comparaciones/intercambios y complejidad. `src/lib/algorithms.js` devuelve la lista de pasos (verificado con 1000 casos aleatorios)

### 13.3 feat/terminal-escondida ✅

- [x] Terminal: tecla ` o escribir `help` fuera de un campo, o el botón `>_` del footer (celular). Comandos: help, whoami, ls, projects, experience, stack, lab, contact, goto, theme, lang, quote, coffee, date, echo, sudo, clear, exit. Historial con ↑/↓, Tab completa. Se descarga recién al abrirla (chunk aparte, ~3.8 kB gzip)
- [x] Fix: el footer en español mostraba el texto literal `{t.rights}`

**Archivos**: nuevos `src/lib/{theme,useTheme,algorithms}.js`, `src/pages/lab/AlgoVisualizerDemo.jsx`, `src/components/{PaperSection,TerminalHost,HiddenTerminal}.jsx`, `src/data/papel.js`; modificados `index.css`, `index.html`, `App.jsx`, `Navbar`, `Footer`, `Home`, `lab.js`, `sitemap.xml`. Bundle principal: 133.4 → 134.6 kB gzip.

---

## ✅ Fase 12: Idiomas, SEO por página y filtro

### 12.1 feat/i18n-es-en ✅

**Objetivo**: poder postularse fuera de Argentina y que el inicio explique qué hace Gianfranco sin jerga.

**Tareas**:
- [x] Sistema ES/EN propio, sin librerías: `src/i18n/` (`LanguageProvider`, `useLang`, `tr`, `useDocumentMeta`). Se elige con el botón ES/EN del navbar (visible también en mobile), se guarda en `localStorage` y la primera vez usa el idioma del navegador
- [x] Traducido todo el sitio: Inicio, Proyectos, Experiencia, Lab, Contacto, 404, Footer, errores y easter eggs (citas de Marco Aurelio, café, Konami, wololo, consola). Datos bilingües en `projects.js`, `experience.js`, `lab.js`
- [x] Las 3 demos del Lab traducidas sin tocar los motores (`siemEngine.js`, `synctuneMatcher.js`): lo que muestran se traduce al renderizar
- [x] Inicio: texto nuevo sin jerga ("SDD/OPSX" fuera del párrafo; queda como "Spec-Driven Development" en Metodologías), **Node.js eliminado** de todo el sitio, la docencia (UTN y Celsius) aparece en el hero y en Comunicación Efectiva
- [x] `og-image.png` regenerada con la foto nueva y sin "SDD/OPSX"; `index.html` sin Node.js ni jerga

### 12.2 feat/seo-por-pagina ✅

- [x] `useDocumentMeta`: cada página define su `<title>` y `meta description` (ej. `Proyectos | Gianfranco Canciani`, `Lab — Demos interactivas | …`), en el idioma activo

### 12.3 feat/filtro-proyectos ✅

- [x] Chips por tecnología (Python, Java, React, TypeScript, FastAPI, Spring Boot, PostgreSQL, Docker) con contador y "Quitar filtro", accesibles (`aria-pressed`, `aria-live`)

**Archivos**: nuevo `src/i18n/*`; modificados todas las páginas, `Navbar`, `Footer`, `ErrorBoundary`, easter eggs, `src/data/*`, `src/lib/quotes.js`, `src/lib/consoleEgg.js`, `index.html`, `og-image.png`. Bundle principal: 131.9 → 133.4 kB gzip.

---

## ✅ Fase 11: Sección de Experiencia

### 11.1 feat/pagina-experiencia ✅

**Problema**: El portafolio no tenía ninguna sección de experiencia laboral — solo proyectos personales.

**Tareas**:
- [x] Crear `src/data/experience.js` con los 2 roles reales (Instituto Celsius, UTN)
- [x] Crear `src/pages/Experience.jsx`: timeline vertical con línea + marcadores, cards con spotlight hover, mismo lenguaje visual/animaciones que el resto del sitio (blur-in stagger, easing premium)
- [x] Nueva ruta `/experience` (lazy-loaded) en `App.jsx`
- [x] Link "Experiencia" agregado al Navbar (desktop + mobile) y al Footer, entre "Proyectos" y "Contacto"
- [x] `public/sitemap.xml`: agregada la URL `/experience`
- [x] `index.html`: agregado `worksFor` (Instituto Celsius + UTN) al JSON-LD del Person
- [x] `README.md` y `AGENTS.md` actualizados (estructura, tabla de rutas, conteo de chunks 5→6)
- [x] `npm run lint` y `npm run build` — OK, verificado en navegador

**Contenido** (fechas confirmadas por el owner):
- **UTN** — Tutor de Programación — Febrero 2026 · Presente. Empezó en Programación III, ahora Programación IV (Python, FastAPI, React).
- **Instituto Celsius** — Profesor de Programación — Enero 2026 · Presente. Algoritmos, Java, JPA, Spring Boot, HTML, CSS.

**Archivos nuevos**: `src/data/experience.js`, `src/pages/Experience.jsx`

**Archivos afectados**: `src/App.jsx`, `src/components/Navbar.jsx`, `src/components/Footer.jsx`, `public/sitemap.xml`, `index.html`, `README.md`, `AGENTS.md`

## Dependencias

```
fix/typo-proyects → (ninguna) ✅
fix/deps-cleanup → (ninguna) ✅
fix/lang-es → (ninguna) ✅
fix/eslint-motion → fix/deps-cleanup ✅
fix/seo-meta-tags → fix/lang-es ✅
fix/placeholder-data → (requiere datos reales del owner) ⏳
feat/reduced-motion → (ninguna) ✅
feat/skip-link → (ninguna) ✅
fix/scrollbar-firefox → (ninguna) ✅
fix/passive-listener → (ninguna) ✅
refactor/projects-data → fix/typo-proyects ✅
feat/form-validation → (ninguna) ✅
nivel1-mejoras → (ninguna) ✅
nivel2-ux → (ninguna) ✅
nivel3-arquitectura → (ninguna) ✅
fix/footer-spa-links → (ninguna) ✅
fix/datos-proyectos → (ninguna) ✅
feat/sdd-opsx-visibilidad → (ninguna) ✅
docs/agents-md-actualizacion → nivel3-arquitectura ✅
docs/readme-actualizacion → (ninguna) ✅
```

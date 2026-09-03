## Context

Portafolio SPA con React 19 + Vite + Tailwind CSS v4. Actualmente tiene Navbar fijo con links inline, sin menú mobile. Las transiciones entre rutas son instantáneas (sin animación). Home tiene Hero con CTA a proyectos pero sin opción de descargar CV. Los proyectos solo muestran link a GitHub.

## Goals / Non-Goals

**Goals:**
- Navegación mobile responsiva con menú hamburguesa animado
- Botón de descarga de CV en el Hero
- Transiciones suaves entre rutas con AnimatePresence
- Links de demo opcionales en tarjetas de proyecto

**Non-Goals:**
- No se agregan nuevas páginas o secciones
- No se modifican los datos de proyectos existentes (solo se extiende el schema)
- No se agregan dependencias externas
- No se cambia la estructura de routing actual

## Decisions

### 1. Menú Hamburguesa Mobile
**Decisión**: Estado `isOpen` en Navbar que controla un menú en overlay fijo con entrada desde la derecha. Botón hamburguesa visible solo en mobile (`md:hidden`). Links ocultos en desktop se muestran inline como hoy.
**Por qué**: 
- Framer Motion ya está en el proyecto para animar la entrada/salida del menú
- Overlay previene scroll del body mientras el menú está abierto (mejor UX que menú que empuja contenido)
- El diseño actual con `md:flex` vs `mobile hidden` es el patrón Tailwind estándar

### 2. Descargar CV
**Decisión**: Botón en el Hero, al lado del CTA "Explorar Proyectos", con ícono de descarga y link a `/CV-Gianfranco-Canciani.pdf`.
**Por qué**: Es la ubicación más visible. El PDF se sirve desde `public/` para que Vite lo copie directo al build sin procesamiento.
**Riesgo**: El archivo PDF no existe — se crea un placeholder. El usuario debe reemplazarlo con su CV real.

### 3. Transiciones entre Páginas
**Decisión**: Envolver `<Routes>` con `<AnimatePresence mode="wait">` y usar `useLocation()` como `key`. Cada página se envuelve en un `motion.div` con fade + slide vertical.
**Por qué**: 
- `mode="wait"` asegura que la salida termine antes de la entrada (evita superposición)
- Framer Motion ya está en el proyecto — zero dependencias nuevas
- La animación es sutil (0.3s, opacidad + translateY 20px) para no sentirse lenta
- **Decisión clave**: No usar `AnimatePresence` directamente en las page components porque eso requeriría modificar cada página. En su lugar, se crea un wrapper `<PageTransition>` en App.jsx.

### 4. Demo Links
**Decisión**: Agregar campo opcional `demoUrl: string` a cada proyecto en el array de datos. Si existe, se muestra un segundo botón "Ver Demo" junto al de "Ver Código".
**Por qué**: El campo opcional evita romper proyectos existentes. Si no tiene demo, solo se muestra el botón de GitHub.

## Risks / Trade-offs

- **[Menú mobile]** El overlay previene scroll — si el usuario tiene el menú abierto en mobile y rota el dispositivo, puede quedar atrapado. Mitigación: escuchar `resize` y cerrar el menú si pasa a desktop.
- **[Transiciones]** `AnimatePresence mode="wait"` bloquea la interacción durante la transición (~300ms). Es aceptable para un portafolio, pero en una app más interactiva convendría `mode="popLayout"`.
- **[Demo links]** Sin proyectos deployados reales, los botones de demo no se mostrarán hasta que el usuario agregue URLs reales. El cambio es puramente estructural.
- **[CV]** Si el PDF es pesado (>1MB), la descarga puede sentirse lenta. Considerar optimizar el PDF antes de subirlo.

## Why

El portafolio ya tiene las bases técnicas sólidas, pero hay 4 mejoras de experiencia de usuario que lo llevarían al siguiente nivel: navegación mobile no está optimizada (falta menú hamburguesa), no hay forma de descargar el CV, las transiciones entre páginas son abruptas (sin animación), y los proyectos solo muestran link a GitHub sin opción a demo si están deployados.

## What Changes

- **Menú hamburguesa mobile**: Agregar toggle button en Navbar que muestre/oculte los links de navegación en dispositivos móviles. Menú en overlay con animación.
- **Descargar CV**: Agregar botón "Descargar CV" en el Hero de Home.jsx con ícono y link a archivo PDF en `/public/`.
- **Transiciones entre páginas**: Implementar `AnimatePresence` de Framer Motion en App.jsx para animar la entrada/salida de rutas con fade + slide.
- **Demo links en proyectos**: Agregar campo opcional `demoUrl` a los datos de proyectos y mostrar botón "Ver Demo" secundario cuando exista.

## Capabilities

### New Capabilities
- `mobile-navigation`: Navegación responsive con menú colapsable para dispositivos móviles
- `page-transitions`: Transiciones animadas entre rutas usando AnimatePresence

### Modified Capabilities

Ninguna. No hay cambios en requerimientos de especificaciones existentes.

## Impact

- **Archivos nuevos**: `public/CV-Gianfranco-Canciani.pdf` (placeholder)
- **Archivos modificados**: `src/components/Navbar.jsx`, `src/App.jsx`, `src/pages/Home.jsx`, `src/pages/Projects.jsx`
- **Dependencias**: Ninguna nueva (Framer Motion ya está en el proyecto)
- **Rendimiento**: Impacto mínimo — AnimatePresence agrega lógica de animación solo durante transiciones

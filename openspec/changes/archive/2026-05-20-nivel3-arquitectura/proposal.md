## Why

El portafolio tiene deuda técnica que empieza a pesar: los datos de proyectos están hardcodeados en el componente (mezcla datos con presentación), todas las rutas se cargan eager en un solo bundle (sin lazy loading), no hay manejo de errores de renderizado, y falta datos estructurados para mejorar el SEO semántico.

## What Changes

- **Extraer datos de proyectos**: Mover el array `projects` de `Projects.jsx` a `src/data/projects.js`. Refactor puro — cero cambios visuales ni funcionales.
- **Lazy loading de rutas**: Reemplazar imports estáticos de páginas con `React.lazy() + Suspense`. Cada página se code-splittea en su propio chunk.
- **Error Boundary**: Crear componente `ErrorBoundary` que capture errores de renderizado y muestre un mensaje amigable con opción de recargar.
- **JSON-LD Structured Data**: Agregar datos estructurados Schema.org `Person` en `index.html` para que Google entienda quién es Gianfranco, su rol y skills.

## Capabilities

### New Capabilities
- `lazy-routes`: Code splitting por ruta usando React.lazy() y Suspense
- `error-boundary`: Manejo de errores de renderizado con fallback UI
- `structured-data`: Datos JSON-LD Schema.org para SEO semántico

### Modified Capabilities

Ninguna. Los cambios son puramente arquitectónicos — no alteran requerimientos funcionales existentes.

## Impact

- **Archivos nuevos**: `src/data/projects.js`, `src/components/ErrorBoundary.jsx`
- **Archivos modificados**: `src/App.jsx`, `src/pages/Projects.jsx`, `index.html`
- **Dependencias**: Ninguna nueva
- **Rendimiento**: Mejora — lazy loading reduce el bundle inicial significativamente
- **SEO**: Mejora — JSON-LD ayuda a los crawlers a entender el perfil profesional
- **Mantenibilidad**: Mejora — datos separados de presentación

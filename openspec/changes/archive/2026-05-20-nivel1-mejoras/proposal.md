## Why

El portafolio está funcional pero tiene detalles de pulido que restan profesionalismo: sigue usando el favicon por defecto de Vite, no tiene footer, la navegación no resetea el scroll al cambiar de ruta, las imágenes cargan sin lazy loading, y no hay página 404. Son 5 mejoras de bajo esfuerzo que elevan significativamente la percepción del sitio.

## What Changes

- **Favicon personalizado**: Reemplazar `/vite.svg` por un favicon real (SVG o ICO con el logo GF)
- **Footer**: Agregar componente Footer con copyright, año actual, y links a redes sociales
- **Scroll to top**: Resetear scroll al cambiar de ruta para evitar que el usuario quede en medio de la página
- **Lazy loading en imágenes**: Agregar `loading="lazy"` a todas las imágenes de proyectos
- **Página 404**: Crear ruta catch-all con diseño consistente y botón de volver al inicio

## Capabilities

### New Capabilities

No se introducen nuevas capacidades de especificación — son mejoras de UI/UX que no cambian el comportamiento funcional del sistema.

### Modified Capabilities

Ninguna. No hay cambios en requerimientos de especificaciones existentes.

## Impact

- **Archivos nuevos**: `src/components/Footer.jsx`, `src/pages/NotFound.jsx`, `public/favicon.svg`
- **Archivos modificados**: `index.html`, `src/App.jsx`, `src/pages/Projects.jsx`
- **Dependencias**: Ninguna nueva
- **Rendimiento**: Mejora con lazy loading en imágenes
- **SEO**: Mejora indirecta (mejor experiencia de usuario, menor tasa de rebote)

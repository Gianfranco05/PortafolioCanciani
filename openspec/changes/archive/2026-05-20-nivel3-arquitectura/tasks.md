## 1. Extraer Datos de Proyectos

- [x] 1.1 Crear `src/data/projects.js` con el array de proyectos exportado
- [x] 1.2 Actualizar `src/pages/Projects.jsx` para importar datos desde `src/data/projects.js`
- [x] 1.3 Verificar que el componente renderiza exactamente igual (mismos ids, keys, estructura)

## 2. Lazy Loading de Rutas

- [x] 2.1 Convertir imports estáticos a `React.lazy()` en `App.jsx`
- [x] 2.2 Agregar `<Suspense>` con loading spinner dentro de `<AnimatePresence>`
- [x] 2.3 Verificar que `npm run build` genera chunks separados

## 3. Error Boundary

- [x] 3.1 Crear `src/components/ErrorBoundary.jsx` como componente clase con `componentDidCatch`
- [x] 3.2 Envolver `<AppContent>` con `<ErrorBoundary>` en `App.jsx`

## 4. JSON-LD Structured Data

- [x] 4.1 Agregar bloque `<script type="application/ld+json">` en `<head>` de `index.html`

## 5. Verificación

- [x] 5.1 Ejecutar `npm run build` y verificar que compila sin errores

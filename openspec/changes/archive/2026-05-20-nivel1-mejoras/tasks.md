## 1. Favicon Personalizado

- [x] 1.1 Crear `public/favicon.svg` con diseño GF minimalista usando degradado indigo-cyan
- [x] 1.2 Actualizar `index.html` para referenciar el nuevo favicon y agregar cache-buster

## 2. Footer

- [x] 2.1 Crear `src/components/Footer.jsx` con año dinámico, créditos, y links a redes
- [x] 2.2 Importar y renderizar `<Footer />` en `App.jsx` después de `<Routes>`

## 3. Scroll to Top en Cambio de Ruta

- [x] 3.1 Crear hook `useScrollToTop` que escuche `useLocation()` y ejecute `window.scrollTo(0, 0)`
- [x] 3.2 Invocar hook en `App.jsx`

## 4. Lazy Loading en Imágenes

- [x] 4.1 Agregar `loading="lazy"` a los 6 `<img>` de proyectos en `Projects.jsx`
- [x] 4.2 Agregar `loading="lazy"` a la foto de perfil en `Home.jsx`

## 5. Página 404

- [x] 5.1 Crear `src/pages/NotFound.jsx` con diseño dark consistente y botón "Volver al inicio"
- [x] 5.2 Agregar `<Route path="*" element={<NotFound />}>` al final de las rutas en `App.jsx`
- [x] 5.3 Verificar que `npm run build` compila sin errores

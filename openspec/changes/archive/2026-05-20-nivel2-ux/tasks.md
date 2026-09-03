## 1. Menú Hamburguesa Mobile

- [x] 1.1 Agregar estado `isOpen` y botón hamburguesa en `Navbar.jsx` (visible solo en mobile con `md:hidden`)
- [x] 1.2 Implementar overlay fijo con animación Framer Motion (entrada desde la derecha)
- [x] 1.3 Bloquear scroll del body cuando el menú está abierto (`overflow: hidden`)
- [x] 1.4 Cerrar menú al seleccionar un link, al tocar el backdrop, y al redimensionar a desktop

## 2. Descargar CV

- [x] 2.1 Crear placeholder `public/CV-Gianfranco-Canciani.pdf`
- [x] 2.2 Agregar botón "Descargar CV" en el Hero de `Home.jsx` con ícono de descarga

## 3. Transiciones entre Páginas

- [x] 3.1 Crear componente `PageTransition` wrapper con `motion.div` (fade + slide vertical 0.3s)
- [x] 3.2 Envolver `<Routes>` con `<AnimatePresence mode="wait">` y usar `location.key` en `App.jsx`

## 4. Demo Links en Proyectos

- [x] 4.1 Agregar campo opcional `demoUrl` a proyectos existentes (3 con URLs reales si están deployados)
- [x] 4.2 Mostrar botón "Ver Demo" secundario en la tarjeta cuando `demoUrl` exista

## 5. Verificación

- [x] 5.1 Ejecutar `npm run build` y verificar que compila sin errores

# 👨‍💻 Gianfranco — Portafolio Profesional

Portafolio personal de **Gianfranco**, desarrollador backend y docente IT radicado en **Mendoza, Argentina**.

SPA construida con **React 19 + Vite + Tailwind CSS v4**, con animaciones fluidas y diseño oscuro formal. Muestra 6 proyectos personales, habilidades técnicas y ofrece un formulario de contacto. Desarrollo guiado por la metodología SDD con flujo OPSX.

## 🚀 Tecnologías

| | |
|---|---|
| **React** 19 | UI Library con Server Components y Actions |
| **Vite** 7 | Bundler ultrarrápido con HMR |
| **Tailwind CSS** 4 | Utility-first CSS vía Vite plugin |
| **React Router** 7 | SPA routing con BrowserRouter |
| **Framer Motion** 12 | Animaciones declarativas |
| **React Icons** 5 | Iconos (Font Awesome, Heroicons) |

## 📦 Requisitos

- **Node.js** ≥ 18 (recomendado 20 LTS)
- **npm** ≥ 9

## 🔧 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Gianfranco05/mi-portafolio.git
cd mi-portafolio

# Instalar dependencias
npm install
```

## 🏃 Scripts Disponibles

```bash
# Desarrollo — inicia servidor con HMR en http://localhost:5173
npm run dev

# Build de producción — genera bundle en /dist
npm run build

# Previsualizar build localmente
npm run preview

# Linter — ESLint sobre todo el proyecto
npm run lint
```

## 📁 Estructura del Proyecto

```
mi-portafolio/
├── index.html              # Entry point HTML + SEO meta tags + JSON-LD
├── vite.config.js          # Configuración de Vite + React + Tailwind
├── eslint.config.js        # ESLint flat config
├── public/                 # Assets estáticos (favicon, CV, imágenes)
└── src/
    ├── main.jsx            # Entry point React (StrictMode)
    ├── App.jsx             # Router + Layout (Navbar, Footer, ErrorBoundary, lazy routes)
    ├── index.css           # Estilos globales + Tailwind + scrollbar
    ├── data/
    │   ├── projects.js     # Datos de 6 proyectos
    │   └── experience.js   # Datos de experiencia laboral (2 roles)
    ├── components/         # Componentes reutilizables
    │   ├── Navbar.jsx      # Navbar fijo + hamburger mobile
    │   ├── Footer.jsx      # Footer con año dinámico + navegación + redes
    │   ├── ErrorBoundary.jsx    # Captura errores de renderizado
    │   ├── PageTransition.jsx   # Transiciones animadas entre rutas
    │   ├── Loading.jsx          # Spinner para Suspense fallback
    │   └── useScrollToTop.js    # Custom hook: scroll al cambiar de ruta
    └── pages/              # Páginas (lazy-loaded)
        ├── Home.jsx        # Hero + Skills Técnicas + Soft Skills
        ├── Projects.jsx    # Grid de proyectos con animaciones
        ├── Experience.jsx  # Timeline de experiencia laboral
        ├── Contact.jsx     # Formulario validado + Formspree + WhatsApp
        └── NotFound.jsx    # Página 404
```

## 🧭 Rutas

| Ruta | Página | Descripción |
|---|---|---|
| `/` | Home | Hero, presentación, habilidades técnicas, CV |
| `/projects` | Projects | Grid de 6 proyectos con stacks y links |
| `/experience` | Experience | Timeline de experiencia laboral (docencia y tutoría) |
| `/contact` | Contact | Formulario validado + redes + WhatsApp |
| `*` | NotFound | Página 404 con diseño consistente |

## ✨ Features

- **Diseño oscuro** con paleta negro/plateado/crema (stone) + gradientes
- **Animaciones** con Framer Motion (entradas, scroll, stagger, page transitions)
- **Respeto por `prefers-reduced-motion`** — animaciones se desactivan si el SO lo pide
- **Code splitting** con `React.lazy()` + `Suspense` (6 chunks)
- **Error Boundary** con fallback UI y botón de recarga
- **Navbar adaptable** que cambia de transparente a sólido + menú hamburger mobile con overlay
- **Footer** con año dinámico, navegación interna y redes sociales
- **Scroll to top** automático al cambiar de ruta
- **Skip-link** de accesibilidad ("Saltar al contenido principal")
- **Scrollbar estilizado** para WebKit y Firefox
- **Formulario de contacto** con validación React, estados de envío y fallback WhatsApp
- **SEO completo**: meta tags (description, keywords, OG, Twitter Cards) + JSON-LD Structured Data
- **6 proyectos** con stacks reales, links a GitHub + demo

## 📄 Licencia

Uso personal — Gianfranco.


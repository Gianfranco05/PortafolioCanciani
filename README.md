# Gianfranco Canciani — Portafolio

Portafolio de **Gianfranco Canciani**, desarrollador de software y docente de programación en Mendoza, Argentina.

**En vivo:** https://portafolio-canciani.vercel.app

SPA construida con React 19, Vite y Tailwind CSS v4. Muestra proyectos, experiencia y un **Lab** con demos interactivas de algunos proyectos que corren directo en el navegador. Desarrollada con la metodología SDD y el flujo OPSX.

## Tecnologías

| | |
|---|---|
| **React** 19 | UI |
| **Vite** 7 | Bundler y dev server |
| **Tailwind CSS** 4 | Estilos (vía plugin de Vite) |
| **React Router** 7 | Routing SPA con `BrowserRouter` |
| **Framer Motion** 12 | Animaciones y transiciones entre páginas |
| **React Icons** 5 | Íconos (Font Awesome, Heroicons, Lucide) |
| **MediaPipe Tasks Vision** | Detección facial en el navegador (demo de FaceTrack) |

## Requisitos

- **Node.js** 20.19+ o 22.12+ (lo exige Vite 7)
- **npm** 10+

## Instalación

```bash
git clone https://github.com/Gianfranco05/PortafolioCanciani.git
cd PortafolioCanciani
npm install
```

## Scripts

```bash
npm run dev      # servidor de desarrollo en http://localhost:5173
npm run build    # build de producción en /dist
npm run preview  # previsualiza el build
npm run lint     # ESLint
```

## Rutas

| Ruta | Página | Descripción |
|---|---|---|
| `/` | Home | Presentación, acceso al Lab, especialidades y skills, descarga del CV |
| `/projects` | Projects | 7 proyectos con stack, repos y demos |
| `/experience` | Experience | Experiencia laboral (docencia y tutoría) |
| `/lab` | Lab | Índice de demos interactivas |
| `/lab/facetrack` | FaceTrackDemo | Detección facial, landmarks, parpadeo y liveness con la webcam o una foto |
| `/lab/synctune` | SyncTuneDemo | Algoritmo de matching YouTube → Spotify de SyncTune, sobre un catálogo de ejemplo |
| `/lab/siem` | SiemDemo | Motor de detección de anomalías de la tesis (Isolation Forest + DBSCAN + reglas) sobre logs sintéticos |
| `/contact` | Contact | Formulario (Formspree) y contacto por WhatsApp |
| `*` | NotFound | Página 404 |

## El Lab

Cada demo aclara qué parte es real y qué parte es una versión simplificada del proyecto completo:

- **FaceTrack**: usa el mismo motor de visión (MediaPipe) que el proyecto. Todo corre en el navegador y la imagen de la cámara no se envía a ningún lado.
- **SyncTune**: `src/lib/synctuneMatcher.js` es un port fiel del algoritmo de matching del backend en Python (mismos patrones, pesos y umbrales). Los candidatos salen de un catálogo de ejemplo, no de la API de Spotify.
- **SIEM**: `src/lib/siemEngine.js` replica el pipeline del motor de la tesis (features, escalado, hiperparámetros, reglas y fusión OR) sobre logs con el formato del simulador de ataques.

**Performance:** MediaPipe (librería, WebAssembly y modelo, ~7 MB en total) se descarga solo cuando alguien toca "Iniciar" en la demo de FaceTrack, nunca al cargar el sitio. Cada página es un chunk separado.

## Estructura

```
├── index.html            # HTML base, SEO, Open Graph y JSON-LD
├── vercel.json           # rewrite a index.html para las rutas de la SPA
├── public/               # favicon, CV, og-image.png, robots.txt, sitemap.xml, imágenes
└── src/
    ├── main.jsx
    ├── App.jsx           # router, layout y rutas lazy
    ├── index.css         # estilos globales
    ├── components/       # Navbar, Footer, ErrorBoundary, transiciones, easter eggs
    ├── data/             # proyectos, experiencia, demos del Lab, catálogo de SyncTune
    ├── lib/              # animaciones, lógica de las demos (MediaPipe, parpadeo, SyncTune, SIEM)
    └── pages/            # una página por ruta (lazy); lab/ con las demos
```

## Deploy

Se despliega en Vercel desde la rama `main`. `vercel.json` redirige todas las rutas a `index.html` para que funcionen los links directos (por ejemplo `/lab/siem`).

## Detalles

- Respeta `prefers-reduced-motion`.
- Skip-link y navegación por teclado.
- Hay algunos easter eggs escondidos. 😉

## Licencia

Uso personal — Gianfranco Canciani.

// name y description son bilingües ({ es, en }); se resuelven con tr() según el idioma activo.
const projects = [
  {
    id: "detector-rostros",
    name: { es: "FaceTrack — Reconocimiento Facial", en: "FaceTrack — Face Recognition" },
    description: {
      es: "Evolución de un detector de rostros a una app completa de visión artificial: reconoce personas registradas en tiempo real (conocido/desconocido con umbral configurable, varios rostros por frame), gestiona personas y sus embeddings faciales, registra asistencia de entrada/salida con cooldown anti-duplicados, historial y estadísticas, landmarks y una prueba básica de liveness por parpadeo. API REST en FastAPI con PostgreSQL y dashboard en React + TypeScript. Procesamiento 100% local, sin guardar imágenes ni video por defecto.",
      en: "A face detector that grew into a full computer vision app: it recognizes registered people in real time (known/unknown with a configurable threshold, several faces per frame), manages people and their face embeddings, logs check-in/check-out attendance with an anti-duplicate cooldown, keeps history and stats, and adds landmarks plus a basic blink-based liveness check. REST API in FastAPI with PostgreSQL and a React + TypeScript dashboard. Runs 100% locally and stores no images or video by default.",
    },
    tech: ["Python", "FastAPI", "OpenCV", "MediaPipe", "PostgreSQL", "SQLAlchemy", "React", "TypeScript"],
    image: "/images/facetrack.svg",
    repoUrl: "https://github.com/Gianfranco05/reconocimiento_facial",
    demoUrl: "/lab/facetrack",
  },
  {
    id: "synctune",
    name: "SyncTune — YouTube ⇄ Spotify",
    description: {
      es: "Plataforma personal que conecta YouTube con Spotify: importás una canción o una playlist entera, con coincidencias puntuadas por confianza (alta/media/baja), detección de duplicados, vista previa y confirmación explícita antes de tocar nada, e historial. Suma dashboard, centro de Conexiones, herramientas de playlists (comparar, detectar duplicados, fusionar), paleta de comandos (Ctrl+K) y modos simple/avanzado y seguro/rápido. Interfaz oscura con acento verde, tema claro y diseño responsive. OAuth2 con Spotify y Google (solo lectura), tokens cifrados con Fernet y 132 tests (pytest + Vitest).",
      en: "A personal platform that connects YouTube to Spotify: import a single song or a whole playlist, with matches scored by confidence (high/medium/low), duplicate detection, a preview and explicit confirmation before anything changes, plus history. It also has a dashboard, a Connections hub, playlist tools (compare, find duplicates, merge), a command palette (Ctrl+K) and simple/advanced and safe/fast modes. Dark UI with a green accent, light theme and responsive design. OAuth2 with Spotify and Google (read-only), Fernet-encrypted tokens and 132 tests (pytest + Vitest).",
    },
    tech: ["FastAPI", "React", "TypeScript", "PostgreSQL", "SQLAlchemy", "Alembic", "OAuth 2.0", "Docker", "pytest", "Vitest"],
    image: "/images/synctune.svg",
    repoUrl: "https://github.com/Gianfranco05/SyncTune_v1",
    demoUrl: "/lab/synctune",
  },
  {
    id: "ecommerce-componentes",
    name: { es: "Ecommerce de Componentes Tecnológicos", en: "Tech Components E-commerce" },
    description: {
      es: "Plataforma de comercio electrónico fullstack especializada en componentes de hardware. Backend robusto en Java con Spring Boot y PostgreSQL, frontend dinámico en React. Carrito de compras, gestión de inventario, autenticación de usuarios y pagos integrados con Mercado Pago.",
      en: "A fullstack e-commerce platform for computer hardware. Java backend with Spring Boot and PostgreSQL, React frontend. Shopping cart, inventory management, user authentication and payments through Mercado Pago.",
    },
    tech: ["Java", "Spring Boot", "React", "PostgreSQL", "Mercado Pago", "JavaScript"],
    image: "/images/ecommerce-componentes.svg",
    repos: [
      { label: "Frontend", url: "https://github.com/Gianfranco05/EcommercePetaByte" },
      { label: "Backend", url: "https://github.com/Gianfranco05/E-commerce_Back" },
    ],
  },
  {
    id: "ecommerce-alimentos",
    name: { es: "Ecommerce de Alimentos", en: "Food Delivery E-commerce" },
    description: {
      es: "Plataforma de delivery y comercio electrónico para alimentos con actualizaciones en tiempo real vía WebSocket. Backend en FastAPI con MySQL, autenticación JWT, frontend en React con TypeScript y Tailwind CSS. Carrito de compras, seguimiento de pedidos en vivo y pasarela de pagos Mercado Pago.",
      en: "A food delivery and e-commerce platform with real-time updates over WebSocket. FastAPI backend with MySQL and JWT authentication, React frontend with TypeScript and Tailwind CSS. Shopping cart, live order tracking and Mercado Pago checkout.",
    },
    tech: ["FastAPI", "React", "TypeScript", "Tailwind CSS", "MySQL", "WebSocket", "JWT", "Mercado Pago", "Python"],
    image: "/images/ecommerce-alimentos.svg",
    repoUrl: "https://github.com/Gianfranco05/FoodStore_SDD_Canciani",
  },
  {
    id: "gestion-personal-web",
    name: { es: "App de Gestión Personal Integral (Web)", en: "All-in-One Personal Manager (Web)" },
    description: {
      es: "Aplicación web fullstack orientada a la productividad y administración de la vida personal. Módulos integrados para gestión de notas con búsqueda, calendario de eventos con recordatorios y control de finanzas personales con gráficos de gastos. Backend en FastAPI con PostgreSQL y frontend en React con TypeScript y Tailwind CSS.",
      en: "A fullstack web app for productivity and personal life management. Built-in modules for searchable notes, an event calendar with reminders and personal finance tracking with expense charts. FastAPI backend with PostgreSQL and a React frontend with TypeScript and Tailwind CSS.",
    },
    tech: ["FastAPI", "React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Python"],
    image: "/images/gestion-personal-web.svg",
    repoUrl: "https://github.com/Gianfranco05/AgendaPersonalWeb",
  },
  {
    id: "gestion-personal-mobile",
    name: { es: "App de Gestión Personal Integral (Mobile)", en: "All-in-One Personal Manager (Mobile)" },
    description: {
      es: "Versión mobile de la misma app de productividad personal — notas, calendario de eventos y finanzas personales — construida con React Native y Expo, consumiendo el mismo backend en FastAPI con PostgreSQL.",
      en: "The mobile version of the same personal productivity app — notes, event calendar and personal finances — built with React Native and Expo on top of the same FastAPI + PostgreSQL backend.",
    },
    tech: ["React Native", "Expo", "FastAPI", "TypeScript", "PostgreSQL", "Python"],
    image: "/images/gestion-personal-mobile.svg",
  },
  {
    id: "siem-ml",
    name: { es: "SIEM Inteligente con Machine Learning", en: "Intelligent SIEM with Machine Learning" },
    description: {
      es: "Proyecto de tesis: Sistema de Información y Gestión de Eventos de Seguridad (SIEM) automatizado e inteligente. Arquitectura de detección de anomalías en tiempo real con Machine Learning, orquestación de flujos con n8n, almacenamiento en Elasticsearch y PostgreSQL, y dashboards de monitoreo en Grafana para análisis y respuesta automatizada ante incidentes.",
      en: "Thesis project: an automated, intelligent Security Information and Event Management (SIEM) system. Real-time anomaly detection with machine learning, workflow orchestration with n8n, storage in Elasticsearch and PostgreSQL, and Grafana monitoring dashboards for analysis and automated incident response.",
    },
    tech: ["Python", "Docker", "n8n", "Machine Learning", "Elasticsearch", "PostgreSQL", "Grafana"],
    image: "/images/siem-ml.svg",
    repoUrl: "https://github.com/Gianfranco05/Tesis_SiemInteligenteMachineLearning_Canciani",
    demoUrl: "/lab/siem",
  },
];

export default projects;

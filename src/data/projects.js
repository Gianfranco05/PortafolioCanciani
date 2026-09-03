const projects = [
  {
    id: "ecommerce-componentes",
    name: "Ecommerce de Componentes Tecnológicos",
    description: "Plataforma de comercio electrónico fullstack especializada en componentes de hardware. Backend robusto en Java con Spring Boot y PostgreSQL, frontend dinámico en React. Carrito de compras, gestión de inventario, autenticación de usuarios y pagos integrados con Mercado Pago.",
    tech: ["Java", "Spring Boot", "React", "PostgreSQL", "Mercado Pago", "JavaScript"],
    image: "/images/ecommerce-componentes.svg",
    repos: [
      { label: "Frontend", url: "https://github.com/Gianfranco05/EcommercePetaByte" },
      { label: "Backend", url: "https://github.com/Gianfranco05/E-commerce_Back" },
    ],
  },
  {
    id: "ecommerce-alimentos",
    name: "Ecommerce de Alimentos",
    description: "Plataforma de delivery y comercio electrónico para alimentos con actualizaciones en tiempo real vía WebSocket. Backend en FastAPI con MySQL, autenticación JWT, frontend en React con TypeScript y Tailwind CSS. Carrito de compras, seguimiento de pedidos en vivo y pasarela de pagos Mercado Pago.",
    tech: ["FastAPI", "React", "TypeScript", "Tailwind CSS", "MySQL", "WebSocket", "JWT", "Mercado Pago", "Python"],
    image: "/images/ecommerce-alimentos.svg",
    repoUrl: "https://github.com/Gianfranco05/FoodStore_SDD_Canciani",
  },
  {
    id: "gestion-personal-web",
    name: "App de Gestión Personal Integral (Web)",
    description: "Aplicación web fullstack orientada a la productividad y administración de la vida personal. Módulos integrados para gestión de notas con búsqueda, calendario de eventos con recordatorios y control de finanzas personales con gráficos de gastos. Backend en FastAPI con PostgreSQL y frontend en React con TypeScript y Tailwind CSS.",
    tech: ["FastAPI", "React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Python"],
    image: "/images/gestion-personal-web.svg",
    repoUrl: "https://github.com/Gianfranco05/AgendaPersonalWeb",
  },
  {
    id: "gestion-personal-mobile",
    name: "App de Gestión Personal Integral (Mobile)",
    description: "Versión mobile de la misma app de productividad personal — notas, calendario de eventos y finanzas personales — construida con React Native y Expo, consumiendo el mismo backend en FastAPI con PostgreSQL.",
    tech: ["React Native", "Expo", "FastAPI", "TypeScript", "PostgreSQL", "Python"],
    image: "/images/gestion-personal-mobile.svg",
  },
  {
    id: "siem-ml",
    name: "SIEM Inteligente con Machine Learning",
    description: "Proyecto de tesis: Sistema de Información y Gestión de Eventos de Seguridad (SIEM) automatizado e inteligente. Arquitectura de detección de anomalías en tiempo real con Machine Learning, orquestación de flujos con n8n, almacenamiento en Elasticsearch y PostgreSQL, y dashboards de monitoreo en Grafana para análisis y respuesta automatizada ante incidentes.",
    tech: ["Python", "Docker", "n8n", "Machine Learning", "Elasticsearch", "PostgreSQL", "Grafana"],
    image: "/images/siem-ml.svg",
    repoUrl: "https://github.com/Gianfranco05/Tesis_SiemInteligenteMachineLearning_Canciani",
  },
  {
    id: "detector-rostros",
    name: "Detector de Rostros con Python",
    description: "Sistema de detección facial en tiempo real utilizando OpenCV y el clasificador Haar Cascade. Procesa video en vivo desde la webcam, identifica y encuadra rostros humanos con alta precisión. Ideal para aplicaciones de seguridad, control de acceso y análisis biométrico.",
    tech: ["Python", "OpenCV", "Haar Cascade", "NumPy", "Computer Vision"],
    image: "/images/detector-rostros.svg",
    repoUrl: "https://github.com/Gianfranco05/reconocimiento_facial",
  },
];

export default projects;

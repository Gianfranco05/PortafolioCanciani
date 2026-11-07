// role, org, period, description y algunos tags son bilingües ({ es, en }); se resuelven con tr().
const experience = [
  {
    id: "utn",
    role: { es: "Tutor de Programación", en: "Programming Tutor" },
    org: { es: "UTN — Universidad Tecnológica Nacional", en: "UTN — National Technological University (Argentina)" },
    period: { es: "Febrero 2026 · Presente", en: "February 2026 · Present" },
    description: {
      es: "Tutor de programación en la carrera. Empecé acompañando la comisión de Programación III y actualmente estoy a cargo de Programación IV, donde se trabaja con FastAPI y Python para el backend, y React para el frontend.",
      en: "Programming tutor in the degree program. I started supporting the Programming III cohort and I'm now in charge of Programming IV, which covers FastAPI and Python on the backend and React on the frontend.",
    },
    tech: ["Python", "FastAPI", "React", "JavaScript"],
  },
  {
    id: "instituto-celsius",
    role: { es: "Profesor de Programación", en: "Programming Teacher" },
    org: "Instituto Celsius",
    period: { es: "Enero 2026 · Presente", en: "January 2026 · Present" },
    description: {
      es: "Docente de las materias de programación del instituto: Algoritmos, Java, JPA, Spring Boot, HTML y CSS. A cargo del dictado de clases y el seguimiento de los estudiantes en su primer contacto con la lógica de programación y el desarrollo backend en Java.",
      en: "I teach the institute's programming courses: Algorithms, Java, JPA, Spring Boot, HTML and CSS. I lead the classes and follow up with students during their first contact with programming logic and backend development in Java.",
    },
    tech: [{ es: "Algoritmos", en: "Algorithms" }, "Java", "JPA", "Spring Boot", "HTML", "CSS"],
  },
];

export default experience;

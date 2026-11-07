// tagline, description y algunos tags son bilingües ({ es, en }); se resuelven con tr().
const labDemos = [
  {
    id: "facetrack",
    name: "FaceTrack",
    tagline: { es: "Visión artificial en vivo", en: "Live computer vision" },
    description: {
      es: "Usá tu webcam para ver cómo FaceTrack detecta rostros, dibuja la malla de 478 landmarks, sigue tus parpadeos y resuelve un desafío de liveness. Corre 100% en tu navegador.",
      en: "Use your webcam to see how FaceTrack detects faces, draws the 478-landmark mesh, tracks your blinks and solves a liveness challenge. It runs 100% in your browser.",
    },
    status: "available",
    path: "/lab/facetrack",
    tech: ["MediaPipe", "WebAssembly", "Canvas"],
  },
  {
    id: "synctune",
    name: "SyncTune",
    tagline: { es: "Matching YouTube → Spotify", en: "YouTube → Spotify matching" },
    description: {
      es: "Pegá el título de un video de YouTube y mirá paso a paso cómo el algoritmo real de SyncTune lo limpia, arma las búsquedas y puntúa cada candidato.",
      en: "Paste a YouTube video title and watch, step by step, how SyncTune's real algorithm cleans it up, builds the searches and scores each candidate.",
    },
    status: "available",
    path: "/lab/synctune",
    tech: ["Matching", "Ratcliff/Obershelp", { es: "Catálogo de ejemplo", en: "Sample catalog" }],
  },
  {
    id: "siem",
    name: { es: "SIEM Inteligente", en: "Intelligent SIEM" },
    tagline: { es: "Detección de anomalías en logs", en: "Log anomaly detection" },
    description: {
      es: "Inyectá ataques (fuerza bruta, acceso nocturno, movimiento lateral) en una ventana de logs y mirá cómo el motor de la tesis los detecta con Isolation Forest, DBSCAN y reglas de correlación.",
      en: "Inject attacks (brute force, night-time access, lateral movement) into a window of logs and watch the thesis engine catch them with Isolation Forest, DBSCAN and correlation rules.",
    },
    status: "available",
    path: "/lab/siem",
    tech: ["Isolation Forest", "DBSCAN", { es: "Logs sintéticos", en: "Synthetic logs" }],
  },
];

export default labDemos;

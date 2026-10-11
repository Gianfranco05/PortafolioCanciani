const labDemos = [
  {
    id: "facetrack",
    name: "FaceTrack",
    tagline: "Visión artificial en vivo",
    description:
      "Usá tu webcam para ver cómo FaceTrack detecta rostros, dibuja la malla de 478 landmarks, sigue tus parpadeos y resuelve un desafío de liveness. Corre 100% en tu navegador.",
    status: "available",
    path: "/lab/facetrack",
    tech: ["MediaPipe", "WebAssembly", "Canvas"],
  },
  {
    id: "synctune",
    name: "SyncTune",
    tagline: "Matching YouTube → Spotify",
    description:
      "Pegá el título de un video de YouTube y mirá paso a paso cómo el algoritmo real de SyncTune lo limpia, arma las búsquedas y puntúa cada candidato.",
    status: "available",
    path: "/lab/synctune",
    tech: ["Matching", "Ratcliff/Obershelp", "Catálogo de ejemplo"],
  },
  {
    id: "siem",
    name: "SIEM Inteligente",
    tagline: "Detección de anomalías en logs",
    description:
      "Inyectá ataques (fuerza bruta, acceso nocturno, movimiento lateral) en una ventana de logs y mirá cómo el motor de la tesis los detecta con Isolation Forest, DBSCAN y reglas de correlación.",
    status: "available",
    path: "/lab/siem",
    tech: ["Isolation Forest", "DBSCAN", "Logs sintéticos"],
  },
];

export default labDemos;

// Carga diferida de MediaPipe Face Landmarker.
// El import es dinámico a propósito: la librería, el WebAssembly (~3 MB) y el modelo (~3.7 MB)
// se descargan solo cuando el visitante inicia la demo, nunca al cargar el portafolio.
const MEDIAPIPE_VERSION = "1.0.1";
const WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`;
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

let loadingPromise = null;

async function createLandmarker(vision, FaceLandmarker, delegate) {
  return FaceLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: MODEL_URL, delegate },
    runningMode: "VIDEO",
    numFaces: 4,
    outputFaceBlendshapes: true,
  });
}

export function loadFaceLandmarker() {
  if (!loadingPromise) {
    loadingPromise = (async () => {
      const mp = await import("@mediapipe/tasks-vision");
      const vision = await mp.FilesetResolver.forVisionTasks(WASM_URL);
      let landmarker;
      try {
        landmarker = await createLandmarker(vision, mp.FaceLandmarker, "GPU");
      } catch {
        // Algunos navegadores/dispositivos no soportan el delegate GPU.
        landmarker = await createLandmarker(vision, mp.FaceLandmarker, "CPU");
      }
      return { landmarker, FaceLandmarker: mp.FaceLandmarker, DrawingUtils: mp.DrawingUtils };
    })().catch((err) => {
      loadingPromise = null; // permite reintentar si falló la red
      throw err;
    });
  }
  return loadingPromise;
}

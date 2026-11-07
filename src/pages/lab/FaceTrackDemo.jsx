import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaExclamationTriangle } from 'react-icons/fa';
import { LuArrowLeft, LuVideo, LuSquare, LuImage, LuLock, LuCircleCheck } from 'react-icons/lu';
import { motion, useReducedMotion } from 'framer-motion';
import { loadFaceLandmarker } from '../../lib/faceLandmarker';
import { CLOSE_THRESHOLD, createBlinkTracker, eyeClosureScore } from '../../lib/blink';
import { EASE } from '../../lib/motion';
import useLang from '../../i18n/useLang';
import useDocumentMeta from '../../i18n/useDocumentMeta';

const CHALLENGE_BLINKS = 2;
const CHALLENGE_SECONDS = 10;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

const TEXT = {
  es: {
    metaTitle: "FaceTrack — Demo en vivo",
    metaDescription: "Probá en tu navegador la detección de rostros, la malla de 478 landmarks, el seguimiento de parpadeo y un desafío de liveness con MediaPipe.",
    back: "Volver al Lab",
    titleSuffix: "— demo en vivo",
    intro: "Detección de rostros, malla de landmarks, seguimiento de parpadeo y un desafío de liveness, con el mismo motor de visión (MediaPipe) que usa FaceTrack.",
    privacyBefore: "Todo corre en tu navegador: la imagen de tu cámara ",
    privacyStrong: "no se envía ni se guarda",
    privacyAfter: " en ningún lado. Al iniciar se descargan unos 7 MB (motor de visión y modelo) — solo la primera vez, después quedan en caché.",
    idleHint: "Iniciá la cámara o subí una foto para empezar.",
    loading: "Cargando motor de visión…",
    startCamera: "Iniciar cámara",
    stop: "Detener",
    uploadPhoto: "Subir foto",
    statFaces: "Rostros",
    statEyes: "Ojos",
    statBlinks: "Parpadeos",
    statFps: "FPS",
    eyeClosed: "cerrado",
    eyeOpen: "abierto",
    challengeTitle: "Desafío de liveness",
    challengeDesc: (blinks, seconds) => `Parpadeá ${blinks} veces en ${seconds} segundos para demostrar que sos una persona frente a la cámara y no una foto.`,
    challengeStart: "Iniciar desafío",
    challengeNeedsCamera: "Necesita la cámara encendida",
    noFace: "No veo ningún rostro…",
    blinkNow: "¡Parpadeá!",
    live: "LIVE",
    unknown: "UNKNOWN — no concluyente",
    challengeRepeat: "Repetir desafío",
    challengeNote: "Es una prueba básica, no un mecanismo de seguridad biométrica.",
    pipelineTitle: "Pipeline",
    stepCamera: "Cámara",
    stepImage: "Imagen",
    stepDetection: "Detección de rostro",
    stepLandmarks: "478 landmarks",
    stepBlink: "Seguimiento de parpadeo",
    stepLiveness: "Liveness",
    realTitle: "Qué es real en esta demo",
    real: [
      "Detección de hasta 4 rostros por frame.",
      "Malla de 478 landmarks faciales en tiempo real.",
      "Parpadeo detectado a partir de los blendshapes del modelo.",
      "Desafío de liveness por parpadeo.",
    ],
    fullTitle: "Qué queda en el proyecto completo",
    full: [
      "Reconocimiento de identidad con embeddings (conocido / desconocido).",
      "Gestión de personas, asistencia e historial en PostgreSQL.",
      "API REST en FastAPI y dashboard de estadísticas.",
    ],
    viewCode: "Ver el código de FaceTrack",
    errors: {
      noApi: "Tu navegador no permite acceder a la cámara (hace falta HTTPS o un navegador más reciente).",
      denied: "No se otorgó permiso para usar la cámara. Podés habilitarlo desde la barra de direcciones, o probar subiendo una foto.",
      notFound: "No se encontró ninguna cámara. Podés probar la demo subiendo una foto.",
      inUse: "La cámara está siendo usada por otra aplicación.",
      cameraFail: "No se pudo iniciar la cámara.",
      model: "No se pudo cargar el modelo de visión. Revisá tu conexión e intentá de nuevo.",
      notImage: "El archivo tiene que ser una imagen.",
      tooBig: "La imagen supera los 10 MB.",
      imageFail: "No se pudo procesar la imagen. Probá con otra foto o revisá tu conexión.",
    },
  },
  en: {
    metaTitle: "FaceTrack — Live demo",
    metaDescription: "Try face detection, a 478-landmark mesh, blink tracking and a liveness challenge right in your browser, powered by MediaPipe.",
    back: "Back to Lab",
    titleSuffix: "— live demo",
    intro: "Face detection, landmark mesh, blink tracking and a liveness challenge, using the same vision engine (MediaPipe) that FaceTrack runs on.",
    privacyBefore: "Everything runs in your browser: your camera image ",
    privacyStrong: "is never sent or stored",
    privacyAfter: " anywhere. On start, about 7 MB are downloaded (vision engine and model) — only the first time, then they stay cached.",
    idleHint: "Start the camera or upload a photo to begin.",
    loading: "Loading vision engine…",
    startCamera: "Start camera",
    stop: "Stop",
    uploadPhoto: "Upload photo",
    statFaces: "Faces",
    statEyes: "Eyes",
    statBlinks: "Blinks",
    statFps: "FPS",
    eyeClosed: "closed",
    eyeOpen: "open",
    challengeTitle: "Liveness challenge",
    challengeDesc: (blinks, seconds) => `Blink ${blinks} times within ${seconds} seconds to prove you are a real person in front of the camera and not a photo.`,
    challengeStart: "Start challenge",
    challengeNeedsCamera: "Camera must be on",
    noFace: "I can't see any face…",
    blinkNow: "Blink!",
    live: "LIVE",
    unknown: "UNKNOWN — inconclusive",
    challengeRepeat: "Repeat challenge",
    challengeNote: "This is a basic test, not a biometric security mechanism.",
    pipelineTitle: "Pipeline",
    stepCamera: "Camera",
    stepImage: "Image",
    stepDetection: "Face detection",
    stepLandmarks: "478 landmarks",
    stepBlink: "Blink tracking",
    stepLiveness: "Liveness",
    realTitle: "What is real in this demo",
    real: [
      "Detection of up to 4 faces per frame.",
      "Real-time mesh of 478 facial landmarks.",
      "Blinks detected from the model's blendshapes.",
      "Blink-based liveness challenge.",
    ],
    fullTitle: "What the full project adds",
    full: [
      "Identity recognition with embeddings (known / unknown).",
      "People management, attendance and history in PostgreSQL.",
      "REST API in FastAPI and a statistics dashboard.",
    ],
    viewCode: "View the FaceTrack code",
    errors: {
      noApi: "Your browser can't access the camera (HTTPS or a more recent browser is required).",
      denied: "Camera permission was not granted. You can enable it from the address bar, or try uploading a photo.",
      notFound: "No camera found. You can try the demo by uploading a photo.",
      inUse: "The camera is being used by another application.",
      cameraFail: "Could not start the camera.",
      model: "Could not load the vision model. Check your connection and try again.",
      notImage: "The file must be an image.",
      tooBig: "The image exceeds 10 MB.",
      imageFail: "Could not process the image. Try another photo or check your connection.",
    },
  },
};

const EMPTY_STATS = { faces: 0, eye: null, blinks: 0, fps: 0 };

// Devuelve un código de error; el texto se resuelve al renderizar según el idioma.
function cameraErrorCode(err) {
  if (!navigator.mediaDevices?.getUserMedia) return "noApi";
  switch (err?.name) {
    case "NotAllowedError":
      return "denied";
    case "NotFoundError":
    case "OverconstrainedError":
      return "notFound";
    case "NotReadableError":
      return "inUse";
    default:
      return "cameraFail";
  }
}

function drawFaces(ctx, drawer, FaceLandmarker, faces, width, height) {
  for (const landmarks of faces) {
    drawer.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: "rgba(247,245,240,0.16)", lineWidth: 1 });
    drawer.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { color: "rgba(247,245,240,0.7)", lineWidth: 2 });
    drawer.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: "#f7f5f0", lineWidth: 2 });
    drawer.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: "#f7f5f0", lineWidth: 2 });
    drawer.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, { color: "rgba(247,245,240,0.6)", lineWidth: 1.5 });

    let minX = 1, minY = 1, maxX = 0, maxY = 0;
    for (const p of landmarks) {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }
    ctx.strokeStyle = "rgba(214,211,209,0.9)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(minX * width - 12, minY * height - 12, (maxX - minX) * width + 24, (maxY - minY) * height + 24);
    ctx.setLineDash([]);
  }
}

export default function FaceTrackDemo() {
  const { lang } = useLang();
  const t = TEXT[lang];
  useDocumentMeta({ title: t.metaTitle, description: t.metaDescription });
  const shouldReduceMotion = useReducedMotion();

  const [phase, setPhase] = useState("idle"); // idle | loading | ready | error
  const [cameraOn, setCameraOn] = useState(false);
  const [photoMode, setPhotoMode] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [challenge, setChallenge] = useState({ state: "idle", remaining: CHALLENGE_SECONDS });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const mpRef = useRef(null); // { landmarker, FaceLandmarker, DrawingUtils }
  const drawerRef = useRef(null);
  const runningModeRef = useRef("VIDEO");
  const lastVideoTimeRef = useRef(-1);
  const blinkTrackerRef = useRef(createBlinkTracker());
  const blinkCountRef = useRef(0);
  const challengeRef = useRef({ state: "idle", startBlinks: 0, deadline: 0 });
  const fpsRef = useRef({ frames: 0, since: 0, value: 0 });

  // Actualiza estado solo si algo cambió, así el loop de cámara no re-renderiza en cada frame.
  const pushStats = useCallback((next) => {
    setStats((prev) =>
      prev.faces === next.faces && prev.eye === next.eye && prev.blinks === next.blinks && prev.fps === next.fps ? prev : next
    );
  }, []);

  const getDrawer = useCallback((ctx) => {
    if (!drawerRef.current || drawerRef.current.ctx !== ctx) {
      drawerRef.current = { ctx, utils: new mpRef.current.DrawingUtils(ctx) };
    }
    return drawerRef.current.utils;
  }, []);

  const setRunningMode = useCallback(async (mode) => {
    if (runningModeRef.current !== mode) {
      await mpRef.current.landmarker.setOptions({ runningMode: mode });
      runningModeRef.current = mode;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    challengeRef.current = { state: "idle", startBlinks: 0, deadline: 0 };
    setChallenge({ state: "idle", remaining: CHALLENGE_SECONDS });
    setCameraOn(false);
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const updateChallenge = useCallback((faces, now) => {
    const c = challengeRef.current;
    if (c.state !== "active") return;
    const done = blinkCountRef.current - c.startBlinks;
    if (faces > 0 && done >= CHALLENGE_BLINKS) {
      c.state = "live";
      setChallenge({ state: "live", remaining: 0 });
      return;
    }
    const remaining = Math.max(0, Math.ceil((c.deadline - now) / 1000));
    if (remaining === 0) {
      c.state = "timeout";
      setChallenge({ state: "timeout", remaining: 0 });
      return;
    }
    setChallenge((prev) => (prev.state === "active" && prev.remaining === remaining ? prev : { state: "active", remaining }));
  }, []);

  const loop = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const mp = mpRef.current;
    if (!video || !canvas || !mp || !streamRef.current) return;

    if (video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;
      const now = performance.now();
      try {
        const result = mp.landmarker.detectForVideo(video, now);
        const w = video.videoWidth;
        const h = video.videoHeight;
        if (canvas.width !== w) canvas.width = w;
        if (canvas.height !== h) canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, w, h);
        drawFaces(ctx, getDrawer(ctx), mp.FaceLandmarker, result.faceLandmarks, w, h);

        const faces = result.faceLandmarks.length;
        let eye = null;
        if (faces > 0) {
          const { closed, blinked } = blinkTrackerRef.current.update(eyeClosureScore(result.faceBlendshapes?.[0]));
          if (blinked) blinkCountRef.current += 1;
          eye = closed ? "closed" : "open";
        }

        const fps = fpsRef.current;
        fps.frames += 1;
        if (now - fps.since >= 1000) {
          fps.value = Math.round((fps.frames * 1000) / (now - fps.since));
          fps.frames = 0;
          fps.since = now;
        }
        pushStats({ faces, eye, blinks: blinkCountRef.current, fps: fps.value });
        updateChallenge(faces, now);
      } catch (err) {
        console.error("FaceTrack demo: error procesando frame", err);
      }
    }
    rafRef.current = requestAnimationFrame(loop);
  }, [getDrawer, pushStats, updateChallenge]);

  const startCamera = async () => {
    if (phase === "loading" || cameraOn) return;
    setError(null);
    setPhotoMode(false);
    setPhase("loading");

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
    } catch (err) {
      setError(cameraErrorCode(err));
      setPhase("error");
      return;
    }

    streamRef.current = stream;
    const video = videoRef.current;
    video.srcObject = stream;
    setCameraOn(true);

    try {
      await video.play();
      mpRef.current = await loadFaceLandmarker();
      await setRunningMode("VIDEO");
    } catch (err) {
      console.error("FaceTrack demo: no se pudo cargar el modelo", err);
      stopCamera();
      setError("model");
      setPhase("error");
      return;
    }

    blinkTrackerRef.current.reset();
    blinkCountRef.current = 0;
    lastVideoTimeRef.current = -1;
    fpsRef.current = { frames: 0, since: performance.now(), value: 0 };
    pushStats(EMPTY_STATS);
    setPhase("ready");
    rafRef.current = requestAnimationFrame(loop);
  };

  const handleStop = () => {
    stopCamera();
    pushStats(EMPTY_STATS);
    setPhase("idle");
  };

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("notImage");
      setPhase("error");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError("tooBig");
      setPhase("error");
      return;
    }

    stopCamera();
    setError(null);
    setPhase("loading");

    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      mpRef.current = await loadFaceLandmarker();
      await setRunningMode("IMAGE");
      const result = mpRef.current.landmarker.detect(img);

      const canvas = canvasRef.current;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      drawFaces(ctx, getDrawer(ctx), mpRef.current.FaceLandmarker, result.faceLandmarks, canvas.width, canvas.height);

      const faces = result.faceLandmarks.length;
      const score = faces > 0 ? eyeClosureScore(result.faceBlendshapes?.[0]) : null;
      pushStats({ faces, eye: score == null ? null : score >= CLOSE_THRESHOLD ? "closed" : "open", blinks: 0, fps: 0 });
      setPhotoMode(true);
      setPhase("ready");
    } catch (err) {
      console.error("FaceTrack demo: no se pudo procesar la imagen", err);
      setError("imageFail");
      setPhase("error");
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const startChallenge = () => {
    if (!cameraOn || phase !== "ready") return;
    challengeRef.current = {
      state: "active",
      startBlinks: blinkCountRef.current,
      deadline: performance.now() + CHALLENGE_SECONDS * 1000,
    };
    setChallenge({ state: "active", remaining: CHALLENGE_SECONDS });
  };

  const detecting = phase === "ready" && stats.faces > 0;
  const pipeline = [
    { id: "source", label: cameraOn ? t.stepCamera : t.stepImage, active: phase === "ready" },
    { id: "detection", label: t.stepDetection, active: detecting },
    { id: "landmarks", label: t.stepLandmarks, active: detecting },
    { id: "blink", label: t.stepBlink, active: detecting && cameraOn },
    { id: "liveness", label: t.stepLiveness, active: challenge.state === "live" },
  ];

  const fadeIn = shouldReduceMotion ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

  return (
    <section id="main-content" className="min-h-screen bg-stone-900 pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div {...fadeIn} transition={{ duration: 0.6, ease: EASE }} className="mb-8">
          <Link to="/lab" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-white transition-colors mb-6">
            <LuArrowLeft className="text-xs" /> {t.back}
          </Link>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            FaceTrack <span className="text-stone-500">{t.titleSuffix}</span>
          </h1>
          <p className="text-stone-400 max-w-3xl text-lg leading-relaxed">
            {t.intro}
          </p>
        </motion.div>

        <div className="flex items-start gap-3 bg-stone-800/50 border border-stone-700/50 rounded-xl px-5 py-4 mb-8 text-sm text-stone-300">
          <LuLock className="mt-0.5 shrink-0 text-stone-400" />
          <p>
            {t.privacyBefore}<strong className="text-white">{t.privacyStrong}</strong>{t.privacyAfter}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Visor */}
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden border border-stone-700/50 bg-stone-950 min-h-[280px] flex items-center justify-center">
              {/* El wrapper toma exactamente el tamaño del video, así la malla del canvas
                  queda alineada aunque el visor tenga altura mínima. */}
              <div className={cameraOn || photoMode ? "relative w-full" : "hidden"}>
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className={cameraOn ? "block w-full h-auto -scale-x-100" : "hidden"}
                />
                <canvas
                  ref={canvasRef}
                  className={
                    cameraOn
                      ? "absolute inset-0 w-full h-full -scale-x-100 pointer-events-none"
                      : "block w-full h-auto max-h-[70vh] object-contain"
                  }
                />
              </div>

              {phase === "idle" && !cameraOn && !photoMode && (
                <div className="text-center px-6 py-16">
                  <LuVideo className="text-4xl text-stone-600 mx-auto mb-4" />
                  <p className="text-stone-400">{t.idleHint}</p>
                </div>
              )}

              {phase === "loading" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-stone-950/70 text-stone-300">
                  <div className="w-10 h-10 rounded-full border-2 border-stone-700 border-t-white animate-spin" />
                  <p className="text-sm">{t.loading}</p>
                </div>
              )}

              {phase === "error" && (
                <div className="text-center px-6 py-16 max-w-md">
                  <FaExclamationTriangle className="text-3xl text-amber-400 mx-auto mb-4" />
                  <p className="text-stone-300">{t.errors[error]}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              {!cameraOn ? (
                <button
                  type="button"
                  onClick={startCamera}
                  disabled={phase === "loading"}
                  className="btn-shine inline-flex items-center gap-2 bg-stone-100 hover:bg-white disabled:bg-stone-500 disabled:cursor-not-allowed text-stone-950 px-5 py-2.5 rounded-lg font-medium transition-colors"
                >
                  <LuVideo className="text-sm" /> {t.startCamera}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStop}
                  className="inline-flex items-center gap-2 bg-stone-700 hover:bg-stone-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                >
                  <LuSquare className="text-sm" /> {t.stop}
                </button>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={phase === "loading"}
                className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed text-stone-200 px-5 py-2.5 rounded-lg font-medium border border-stone-700 transition-colors"
              >
                <LuImage className="text-sm" /> {t.uploadPhoto}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </div>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "faces", label: t.statFaces, value: phase === "ready" ? stats.faces : "—" },
                { id: "eyes", label: t.statEyes, value: stats.eye === "closed" ? t.eyeClosed : stats.eye === "open" ? t.eyeOpen : "—" },
                { id: "blinks", label: t.statBlinks, value: cameraOn && phase === "ready" ? stats.blinks : "—" },
                { id: "fps", label: t.statFps, value: cameraOn && stats.fps ? stats.fps : "—" },
              ].map(({ id, label, value }) => (
                <div key={id} className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wider text-stone-500 mb-1">{label}</p>
                  <p className="text-2xl font-bold text-white capitalize tabular-nums">{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-5">
              <h3 className="text-white font-bold mb-1">{t.challengeTitle}</h3>
              <p className="text-sm text-stone-400 mb-4">
                {t.challengeDesc(CHALLENGE_BLINKS, CHALLENGE_SECONDS)}
              </p>

              {challenge.state === "idle" && (
                <button
                  type="button"
                  onClick={startChallenge}
                  disabled={!cameraOn || phase !== "ready"}
                  className="w-full bg-stone-100 hover:bg-white disabled:bg-stone-700 disabled:text-stone-500 disabled:cursor-not-allowed text-stone-950 px-4 py-2.5 rounded-lg font-medium transition-colors"
                >
                  {cameraOn ? t.challengeStart : t.challengeNeedsCamera}
                </button>
              )}
              {challenge.state === "active" && (
                <p className="text-center text-lg font-bold text-white py-2">
                  {stats.faces === 0 ? t.noFace : t.blinkNow}{" "}
                  <span className="text-stone-400 font-medium tabular-nums">{challenge.remaining}s</span>
                </p>
              )}
              {challenge.state === "live" && (
                <div className="flex items-center justify-center gap-2 text-green-400 font-bold text-lg py-2">
                  <LuCircleCheck /> {t.live}
                </div>
              )}
              {challenge.state === "timeout" && (
                <p className="text-center text-amber-400 font-bold py-2">{t.unknown}</p>
              )}
              {(challenge.state === "live" || challenge.state === "timeout") && (
                <button
                  type="button"
                  onClick={startChallenge}
                  className="w-full mt-2 text-sm text-stone-400 hover:text-white transition-colors"
                >
                  {t.challengeRepeat}
                </button>
              )}
              <p className="text-xs text-stone-500 mt-4">
                {t.challengeNote}
              </p>
            </div>

            <div className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-5">
              <h3 className="text-white font-bold mb-4">{t.pipelineTitle}</h3>
              <ol className="space-y-3">
                {pipeline.map((step, i) => (
                  <li key={step.id} className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        step.active ? "bg-stone-100 text-stone-950" : "bg-stone-800 text-stone-500 border border-stone-700"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className={`text-sm transition-colors ${step.active ? "text-white" : "text-stone-500"}`}>{step.label}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Qué es real */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-stone-800/30 border border-stone-700/40 rounded-xl p-6">
            <h3 className="text-white font-bold mb-3">{t.realTitle}</h3>
            <ul className="space-y-2 text-sm text-stone-400 list-disc pl-5">
              {t.real.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-stone-800/30 border border-stone-700/40 rounded-xl p-6">
            <h3 className="text-white font-bold mb-3">{t.fullTitle}</h3>
            <ul className="space-y-2 text-sm text-stone-400 list-disc pl-5">
              {t.full.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a
              href="https://github.com/Gianfranco05/reconocimiento_facial"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm text-stone-300 hover:text-white transition-colors"
            >
              <FaGithub /> {t.viewCode}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

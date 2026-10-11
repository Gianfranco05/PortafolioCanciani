import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaExclamationTriangle } from 'react-icons/fa';
import { LuArrowLeft, LuVideo, LuSquare, LuImage, LuLock, LuCircleCheck } from 'react-icons/lu';
import { motion, useReducedMotion } from 'framer-motion';
import { loadFaceLandmarker } from '../../lib/faceLandmarker';
import { CLOSE_THRESHOLD, createBlinkTracker, eyeClosureScore } from '../../lib/blink';
import { EASE } from '../../lib/motion';

const CHALLENGE_BLINKS = 2;
const CHALLENGE_SECONDS = 10;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

const EMPTY_STATS = { faces: 0, eye: null, blinks: 0, fps: 0 };

function cameraErrorMessage(err) {
  if (!navigator.mediaDevices?.getUserMedia) return "Tu navegador no permite acceder a la cámara (hace falta HTTPS o un navegador más reciente).";
  switch (err?.name) {
    case "NotAllowedError":
      return "No se otorgó permiso para usar la cámara. Podés habilitarlo desde la barra de direcciones, o probar subiendo una foto.";
    case "NotFoundError":
    case "OverconstrainedError":
      return "No se encontró ninguna cámara. Podés probar la demo subiendo una foto.";
    case "NotReadableError":
      return "La cámara está siendo usada por otra aplicación.";
    default:
      return null;
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
          eye = closed ? "cerrado" : "abierto";
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
      setError(cameraErrorMessage(err) || "No se pudo iniciar la cámara.");
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
      setError("No se pudo cargar el modelo de visión. Revisá tu conexión e intentá de nuevo.");
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
      setError("El archivo tiene que ser una imagen.");
      setPhase("error");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError("La imagen supera los 10 MB.");
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
      pushStats({ faces, eye: score == null ? null : score >= CLOSE_THRESHOLD ? "cerrado" : "abierto", blinks: 0, fps: 0 });
      setPhotoMode(true);
      setPhase("ready");
    } catch (err) {
      console.error("FaceTrack demo: no se pudo procesar la imagen", err);
      setError("No se pudo procesar la imagen. Probá con otra foto o revisá tu conexión.");
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
    { label: cameraOn ? "Cámara" : "Imagen", active: phase === "ready" },
    { label: "Detección de rostro", active: detecting },
    { label: "478 landmarks", active: detecting },
    { label: "Seguimiento de parpadeo", active: detecting && cameraOn },
    { label: "Liveness", active: challenge.state === "live" },
  ];

  const fadeIn = shouldReduceMotion ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

  return (
    <section id="main-content" className="min-h-screen bg-stone-900 pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div {...fadeIn} transition={{ duration: 0.6, ease: EASE }} className="mb-8">
          <Link to="/lab" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-white transition-colors mb-6">
            <LuArrowLeft className="text-xs" /> Volver al Lab
          </Link>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            FaceTrack <span className="text-stone-500">— demo en vivo</span>
          </h1>
          <p className="text-stone-400 max-w-3xl text-lg leading-relaxed">
            Detección de rostros, malla de landmarks, seguimiento de parpadeo y un desafío de liveness, con el mismo motor de visión (MediaPipe) que usa FaceTrack.
          </p>
        </motion.div>

        <div className="flex items-start gap-3 bg-stone-800/50 border border-stone-700/50 rounded-xl px-5 py-4 mb-8 text-sm text-stone-300">
          <LuLock className="mt-0.5 shrink-0 text-stone-400" />
          <p>
            Todo corre en tu navegador: la imagen de tu cámara <strong className="text-white">no se envía ni se guarda</strong> en ningún lado.
            Al iniciar se descargan unos 7 MB (motor de visión y modelo) — solo la primera vez, después quedan en caché.
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
                  <p className="text-stone-400">Iniciá la cámara o subí una foto para empezar.</p>
                </div>
              )}

              {phase === "loading" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-stone-950/70 text-stone-300">
                  <div className="w-10 h-10 rounded-full border-2 border-stone-700 border-t-white animate-spin" />
                  <p className="text-sm">Cargando motor de visión…</p>
                </div>
              )}

              {phase === "error" && (
                <div className="text-center px-6 py-16 max-w-md">
                  <FaExclamationTriangle className="text-3xl text-amber-400 mx-auto mb-4" />
                  <p className="text-stone-300">{error}</p>
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
                  <LuVideo className="text-sm" /> Iniciar cámara
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStop}
                  className="inline-flex items-center gap-2 bg-stone-700 hover:bg-stone-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                >
                  <LuSquare className="text-sm" /> Detener
                </button>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={phase === "loading"}
                className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed text-stone-200 px-5 py-2.5 rounded-lg font-medium border border-stone-700 transition-colors"
              >
                <LuImage className="text-sm" /> Subir foto
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </div>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Rostros", value: phase === "ready" ? stats.faces : "—" },
                { label: "Ojos", value: stats.eye ?? "—" },
                { label: "Parpadeos", value: cameraOn && phase === "ready" ? stats.blinks : "—" },
                { label: "FPS", value: cameraOn && stats.fps ? stats.fps : "—" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wider text-stone-500 mb-1">{label}</p>
                  <p className="text-2xl font-bold text-white capitalize tabular-nums">{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-5">
              <h3 className="text-white font-bold mb-1">Desafío de liveness</h3>
              <p className="text-sm text-stone-400 mb-4">
                Parpadeá {CHALLENGE_BLINKS} veces en {CHALLENGE_SECONDS} segundos para demostrar que sos una persona frente a la cámara y no una foto.
              </p>

              {challenge.state === "idle" && (
                <button
                  type="button"
                  onClick={startChallenge}
                  disabled={!cameraOn || phase !== "ready"}
                  className="w-full bg-stone-100 hover:bg-white disabled:bg-stone-700 disabled:text-stone-500 disabled:cursor-not-allowed text-stone-950 px-4 py-2.5 rounded-lg font-medium transition-colors"
                >
                  {cameraOn ? "Iniciar desafío" : "Necesita la cámara encendida"}
                </button>
              )}
              {challenge.state === "active" && (
                <p className="text-center text-lg font-bold text-white py-2">
                  {stats.faces === 0 ? "No veo ningún rostro…" : "¡Parpadeá!"}{" "}
                  <span className="text-stone-400 font-medium tabular-nums">{challenge.remaining}s</span>
                </p>
              )}
              {challenge.state === "live" && (
                <div className="flex items-center justify-center gap-2 text-green-400 font-bold text-lg py-2">
                  <LuCircleCheck /> LIVE
                </div>
              )}
              {challenge.state === "timeout" && (
                <p className="text-center text-amber-400 font-bold py-2">UNKNOWN — no concluyente</p>
              )}
              {(challenge.state === "live" || challenge.state === "timeout") && (
                <button
                  type="button"
                  onClick={startChallenge}
                  className="w-full mt-2 text-sm text-stone-400 hover:text-white transition-colors"
                >
                  Repetir desafío
                </button>
              )}
              <p className="text-xs text-stone-500 mt-4">
                Es una prueba básica, no un mecanismo de seguridad biométrica.
              </p>
            </div>

            <div className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-5">
              <h3 className="text-white font-bold mb-4">Pipeline</h3>
              <ol className="space-y-3">
                {pipeline.map((step, i) => (
                  <li key={step.label} className="flex items-center gap-3">
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
            <h3 className="text-white font-bold mb-3">Qué es real en esta demo</h3>
            <ul className="space-y-2 text-sm text-stone-400 list-disc pl-5">
              <li>Detección de hasta 4 rostros por frame.</li>
              <li>Malla de 478 landmarks faciales en tiempo real.</li>
              <li>Parpadeo detectado a partir de los blendshapes del modelo.</li>
              <li>Desafío de liveness por parpadeo.</li>
            </ul>
          </div>
          <div className="bg-stone-800/30 border border-stone-700/40 rounded-xl p-6">
            <h3 className="text-white font-bold mb-3">Qué queda en el proyecto completo</h3>
            <ul className="space-y-2 text-sm text-stone-400 list-disc pl-5">
              <li>Reconocimiento de identidad con embeddings (conocido / desconocido).</li>
              <li>Gestión de personas, asistencia e historial en PostgreSQL.</li>
              <li>API REST en FastAPI y dashboard de estadísticas.</li>
            </ul>
            <a
              href="https://github.com/Gianfranco05/reconocimiento_facial"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm text-stone-300 hover:text-white transition-colors"
            >
              <FaGithub /> Ver el código de FaceTrack
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

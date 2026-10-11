import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LuArrowLeft, LuInfo, LuYoutube, LuMusic, LuArrowRight } from 'react-icons/lu';
import { motion, useReducedMotion } from 'framer-motion';
import { catalog, examples } from '../../data/synctuneCatalog';
import {
  CONFIDENCE_HIGH,
  CONFIDENCE_MEDIUM,
  buildSearchQueries,
  cleanTitle,
  confidenceLevel,
  detectVersion,
  findNoise,
  guessArtistTrack,
  scoreCandidate,
} from '../../lib/synctuneMatcher';
import { EASE } from '../../lib/motion';

const WEIGHTS = [
  { key: "artist", label: "Artista", weight: 0.4 },
  { key: "title", label: "Título", weight: 0.4 },
  { key: "duration", label: "Duración", weight: 0.1 },
  { key: "version", label: "Versión", weight: 0.1 },
];

const LEVEL_STYLES = {
  alta: "bg-green-900/40 text-green-300 border-green-700/50",
  media: "bg-amber-900/30 text-amber-300 border-amber-700/50",
  baja: "bg-red-900/30 text-red-300 border-red-800/50",
};

// Capturas de la interfaz real de SyncTune, tomadas con datos de ejemplo (sin cuentas reales).
const SCREENS = [
  { id: "welcome", src: "/images/synctune/welcome.webp", caption: "Bienvenida", note: "Sin sesión: conectar Spotify y las tres promesas de la app." },
  { id: "import-song", src: "/images/synctune/import-song.webp", caption: "Importar canción", note: "Candidatos con carátula y badge de confianza alta, media o baja." },
  { id: "import-playlist", src: "/images/synctune/import-playlist.webp", caption: "Importar playlist", note: "Origen YouTube, revisión canción por canción y destino en Spotify." },
  { id: "dashboard", src: "/images/synctune/dashboard.webp", caption: "Dashboard", note: "Estadísticas de sincronización y actividad reciente." },
  { id: "connections", src: "/images/synctune/connections.webp", caption: "Conexiones", note: "Estado de Spotify y YouTube, sin mostrar tokens." },
  { id: "mobile", src: "/images/synctune/mobile.webp", caption: "Responsive", note: "La misma interfaz en 375 px de ancho." },
];

function parseDuration(text) {
  const m = text.trim().match(/^(\d{1,2}):([0-5]\d)$/);
  if (!m) return null;
  return (Number(m[1]) * 60 + Number(m[2])) * 1000;
}

function formatDuration(ms) {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function Step({ n, title, children }) {
  return (
    <div className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-5">
      <p className="text-xs uppercase tracking-wider text-stone-500 mb-2">
        Paso {n} · {title}
      </p>
      {children}
    </div>
  );
}

export default function SyncTuneDemo() {
  const shouldReduceMotion = useReducedMotion();
  const [title, setTitle] = useState(examples[0].title);
  const [durationText, setDurationText] = useState(formatDuration(examples[0].durationMs));

  const durationMs = parseDuration(durationText);
  const durationInvalid = durationText.trim() !== "" && durationMs === null;

  const analysis = useMemo(() => {
    if (!title.trim()) return null;
    const cleaned = cleanTitle(title);
    return {
      noise: findNoise(title),
      cleaned,
      guess: guessArtistTrack(cleaned),
      version: detectVersion(title),
      queries: buildSearchQueries(title),
      ranking: catalog
        .map((track) => ({ track, ...scoreCandidate(title, durationMs, track) }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5),
    };
  }, [title, durationMs]);

  const fadeIn = shouldReduceMotion ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

  return (
    <section id="main-content" className="min-h-screen bg-stone-900 pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div {...fadeIn} transition={{ duration: 0.6, ease: EASE }} className="mb-8">
          <Link to="/lab" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-white transition-colors mb-6">
            <LuArrowLeft className="text-xs" /> Volver al Lab
          </Link>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            SyncTune <span className="text-stone-500">— el matching por dentro</span>
          </h1>
          <p className="text-stone-400 max-w-3xl text-lg leading-relaxed">
            Pegá el título de un video de YouTube y mirá, paso a paso, cómo SyncTune lo limpia, arma las búsquedas y decide qué track de Spotify es el correcto.
          </p>
        </motion.div>

        <div className="flex items-start gap-3 bg-stone-800/50 border border-stone-700/50 rounded-xl px-5 py-4 mb-8 text-sm text-stone-300">
          <LuInfo className="mt-0.5 shrink-0 text-stone-400" />
          <p>
            El algoritmo es <strong className="text-white">el mismo de SyncTune</strong>, portado a JavaScript con idénticos patrones, pesos y umbrales.
            Lo que cambia es de dónde salen los candidatos: acá es un <strong className="text-white">catálogo de ejemplo</strong>, no la API de Spotify
            (la app real necesita OAuth, y Spotify limita las apps en desarrollo a 5 usuarios).
          </p>
        </div>

        {/* Entrada */}
        <div className="bg-stone-800/50 border border-stone-700/50 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
            <div className="space-y-2">
              <label htmlFor="yt-title" className="flex items-center gap-2 text-sm font-semibold text-stone-300">
                <LuYoutube className="text-stone-400" /> Título del video
              </label>
              <input
                id="yt-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                placeholder="Artista - Canción (Official Video)"
                className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:border-stone-400 focus:ring-stone-400 placeholder:text-stone-600"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="yt-duration" className="block text-sm font-semibold text-stone-300">Duración (m:ss)</label>
              <input
                id="yt-duration"
                type="text"
                inputMode="numeric"
                value={durationText}
                onChange={(e) => setDurationText(e.target.value)}
                placeholder="opcional"
                className={`w-full md:w-32 px-4 py-3 bg-stone-900 border rounded-xl text-white focus:outline-none focus:ring-1 placeholder:text-stone-600 ${
                  durationInvalid ? "border-red-500 focus:ring-red-500" : "border-stone-700 focus:border-stone-400 focus:ring-stone-400"
                }`}
              />
            </div>
          </div>
          {durationInvalid && <p className="text-red-400 text-sm mt-2">Usá el formato m:ss (por ejemplo 3:45). Mientras tanto se ignora la duración.</p>}

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs text-stone-500 self-center mr-1">Ejemplos:</span>
            {examples.map((ex) => (
              <button
                key={ex.title}
                type="button"
                onClick={() => {
                  setTitle(ex.title);
                  setDurationText(formatDuration(ex.durationMs));
                }}
                className="text-xs bg-stone-900/60 hover:bg-stone-700 border border-stone-700 text-stone-300 px-3 py-1.5 rounded-full transition-colors text-left"
              >
                {ex.title}
              </button>
            ))}
          </div>
        </div>

        {!analysis ? (
          <p className="text-center text-stone-500 py-12">Escribí un título para ver el análisis.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Pasos */}
            <div className="lg:col-span-2 space-y-4">
              <Step n={1} title="Limpieza del título">
                {analysis.noise.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {analysis.noise.map((n, i) => (
                      <span key={`${n}-${i}`} className="text-xs line-through bg-red-900/20 text-red-300/80 border border-red-800/40 px-2 py-0.5 rounded">
                        {n}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 mb-3">No se detectó ruido para quitar.</p>
                )}
                <p className="text-white font-medium break-words">{analysis.cleaned || "—"}</p>
              </Step>

              <Step n={2} title="Artista y canción">
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                  <dt className="text-stone-500">Artista</dt>
                  <dd className="text-white break-words">{analysis.guess.artist ?? <span className="text-stone-500">no se pudo separar</span>}</dd>
                  <dt className="text-stone-500">Canción</dt>
                  <dd className="text-white break-words">{analysis.guess.track || "—"}</dd>
                  <dt className="text-stone-500">Versión</dt>
                  <dd className="text-white">{analysis.version ?? <span className="text-stone-500">original</span>}</dd>
                </dl>
              </Step>

              <Step n={3} title="Búsquedas en Spotify">
                <ol className="space-y-1.5">
                  {analysis.queries.map((q, i) => (
                    <li key={q} className="text-xs font-mono text-stone-300 bg-stone-900/60 border border-stone-700/50 rounded px-2 py-1.5 break-all">
                      <span className="text-stone-500 mr-2">{i + 1}.</span>{q}
                    </li>
                  ))}
                </ol>
                <p className="text-xs text-stone-500 mt-3">Se prueban en orden, de la más precisa a la más amplia.</p>
              </Step>
            </div>

            {/* Ranking */}
            <div className="lg:col-span-3">
              <div className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-5">
                <p className="text-xs uppercase tracking-wider text-stone-500 mb-1">Paso 4 · Puntaje de confianza</p>
                <p className="text-sm text-stone-400 mb-5">
                  Artista 40% + título 40% + duración 10% + versión 10%. Alta ≥ {CONFIDENCE_HIGH}, media ≥ {CONFIDENCE_MEDIUM}.
                </p>

                <ol className="space-y-4">
                  {analysis.ranking.map((r, idx) => {
                    const level = confidenceLevel(r.total);
                    return (
                      <li
                        key={r.track.id}
                        className={`rounded-xl border p-4 ${idx === 0 ? "border-stone-500 bg-stone-900/60" : "border-stone-700/50 bg-stone-900/30"}`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="min-w-0">
                            <p className="text-white font-semibold flex items-center gap-2 break-words">
                              <LuMusic className="text-stone-400 shrink-0" /> {r.track.name}
                            </p>
                            <p className="text-sm text-stone-400 break-words">
                              {r.track.artists} · {r.track.album} · {formatDuration(r.track.durationMs)}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-2xl font-bold text-white tabular-nums">{r.total}</p>
                            <span className={`inline-block text-[11px] font-semibold uppercase tracking-wider border rounded px-2 py-0.5 ${LEVEL_STYLES[level]}`}>
                              {level}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {WEIGHTS.map(({ key, label, weight }) => (
                            <div key={key}>
                              <div className="flex justify-between text-[11px] text-stone-500 mb-1">
                                <span>{label}</span>
                                <span className="tabular-nums">{Math.round(r.parts[key] * weight * 100)}/{weight * 100}</span>
                              </div>
                              <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                                <div className="h-full bg-stone-300 rounded-full" style={{ width: `${r.parts[key] * 100}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </li>
                    );
                  })}
                </ol>

                <p className="flex items-center gap-2 text-xs text-stone-500 mt-5">
                  <LuArrowRight className="shrink-0" />
                  En SyncTune el mejor candidato se muestra como preview y solo se agrega a Spotify cuando el usuario lo confirma.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* La app real */}
        <div className="mt-16">
          <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1db954] shrink-0" aria-hidden="true" />
            La app real
          </h2>
          <p className="text-stone-400 max-w-3xl mb-8 leading-relaxed">
            Así se ve SyncTune: interfaz oscura (también tiene tema claro) con acento verde, header fijo con pestañas,
            paleta de comandos con Ctrl+K y modos simple/avanzado y seguro/rápido. Las capturas usan datos de ejemplo.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCREENS.map((screen) => (
              <figure key={screen.id} className="group">
                <a
                  href={screen.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden rounded-xl border border-stone-700/50 bg-stone-950 hover:border-stone-500 transition-colors"
                  aria-label={`Ver captura de ${screen.caption} en tamaño completo`}
                >
                  <img
                    src={screen.src}
                    alt={`SyncTune — ${screen.caption}`}
                    loading="lazy"
                    width="1280"
                    height="800"
                    className="w-full aspect-[16/10] object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </a>
                <figcaption className="mt-3">
                  <p className="text-white font-semibold">{screen.caption}</p>
                  <p className="text-sm text-stone-500">{screen.note}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

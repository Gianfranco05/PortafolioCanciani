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
import useLang from '../../i18n/useLang';
import useDocumentMeta from '../../i18n/useDocumentMeta';
import tr from '../../i18n/tr';

const TEXT = {
  es: {
    metaTitle: "SyncTune — Matching por dentro",
    metaDescription: "Pegá el título de un video de YouTube y mirá cómo SyncTune lo limpia, arma las búsquedas y puntúa qué track de Spotify es el correcto.",
    back: "Volver al Lab",
    h1Suffix: "— el matching por dentro",
    intro: "Pegá el título de un video de YouTube y mirá, paso a paso, cómo SyncTune lo limpia, arma las búsquedas y decide qué track de Spotify es el correcto.",
    noteBefore: "El algoritmo es ",
    noteStrong1: "el mismo de SyncTune",
    noteMid: ", portado a JavaScript con idénticos patrones, pesos y umbrales. Lo que cambia es de dónde salen los candidatos: acá es un ",
    noteStrong2: "catálogo de ejemplo",
    noteAfter: ", no la API de Spotify (la app real necesita OAuth, y Spotify limita las apps en desarrollo a 5 usuarios).",
    videoTitle: "Título del video",
    titlePlaceholder: "Artista - Canción (Official Video)",
    durationLabel: "Duración (m:ss)",
    durationPlaceholder: "opcional",
    durationError: "Usá el formato m:ss (por ejemplo 3:45). Mientras tanto se ignora la duración.",
    examples: "Ejemplos:",
    empty: "Escribí un título para ver el análisis.",
    step: (n, title) => `Paso ${n} · ${title}`,
    step1: "Limpieza del título",
    noNoise: "No se detectó ruido para quitar.",
    step2: "Artista y canción",
    artist: "Artista",
    song: "Canción",
    version: "Versión",
    notSeparated: "no se pudo separar",
    original: "original",
    step3: "Búsquedas en Spotify",
    queriesNote: "Se prueban en orden, de la más precisa a la más amplia.",
    step4: "Puntaje de confianza",
    scoreFormula: (high, medium) => `Artista 40% + título 40% + duración 10% + versión 10%. Alta ≥ ${high}, media ≥ ${medium}.`,
    levels: { alta: "alta", media: "media", baja: "baja" },
    previewNote: "En SyncTune el mejor candidato se muestra como preview y solo se agrega a Spotify cuando el usuario lo confirma.",
    realApp: "La app real",
    realAppIntro: "Así se ve SyncTune: interfaz oscura (también tiene tema claro) con acento verde, header fijo con pestañas, paleta de comandos con Ctrl+K y modos simple/avanzado y seguro/rápido. Las capturas usan datos de ejemplo.",
    viewFull: (caption) => `Ver captura de ${caption} en tamaño completo`,
  },
  en: {
    metaTitle: "SyncTune — Matching explained",
    metaDescription: "Paste a YouTube video title and see how SyncTune cleans it, builds the searches and scores which Spotify track is the right one.",
    back: "Back to Lab",
    h1Suffix: "— matching under the hood",
    intro: "Paste a YouTube video title and see, step by step, how SyncTune cleans it, builds the searches and decides which Spotify track is the right one.",
    noteBefore: "The algorithm is ",
    noteStrong1: "the same one SyncTune uses",
    noteMid: ", ported to JavaScript with identical patterns, weights and thresholds. What changes is where the candidates come from: here it's a ",
    noteStrong2: "sample catalog",
    noteAfter: ", not the Spotify API (the real app needs OAuth, and Spotify limits apps in development mode to 5 users).",
    videoTitle: "Video title",
    titlePlaceholder: "Artist - Song (Official Video)",
    durationLabel: "Duration (m:ss)",
    durationPlaceholder: "optional",
    durationError: "Use the m:ss format (for example 3:45). Duration is ignored until then.",
    examples: "Examples:",
    empty: "Type a title to see the analysis.",
    step: (n, title) => `Step ${n} · ${title}`,
    step1: "Title cleanup",
    noNoise: "No noise detected to remove.",
    step2: "Artist and song",
    artist: "Artist",
    song: "Song",
    version: "Version",
    notSeparated: "could not be separated",
    original: "original",
    step3: "Spotify searches",
    queriesNote: "Tried in order, from the most precise to the broadest.",
    step4: "Confidence score",
    scoreFormula: (high, medium) => `Artist 40% + title 40% + duration 10% + version 10%. High ≥ ${high}, medium ≥ ${medium}.`,
    levels: { alta: "high", media: "medium", baja: "low" },
    previewNote: "In SyncTune the best candidate is shown as a preview and only added to Spotify once the user confirms it.",
    realApp: "The real app",
    realAppIntro: "This is how SyncTune looks: dark interface (with a light theme too) with a green accent, fixed header with tabs, a command palette with Ctrl+K, and simple/advanced and safe/fast modes. Screenshots use sample data.",
    viewFull: (caption) => `View the ${caption} screenshot at full size`,
  },
};

const WEIGHTS = [
  { key: "artist", label: { es: "Artista", en: "Artist" }, weight: 0.4 },
  { key: "title", label: { es: "Título", en: "Title" }, weight: 0.4 },
  { key: "duration", label: { es: "Duración", en: "Duration" }, weight: 0.1 },
  { key: "version", label: { es: "Versión", en: "Version" }, weight: 0.1 },
];

const LEVEL_STYLES = {
  alta: "bg-green-900/40 text-green-300 border-green-700/50",
  media: "bg-amber-900/30 text-amber-300 border-amber-700/50",
  baja: "bg-red-900/30 text-red-300 border-red-800/50",
};

// Capturas de la interfaz real de SyncTune, tomadas con datos de ejemplo (sin cuentas reales).
const SCREENS = [
  {
    id: "welcome", src: "/images/synctune/welcome.webp",
    caption: { es: "Bienvenida", en: "Welcome" },
    note: { es: "Sin sesión: conectar Spotify y las tres promesas de la app.", en: "Signed out: connect Spotify and the app's three promises." },
  },
  {
    id: "import-song", src: "/images/synctune/import-song.webp",
    caption: { es: "Importar canción", en: "Import song" },
    note: { es: "Candidatos con carátula y badge de confianza alta, media o baja.", en: "Candidates with cover art and a high, medium or low confidence badge." },
  },
  {
    id: "import-playlist", src: "/images/synctune/import-playlist.webp",
    caption: { es: "Importar playlist", en: "Import playlist" },
    note: { es: "Origen YouTube, revisión canción por canción y destino en Spotify.", en: "YouTube source, song-by-song review and Spotify destination." },
  },
  {
    id: "dashboard", src: "/images/synctune/dashboard.webp",
    caption: { es: "Dashboard", en: "Dashboard" },
    note: { es: "Estadísticas de sincronización y actividad reciente.", en: "Sync statistics and recent activity." },
  },
  {
    id: "connections", src: "/images/synctune/connections.webp",
    caption: { es: "Conexiones", en: "Connections" },
    note: { es: "Estado de Spotify y YouTube, sin mostrar tokens.", en: "Spotify and YouTube status, without showing tokens." },
  },
  {
    id: "mobile", src: "/images/synctune/mobile.webp",
    caption: { es: "Responsive", en: "Responsive" },
    note: { es: "La misma interfaz en 375 px de ancho.", en: "The same interface at 375 px wide." },
  },
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

function Step({ label, children }) {
  return (
    <div className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-5">
      <p className="text-xs uppercase tracking-wider text-stone-500 mb-2">
        {label}
      </p>
      {children}
    </div>
  );
}

export default function SyncTuneDemo() {
  const { lang } = useLang();
  const t = TEXT[lang];
  useDocumentMeta({ title: t.metaTitle, description: t.metaDescription });

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
            <LuArrowLeft className="text-xs" /> {t.back}
          </Link>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            SyncTune <span className="text-stone-500">{t.h1Suffix}</span>
          </h1>
          <p className="text-stone-400 max-w-3xl text-lg leading-relaxed">
            {t.intro}
          </p>
        </motion.div>

        <div className="flex items-start gap-3 bg-stone-800/50 border border-stone-700/50 rounded-xl px-5 py-4 mb-8 text-sm text-stone-300">
          <LuInfo className="mt-0.5 shrink-0 text-stone-400" />
          <p>
            {t.noteBefore}<strong className="text-white">{t.noteStrong1}</strong>{t.noteMid}
            <strong className="text-white">{t.noteStrong2}</strong>{t.noteAfter}
          </p>
        </div>

        {/* Entrada */}
        <div className="bg-stone-800/50 border border-stone-700/50 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
            <div className="space-y-2">
              <label htmlFor="yt-title" className="flex items-center gap-2 text-sm font-semibold text-stone-300">
                <LuYoutube className="text-stone-400" /> {t.videoTitle}
              </label>
              <input
                id="yt-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                placeholder={t.titlePlaceholder}
                className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:border-stone-400 focus:ring-stone-400 placeholder:text-stone-600"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="yt-duration" className="block text-sm font-semibold text-stone-300">{t.durationLabel}</label>
              <input
                id="yt-duration"
                type="text"
                inputMode="numeric"
                value={durationText}
                onChange={(e) => setDurationText(e.target.value)}
                placeholder={t.durationPlaceholder}
                className={`w-full md:w-32 px-4 py-3 bg-stone-900 border rounded-xl text-white focus:outline-none focus:ring-1 placeholder:text-stone-600 ${
                  durationInvalid ? "border-red-500 focus:ring-red-500" : "border-stone-700 focus:border-stone-400 focus:ring-stone-400"
                }`}
              />
            </div>
          </div>
          {durationInvalid && <p className="text-red-400 text-sm mt-2">{t.durationError}</p>}

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs text-stone-500 self-center mr-1">{t.examples}</span>
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
          <p className="text-center text-stone-500 py-12">{t.empty}</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Pasos */}
            <div className="lg:col-span-2 space-y-4">
              <Step label={t.step(1, t.step1)}>
                {analysis.noise.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {analysis.noise.map((n, i) => (
                      <span key={`${n}-${i}`} className="text-xs line-through bg-red-900/20 text-red-300/80 border border-red-800/40 px-2 py-0.5 rounded">
                        {n}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 mb-3">{t.noNoise}</p>
                )}
                <p className="text-white font-medium break-words">{analysis.cleaned || "—"}</p>
              </Step>

              <Step label={t.step(2, t.step2)}>
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                  <dt className="text-stone-500">{t.artist}</dt>
                  <dd className="text-white break-words">{analysis.guess.artist ?? <span className="text-stone-500">{t.notSeparated}</span>}</dd>
                  <dt className="text-stone-500">{t.song}</dt>
                  <dd className="text-white break-words">{analysis.guess.track || "—"}</dd>
                  <dt className="text-stone-500">{t.version}</dt>
                  <dd className="text-white">{analysis.version ?? <span className="text-stone-500">{t.original}</span>}</dd>
                </dl>
              </Step>

              <Step label={t.step(3, t.step3)}>
                <ol className="space-y-1.5">
                  {analysis.queries.map((q, i) => (
                    <li key={q} className="text-xs font-mono text-stone-300 bg-stone-900/60 border border-stone-700/50 rounded px-2 py-1.5 break-all">
                      <span className="text-stone-500 mr-2">{i + 1}.</span>{q}
                    </li>
                  ))}
                </ol>
                <p className="text-xs text-stone-500 mt-3">{t.queriesNote}</p>
              </Step>
            </div>

            {/* Ranking */}
            <div className="lg:col-span-3">
              <div className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-5">
                <p className="text-xs uppercase tracking-wider text-stone-500 mb-1">{t.step(4, t.step4)}</p>
                <p className="text-sm text-stone-400 mb-5">
                  {t.scoreFormula(CONFIDENCE_HIGH, CONFIDENCE_MEDIUM)}
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
                              {t.levels[level]}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {WEIGHTS.map(({ key, label, weight }) => (
                            <div key={key}>
                              <div className="flex justify-between text-[11px] text-stone-500 mb-1">
                                <span>{tr(label, lang)}</span>
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
                  {t.previewNote}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* La app real */}
        <div className="mt-16">
          <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1db954] shrink-0" aria-hidden="true" />
            {t.realApp}
          </h2>
          <p className="text-stone-400 max-w-3xl mb-8 leading-relaxed">
            {t.realAppIntro}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCREENS.map((screen) => {
              const caption = tr(screen.caption, lang);
              return (
                <figure key={screen.id} className="group">
                  <a
                    href={screen.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block overflow-hidden rounded-xl border border-stone-700/50 bg-stone-950 hover:border-stone-500 transition-colors"
                    aria-label={t.viewFull(caption)}
                  >
                    <img
                      src={screen.src}
                      alt={`SyncTune — ${caption}`}
                      loading="lazy"
                      width="1280"
                      height="800"
                      className="w-full aspect-[16/10] object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </a>
                  <figcaption className="mt-3">
                    <p className="text-white font-semibold">{caption}</p>
                    <p className="text-sm text-stone-500">{tr(screen.note, lang)}</p>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

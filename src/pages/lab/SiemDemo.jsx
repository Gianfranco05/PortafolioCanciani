import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRedo, FaGithub } from 'react-icons/fa';
import { LuArrowLeft, LuInfo } from 'react-icons/lu';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ATTACKS,
  DBSCAN_EPS,
  DBSCAN_MIN_SAMPLES,
  DENSIDAD_UMBRAL_FREQ,
  DENSIDAD_UMBRAL_HOSTS,
  IF_CONTAMINATION,
  analyze,
  generateWindow,
} from '../../lib/siemEngine';
import { EASE } from '../../lib/motion';
import useLang from '../../i18n/useLang';
import useDocumentMeta from '../../i18n/useDocumentMeta';

const SIGNAL_KEYS = ["if", "dbscan", "densidad", "lateral"];

const OUTCOME = {
  tp: { bar: "fill-stone-100", badge: "bg-stone-100 text-stone-950 border-stone-100" },
  fp: { bar: "fill-amber-400", badge: "bg-amber-900/30 text-amber-300 border-amber-700/50" },
  fn: { bar: "fill-red-400", badge: "bg-red-900/30 text-red-300 border-red-700/50" },
  tn: { bar: "fill-stone-700", badge: "" },
};

function outcomeOf(r) {
  if (r.predicted && r.actual) return "tp";
  if (r.predicted) return "fp";
  if (r.actual) return "fn";
  return "tn";
}

// Los textos del motor (siemEngine.js) quedan en español; acá se traducen al mostrarlos,
// con un mapa por id de ataque, para no tocar el port de la tesis.
const TEXT = {
  es: {
    metaTitle: "SIEM Inteligente — Demo",
    metaDescription: "Inyectá ataques en una ventana de logs y mirá cómo el motor de la tesis los detecta con Isolation Forest, DBSCAN y reglas de correlación.",
    back: "Volver al Lab",
    title: "SIEM Inteligente",
    subtitle: "— detección de anomalías",
    intro: "Inyectá ataques en una ventana de logs y mirá cómo el motor de la tesis los detecta, combinando dos modelos no supervisados con reglas de correlación.",
    notePre: "Mismo pipeline que el motor de la tesis: ",
    noteStrong: "mismas 7 features, StandardScaler, hiperparámetros, reglas y fusión OR",
    notePost: ", y logs con el formato del simulador de ataques. Isolation Forest y DBSCAN son una implementación propia en JavaScript (el original usa scikit-learn sobre Elasticsearch), así que las métricas pueden diferir levemente de las de la tesis.",
    attacksTitle: "Ataques en la ventana",
    newWindow: "Nueva ventana de tráfico",
    scenarioNote: "Siempre hay 96 eventos de tráfico normal (logins diurnos, cron, systemd, DNS). La combinación RU-1 + RU-2 + RU-3 es el escenario de validación de la tesis (~15% anómalo).",
    mEvents: "Eventos analizados",
    mEventsSub: (n) => `${n} son ataques`,
    mRecallSub: (tp, n) => `${tp} de ${n} ataques detectados`,
    mPrecision: "Precisión",
    mPrecisionSub: (fp) => `${fp} falsos positivos`,
    mF1Sub: "balance precisión / recall",
    chartTitle: "La ventana, evento por evento",
    chartDesc: "Cada barra es un log. Su altura es qué tan anómalo lo ve Isolation Forest; el color, el veredicto final del motor.",
    chartAria: "Puntaje de anomalía por evento",
    signalsTitle: "Qué detectó cada señal",
    orPre: "Un evento es anomalía si ",
    orStrong: "al menos una",
    orPost: " señal lo marca (OR).",
    fpTitle: "¿Por qué hay falsos positivos?",
    fpP1: (c, p) => `Isolation Forest usa una contamination fija de ${c}: en cada ventana marca como raro cerca del ${p} de los eventos, haya ataques o no.`,
    fpP2: "Es una decisión de diseño de la tesis: en seguridad es preferible alertar de más que dejar pasar una amenaza.",
    fpP3: "Probá sacar todos los ataques para verlo.",
    original: "Ver el motor original",
    flaggedTitle: "Eventos marcados",
    noneFlagged: "Ningún evento marcado en esta ventana.",
    outcome: { tp: "Ataque detectado", fp: "Falso positivo", fn: "Ataque no detectado", tn: "Normal" },
    signals: {
      if: { label: "Isolation Forest", help: (c) => `Outliers multidimensionales (contamination ${c})` },
      dbscan: { label: "DBSCAN", help: (eps, min) => `Puntos fuera de clusters densos (eps ${eps}, min ${min})` },
      densidad: { label: "Ráfaga por IP", help: (n) => `Misma IP con ${n}+ eventos en la ventana` },
      lateral: { label: "Movimiento lateral", help: (n) => `Misma IP autenticada en ${n}+ hosts distintos` },
    },
    attackNames: {
      ru1: { label: "RU-1 · Fuerza bruta SSH", description: "15 intentos fallidos de login como root desde la misma IP externa." },
      ru2: { label: "RU-2 · Acceso nocturno", description: "Login exitoso de admin a las 03:15, fuera del horario habitual." },
      ru3: { label: "RU-3 · Pico de CPU", description: "Métrica de uso de CPU más de 3 desvíos por encima de lo normal." },
      ru6: { label: "RU-6 · Movimiento lateral", description: "La misma IP se autentica con éxito contra 6 hosts internos distintos (MITRE T1021.004)." },
    },
  },
  en: {
    metaTitle: "Intelligent SIEM — Demo",
    metaDescription: "Inject attacks into a log window and watch the thesis engine detect them with Isolation Forest, DBSCAN and correlation rules.",
    back: "Back to Lab",
    title: "Intelligent SIEM",
    subtitle: "— anomaly detection",
    intro: "Inject attacks into a log window and watch the thesis engine detect them, combining two unsupervised models with correlation rules.",
    notePre: "Same pipeline as the thesis engine: ",
    noteStrong: "same 7 features, StandardScaler, hyperparameters, rules and OR fusion",
    notePost: ", with logs in the attack simulator's format. Isolation Forest and DBSCAN are a custom JavaScript implementation (the original uses scikit-learn on Elasticsearch), so the metrics may differ slightly from the thesis.",
    attacksTitle: "Attacks in the window",
    newWindow: "New traffic window",
    scenarioNote: "There are always 96 normal traffic events (daytime logins, cron, systemd, DNS). The RU-1 + RU-2 + RU-3 combination is the thesis validation scenario (~15% anomalous).",
    mEvents: "Events analyzed",
    mEventsSub: (n) => `${n} are attacks`,
    mRecallSub: (tp, n) => `${tp} of ${n} attacks detected`,
    mPrecision: "Precision",
    mPrecisionSub: (fp) => `${fp} false positives`,
    mF1Sub: "precision / recall balance",
    chartTitle: "The window, event by event",
    chartDesc: "Each bar is a log. Its height is how anomalous Isolation Forest finds it; the color is the engine's final verdict.",
    chartAria: "Anomaly score per event",
    signalsTitle: "What each signal detected",
    orPre: "An event is an anomaly if ",
    orStrong: "at least one",
    orPost: " signal flags it (OR).",
    fpTitle: "Why are there false positives?",
    fpP1: (c, p) => `Isolation Forest uses a fixed contamination of ${c}: in every window it flags about ${p} of the events as unusual, whether there are attacks or not.`,
    fpP2: "This is a design decision of the thesis: in security, it is better to over-alert than to let a threat through.",
    fpP3: "Try removing all the attacks to see it.",
    original: "View the original engine",
    flaggedTitle: "Flagged events",
    noneFlagged: "No events flagged in this window.",
    outcome: { tp: "Attack detected", fp: "False positive", fn: "Attack missed", tn: "Normal" },
    signals: {
      if: { label: "Isolation Forest", help: (c) => `Multidimensional outliers (contamination ${c})` },
      dbscan: { label: "DBSCAN", help: (eps, min) => `Points outside dense clusters (eps ${eps}, min ${min})` },
      densidad: { label: "Per-IP burst", help: (n) => `Same IP with ${n}+ events in the window` },
      lateral: { label: "Lateral movement", help: (n) => `Same IP authenticated on ${n}+ different hosts` },
    },
    attackNames: {
      ru1: { label: "RU-1 · SSH brute force", description: "15 failed root login attempts from the same external IP." },
      ru2: { label: "RU-2 · Night-time access", description: "Successful admin login at 03:15, outside normal hours." },
      ru3: { label: "RU-3 · CPU spike", description: "CPU usage metric more than 3 standard deviations above normal." },
      ru6: { label: "RU-6 · Lateral movement", description: "The same IP successfully authenticates against 6 different internal hosts (MITRE T1021.004)." },
    },
  },
};

const pct = (v) => `${Math.round(v * 100)}%`;

export default function SiemDemo() {
  const shouldReduceMotion = useReducedMotion();
  const { lang } = useLang();
  const t = TEXT[lang];
  useDocumentMeta({ title: t.metaTitle, description: t.metaDescription });
  const signalHelp = {
    if: t.signals.if.help(IF_CONTAMINATION),
    dbscan: t.signals.dbscan.help(DBSCAN_EPS, DBSCAN_MIN_SAMPLES),
    densidad: t.signals.densidad.help(DENSIDAD_UMBRAL_FREQ),
    lateral: t.signals.lateral.help(DENSIDAD_UMBRAL_HOSTS),
  };
  const [attacks, setAttacks] = useState(["ru1", "ru2", "ru3"]);
  // Semilla 18 = ventana con F1 mediano en 101 corridas del escenario de la tesis
  // (ni la mejor ni la peor), para que la primera impresión sea representativa.
  const [seed, setSeed] = useState(18);

  const analysis = useMemo(() => analyze(generateWindow(seed, attacks)), [seed, attacks]);
  const { results, metrics, bySignal } = analysis;
  const attackCount = results.filter((r) => r.actual).length;
  const flagged = results.filter((r) => r.predicted || r.actual);

  // Barras del gráfico: altura = qué tan anómalo lo ve Isolation Forest.
  const scores = results.map((r) => -r.ifScore);
  const minS = Math.min(...scores);
  const maxS = Math.max(...scores);
  const barH = (s) => 8 + ((s - minS) / (maxS - minS || 1)) * 92;

  const toggleAttack = (id) =>
    setAttacks((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));

  const fadeIn = shouldReduceMotion ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

  return (
    <section id="main-content" className="min-h-screen bg-stone-900 pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div {...fadeIn} transition={{ duration: 0.6, ease: EASE }} className="mb-8">
          <Link to="/lab" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-white transition-colors mb-6">
            <LuArrowLeft className="text-xs" /> {t.back}
          </Link>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            {t.title} <span className="text-stone-500">{t.subtitle}</span>
          </h1>
          <p className="text-stone-400 max-w-3xl text-lg leading-relaxed">
            {t.intro}
          </p>
        </motion.div>

        <div className="flex items-start gap-3 bg-stone-800/50 border border-stone-700/50 rounded-xl px-5 py-4 mb-8 text-sm text-stone-300">
          <LuInfo className="mt-0.5 shrink-0 text-stone-400" />
          <p>
            {t.notePre}<strong className="text-white">{t.noteStrong}</strong>{t.notePost}
          </p>
        </div>

        {/* Escenario */}
        <div className="bg-stone-800/50 border border-stone-700/50 rounded-2xl p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-white font-bold">{t.attacksTitle}</h2>
            <button
              type="button"
              onClick={() => setSeed((s) => s + 1)}
              className="inline-flex items-center gap-2 text-sm bg-stone-900/60 hover:bg-stone-700 border border-stone-700 text-stone-200 px-4 py-2 rounded-lg transition-colors"
            >
              <FaRedo className="text-xs" /> {t.newWindow}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.keys(ATTACKS).map((id) => {
              const on = attacks.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleAttack(id)}
                  aria-pressed={on}
                  className={`text-left rounded-xl border p-4 transition-colors ${
                    on ? "bg-stone-100 border-stone-100" : "bg-stone-900/40 border-stone-700 hover:border-stone-500"
                  }`}
                >
                  <p className={`font-semibold text-sm mb-1 ${on ? "text-stone-950" : "text-white"}`}>{t.attackNames[id].label}</p>
                  <p className={`text-xs leading-relaxed ${on ? "text-stone-700" : "text-stone-400"}`}>{t.attackNames[id].description}</p>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-stone-500 mt-4">
            {t.scenarioNote}
          </p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: t.mEvents, value: results.length, sub: t.mEventsSub(attackCount) },
            { label: "Recall", value: attackCount ? pct(metrics.recall) : "—", sub: t.mRecallSub(metrics.tp, attackCount) },
            { label: t.mPrecision, value: metrics.tp + metrics.fp ? pct(metrics.precision) : "—", sub: t.mPrecisionSub(metrics.fp) },
            { label: "F1", value: attackCount ? metrics.f1.toFixed(2) : "—", sub: t.mF1Sub },
          ].map((m) => (
            <div key={m.label} className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-4">
              <p className="text-xs uppercase tracking-wider text-stone-500 mb-1">{m.label}</p>
              <p className="text-3xl font-bold text-white tabular-nums">{m.value}</p>
              <p className="text-xs text-stone-500 mt-1">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* Gráfico */}
        <div className="bg-stone-800/50 border border-stone-700/50 rounded-2xl p-6 mb-8">
          <h2 className="text-white font-bold mb-1">{t.chartTitle}</h2>
          <p className="text-sm text-stone-400 mb-5">{t.chartDesc}</p>
          <svg viewBox={`0 0 ${results.length * 6} 104`} className="w-full h-32" preserveAspectRatio="none" role="img" aria-label={t.chartAria}>
            {results.map((r, i) => {
              const h = barH(scores[i]);
              return (
                <rect key={r.id} x={i * 6 + 1} y={104 - h} width={4} height={h} rx={1} className={OUTCOME[outcomeOf(r)].bar}>
                  <title>{`${t.outcome[outcomeOf(r)]} — ${r.message}`}</title>
                </rect>
              );
            })}
          </svg>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs text-stone-400">
            {["tp", "fp", "fn", "tn"].map((k) => (
              <span key={k} className="inline-flex items-center gap-2">
                <svg width="10" height="10" aria-hidden="true"><rect width="10" height="10" rx="2" className={OUTCOME[k].bar} /></svg>
                {t.outcome[k]}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Señales */}
          <div className="space-y-4">
            <div className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-5">
              <h2 className="text-white font-bold mb-4">{t.signalsTitle}</h2>
              <ul className="space-y-4">
                {SIGNAL_KEYS.map((key) => (
                  <li key={key}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm text-white font-medium">{t.signals[key].label}</span>
                      <span className="text-lg font-bold text-white tabular-nums">{bySignal[key]}</span>
                    </div>
                    <p className="text-xs text-stone-500">{signalHelp[key]}</p>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-stone-400 mt-5 pt-4 border-t border-stone-700/50">
                {t.orPre}<strong className="text-stone-200">{t.orStrong}</strong>{t.orPost}
              </p>
            </div>

            <div className="bg-stone-800/30 border border-stone-700/40 rounded-xl p-5">
              <h3 className="text-white font-bold mb-2">{t.fpTitle}</h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                {t.fpP1(IF_CONTAMINATION, pct(IF_CONTAMINATION))}{" "}
                {t.fpP2}{" "}
                {t.fpP3}
              </p>
              <a
                href="https://github.com/Gianfranco05/Tesis_SiemInteligenteMachineLearning_Canciani"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-sm text-stone-300 hover:text-white transition-colors"
              >
                <FaGithub /> {t.original}
              </a>
            </div>
          </div>

          {/* Eventos marcados */}
          <div className="lg:col-span-2 bg-stone-800/50 border border-stone-700/50 rounded-xl p-5">
            <h2 className="text-white font-bold mb-4">
              {t.flaggedTitle} <span className="text-stone-500 font-normal">({flagged.length})</span>
            </h2>
            {flagged.length === 0 ? (
              <p className="text-sm text-stone-500">{t.noneFlagged}</p>
            ) : (
              <ul className="space-y-2 max-h-[34rem] overflow-y-auto pr-1">
                {flagged.map((r) => {
                  const o = outcomeOf(r);
                  return (
                    <li key={r.id} className="bg-stone-900/50 border border-stone-700/50 rounded-lg p-3">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`text-[11px] font-semibold border rounded px-2 py-0.5 ${OUTCOME[o].badge}`}>{t.outcome[o]}</span>
                        {r.attack && <span className="text-[11px] text-stone-400">{t.attackNames[r.attack].label.split(" · ")[0]}</span>}
                        {SIGNAL_KEYS.filter((key) => r.signals[key]).map((key) => (
                          <span key={key} className="text-[11px] bg-stone-800 border border-stone-600 text-stone-300 rounded px-2 py-0.5">{t.signals[key].label}</span>
                        ))}
                      </div>
                      <p className="text-xs font-mono text-stone-400 break-all">{r.message}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

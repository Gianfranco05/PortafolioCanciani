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

const SIGNALS = [
  { key: "if", label: "Isolation Forest", help: `Outliers multidimensionales (contamination ${IF_CONTAMINATION})` },
  { key: "dbscan", label: "DBSCAN", help: `Puntos fuera de clusters densos (eps ${DBSCAN_EPS}, min ${DBSCAN_MIN_SAMPLES})` },
  { key: "densidad", label: "Ráfaga por IP", help: `Misma IP con ${DENSIDAD_UMBRAL_FREQ}+ eventos en la ventana` },
  { key: "lateral", label: "Movimiento lateral", help: `Misma IP autenticada en ${DENSIDAD_UMBRAL_HOSTS}+ hosts distintos` },
];

const OUTCOME = {
  tp: { label: "Ataque detectado", bar: "fill-stone-100", badge: "bg-stone-100 text-stone-950 border-stone-100" },
  fp: { label: "Falso positivo", bar: "fill-amber-400", badge: "bg-amber-900/30 text-amber-300 border-amber-700/50" },
  fn: { label: "Ataque no detectado", bar: "fill-red-400", badge: "bg-red-900/30 text-red-300 border-red-700/50" },
  tn: { label: "Normal", bar: "fill-stone-700", badge: "" },
};

function outcomeOf(r) {
  if (r.predicted && r.actual) return "tp";
  if (r.predicted) return "fp";
  if (r.actual) return "fn";
  return "tn";
}

const pct = (v) => `${Math.round(v * 100)}%`;

export default function SiemDemo() {
  const shouldReduceMotion = useReducedMotion();
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
            <LuArrowLeft className="text-xs" /> Volver al Lab
          </Link>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            SIEM Inteligente <span className="text-stone-500">— detección de anomalías</span>
          </h1>
          <p className="text-stone-400 max-w-3xl text-lg leading-relaxed">
            Inyectá ataques en una ventana de logs y mirá cómo el motor de la tesis los detecta, combinando dos modelos no supervisados con reglas de correlación.
          </p>
        </motion.div>

        <div className="flex items-start gap-3 bg-stone-800/50 border border-stone-700/50 rounded-xl px-5 py-4 mb-8 text-sm text-stone-300">
          <LuInfo className="mt-0.5 shrink-0 text-stone-400" />
          <p>
            Mismo pipeline que el motor de la tesis: <strong className="text-white">mismas 7 features, StandardScaler, hiperparámetros, reglas y fusión OR</strong>, y logs con el formato del simulador de ataques.
            Isolation Forest y DBSCAN son una implementación propia en JavaScript (el original usa scikit-learn sobre Elasticsearch), así que las métricas pueden diferir levemente de las de la tesis.
          </p>
        </div>

        {/* Escenario */}
        <div className="bg-stone-800/50 border border-stone-700/50 rounded-2xl p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-white font-bold">Ataques en la ventana</h2>
            <button
              type="button"
              onClick={() => setSeed((s) => s + 1)}
              className="inline-flex items-center gap-2 text-sm bg-stone-900/60 hover:bg-stone-700 border border-stone-700 text-stone-200 px-4 py-2 rounded-lg transition-colors"
            >
              <FaRedo className="text-xs" /> Nueva ventana de tráfico
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(ATTACKS).map(([id, atk]) => {
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
                  <p className={`font-semibold text-sm mb-1 ${on ? "text-stone-950" : "text-white"}`}>{atk.label}</p>
                  <p className={`text-xs leading-relaxed ${on ? "text-stone-700" : "text-stone-400"}`}>{atk.description}</p>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-stone-500 mt-4">
            Siempre hay 96 eventos de tráfico normal (logins diurnos, cron, systemd, DNS). La combinación RU-1 + RU-2 + RU-3 es el escenario de validación de la tesis (~15% anómalo).
          </p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Eventos analizados", value: results.length, sub: `${attackCount} son ataques` },
            { label: "Recall", value: attackCount ? pct(metrics.recall) : "—", sub: `${metrics.tp} de ${attackCount} ataques detectados` },
            { label: "Precisión", value: metrics.tp + metrics.fp ? pct(metrics.precision) : "—", sub: `${metrics.fp} falsos positivos` },
            { label: "F1", value: attackCount ? metrics.f1.toFixed(2) : "—", sub: "balance precisión / recall" },
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
          <h2 className="text-white font-bold mb-1">La ventana, evento por evento</h2>
          <p className="text-sm text-stone-400 mb-5">Cada barra es un log. Su altura es qué tan anómalo lo ve Isolation Forest; el color, el veredicto final del motor.</p>
          <svg viewBox={`0 0 ${results.length * 6} 104`} className="w-full h-32" preserveAspectRatio="none" role="img" aria-label="Puntaje de anomalía por evento">
            {results.map((r, i) => {
              const h = barH(scores[i]);
              return (
                <rect key={r.id} x={i * 6 + 1} y={104 - h} width={4} height={h} rx={1} className={OUTCOME[outcomeOf(r)].bar}>
                  <title>{`${OUTCOME[outcomeOf(r)].label} — ${r.message}`}</title>
                </rect>
              );
            })}
          </svg>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs text-stone-400">
            {["tp", "fp", "fn", "tn"].map((k) => (
              <span key={k} className="inline-flex items-center gap-2">
                <svg width="10" height="10" aria-hidden="true"><rect width="10" height="10" rx="2" className={OUTCOME[k].bar} /></svg>
                {OUTCOME[k].label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Señales */}
          <div className="space-y-4">
            <div className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-5">
              <h2 className="text-white font-bold mb-4">Qué detectó cada señal</h2>
              <ul className="space-y-4">
                {SIGNALS.map((s) => (
                  <li key={s.key}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm text-white font-medium">{s.label}</span>
                      <span className="text-lg font-bold text-white tabular-nums">{bySignal[s.key]}</span>
                    </div>
                    <p className="text-xs text-stone-500">{s.help}</p>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-stone-400 mt-5 pt-4 border-t border-stone-700/50">
                Un evento es anomalía si <strong className="text-stone-200">al menos una</strong> señal lo marca (OR).
              </p>
            </div>

            <div className="bg-stone-800/30 border border-stone-700/40 rounded-xl p-5">
              <h3 className="text-white font-bold mb-2">¿Por qué hay falsos positivos?</h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                Isolation Forest usa una <em>contamination</em> fija de {IF_CONTAMINATION}: en cada ventana marca como raro cerca del {pct(IF_CONTAMINATION)} de los eventos, haya ataques o no.
                Es una decisión de diseño de la tesis: en seguridad es preferible alertar de más que dejar pasar una amenaza.
                Probá sacar todos los ataques para verlo.
              </p>
              <a
                href="https://github.com/Gianfranco05/Tesis_SiemInteligenteMachineLearning_Canciani"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-sm text-stone-300 hover:text-white transition-colors"
              >
                <FaGithub /> Ver el motor original
              </a>
            </div>
          </div>

          {/* Eventos marcados */}
          <div className="lg:col-span-2 bg-stone-800/50 border border-stone-700/50 rounded-xl p-5">
            <h2 className="text-white font-bold mb-4">
              Eventos marcados <span className="text-stone-500 font-normal">({flagged.length})</span>
            </h2>
            {flagged.length === 0 ? (
              <p className="text-sm text-stone-500">Ningún evento marcado en esta ventana.</p>
            ) : (
              <ul className="space-y-2 max-h-[34rem] overflow-y-auto pr-1">
                {flagged.map((r) => {
                  const o = outcomeOf(r);
                  return (
                    <li key={r.id} className="bg-stone-900/50 border border-stone-700/50 rounded-lg p-3">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`text-[11px] font-semibold border rounded px-2 py-0.5 ${OUTCOME[o].badge}`}>{OUTCOME[o].label}</span>
                        {r.attack && <span className="text-[11px] text-stone-400">{ATTACKS[r.attack].label.split(" · ")[0]}</span>}
                        {SIGNALS.filter((s) => r.signals[s.key]).map((s) => (
                          <span key={s.key} className="text-[11px] bg-stone-800 border border-stone-600 text-stone-300 rounded px-2 py-0.5">{s.label}</span>
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

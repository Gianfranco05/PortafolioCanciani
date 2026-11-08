import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LuArrowLeft, LuInfo, LuPlay, LuPause, LuStepBack, LuStepForward, LuRotateCcw, LuShuffle } from 'react-icons/lu';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from '../../lib/motion';
import { SORTERS, SEARCHERS, makeArray } from '../../lib/algorithms';
import useLang from '../../i18n/useLang';
import useDocumentMeta from '../../i18n/useDocumentMeta';

const ALGOS = {
  bubble: {
    type: "sort",
    name: { es: "Burbuja", en: "Bubble sort" },
    info: {
      es: "Compara pares de vecinos y los intercambia si están al revés. En cada pasada el mayor “sube” hasta el final, como una burbuja.",
      en: "Compares neighbours and swaps them if they are out of order. On every pass the largest value “floats” to the end, like a bubble.",
    },
    best: "O(n)", avg: "O(n²)", worst: "O(n²)",
  },
  selection: {
    type: "sort",
    name: { es: "Selección", en: "Selection sort" },
    info: {
      es: "Busca el mínimo de lo que falta ordenar y lo pone en su lugar. Hace pocos intercambios, pero siempre compara casi todo.",
      en: "Finds the minimum of what is left and drops it in place. Very few swaps, but it always compares almost everything.",
    },
    best: "O(n²)", avg: "O(n²)", worst: "O(n²)",
  },
  insertion: {
    type: "sort",
    name: { es: "Inserción", en: "Insertion sort" },
    info: {
      es: "Toma cada elemento y lo desliza hacia atrás hasta encontrar su lugar, como cuando ordenás cartas en la mano. Muy rápido si ya está casi ordenado.",
      en: "Takes each element and slides it back until it fits, like sorting cards in your hand. Very fast when the input is nearly sorted.",
    },
    best: "O(n)", avg: "O(n²)", worst: "O(n²)",
  },
  quick: {
    type: "sort",
    name: { es: "Quick sort", en: "Quick sort" },
    info: {
      es: "Elige un pivote y manda lo menor a su izquierda y lo mayor a su derecha; después repite en cada lado. Es el más veloz de los cuatro en la práctica.",
      en: "Picks a pivot, sends smaller values to its left and larger ones to its right, then repeats on each side. The fastest of the four in practice.",
    },
    best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)",
  },
  linear: {
    type: "search",
    name: { es: "Búsqueda lineal", en: "Linear search" },
    info: {
      es: "Revisa una posición tras otra hasta encontrar el valor. Funciona con cualquier arreglo, ordenado o no.",
      en: "Checks one position after another until it finds the value. Works on any array, sorted or not.",
    },
    best: "O(1)", avg: "O(n)", worst: "O(n)",
  },
  binary: {
    type: "search",
    name: { es: "Búsqueda binaria", en: "Binary search" },
    info: {
      es: "Mira el elemento del medio y descarta la mitad que no puede contener el valor. Exige que el arreglo esté ordenado.",
      en: "Looks at the middle element and throws away the half that cannot hold the value. Needs a sorted array.",
    },
    best: "O(1)", avg: "O(log n)", worst: "O(log n)",
  },
};

// Pausa entre pasos (ms) para cada velocidad 1..10
const DELAYS = [900, 600, 400, 280, 190, 120, 80, 50, 30, 15];

const TEXT = {
  es: {
    metaTitle: "Lab — Visualizador de algoritmos",
    metaDescription: "Mirá paso a paso cómo ordenan y buscan Burbuja, Selección, Inserción, Quick sort, búsqueda lineal y binaria, con control de velocidad.",
    back: "Volver al Lab",
    title: "Visualizador de algoritmos",
    subtitle: "ordenar y buscar, paso a paso",
    intro: "Elegí un algoritmo, ajustá la velocidad y mirá qué compara y qué mueve en cada paso. Es el tipo de ejercicio que uso para explicar Algoritmos en clase.",
    noteStrong: "Es una versión didáctica:",
    noteRest: " los algoritmos son los reales (se ejecutan y se graba cada paso), pero con pocos elementos para que se pueda seguir a simple vista.",
    sorting: "Ordenar",
    searching: "Buscar",
    play: "Reproducir", pause: "Pausar", back1: "Paso atrás", fwd1: "Paso adelante", reset: "Reiniciar",
    newArray: "Nuevo arreglo",
    speed: "Velocidad",
    size: "Cantidad",
    target: "Valor a buscar",
    pickRandom: "Uno del arreglo",
    pickAbsent: "Uno que no está",
    step: "Paso",
    cmps: "Comparaciones",
    swaps: "Intercambios",
    elements: "Elementos",
    complexity: "Complejidad",
    best: "Mejor caso", avg: "Caso medio", worst: "Peor caso",
    legend: { compare: "Comparando", swap: "Intercambio", sorted: "En su lugar", pivot: "Pivote", normal: "Sin tocar" },
    legendSearch: { probe: "Mirando", found: "Encontrado", out: "Descartado", normal: "En juego" },
    chartLabel: "Barras del arreglo",
    needSorted: "El arreglo se genera ordenado de menor a mayor: la búsqueda binaria lo necesita así.",
    describe: {
      start: (n) => `Arreglo de ${n} elementos. Dale a ▶ o avanzá paso a paso.`,
      startSearch: (n, v) => `Busco el ${v} en un arreglo de ${n} elementos.`,
      compare: (algo, s) => {
        const [i, j] = s.idx;
        const x = s.a[i], y = s.a[j];
        if (algo === "selection") return `Comparo el mínimo actual (${x}, pos. ${i}) con ${y} (pos. ${j}): ${s.gt ? `${y} es menor, será el nuevo mínimo` : "el mínimo sigue siendo el mismo"}.`;
        if (algo === "quick") return `Comparo ${x} (pos. ${i}) con el pivote ${y}: ${s.gt ? "va a la derecha, no se mueve" : "es menor, va a la izquierda"}.`;
        return `Comparo ${x} (pos. ${i}) con ${y} (pos. ${j}): ${s.gt ? "están al revés" : "ya están en orden"}.`;
      },
      swap: (s) => `Intercambio ${s.a[s.idx[0]]} y ${s.a[s.idx[1]]}.`,
      newmin: (s) => `Nuevo mínimo: ${s.a[s.idx[0]]} en la posición ${s.idx[0]}.`,
      pivot: (s) => `Elijo el pivote ${s.a[s.pivot]}: el último del tramo (posiciones ${s.range[0]} a ${s.range[1]}).`,
      place: (s) => `El pivote ${s.a[s.idx[0]]} queda en su posición final (${s.idx[0]}). Ahora se ordena cada lado.`,
      done: (s) => `Listo: ${s.cmps} comparaciones y ${s.swaps} intercambios.`,
      probeLinear: (s) => `Miro la posición ${s.idx[0]}: vale ${s.value}. ${s.rel === "eq" ? "¡Es el que busco!" : "No es."}`,
      probeBinary: (s) => `Miro el medio: posición ${s.idx[0]}, vale ${s.value}. ${s.rel === "eq" ? "¡Es el que busco!" : s.rel === "lt" ? `${s.value} es menor que ${s.target}: descarto la mitad izquierda.` : `${s.value} es mayor que ${s.target}: descarto la mitad derecha.`}`,
      found: (s) => `Encontrado: el ${s.target} está en la posición ${s.at}, con ${s.cmps} comparaciones.`,
      missing: (s) => `El ${s.target} no está en el arreglo (${s.cmps} comparaciones).`,
    },
  },
  en: {
    metaTitle: "Lab — Algorithm visualizer",
    metaDescription: "Watch Bubble, Selection, Insertion and Quick sort, plus linear and binary search, work step by step with speed control.",
    back: "Back to Lab",
    title: "Algorithm visualizer",
    subtitle: "sorting and searching, step by step",
    intro: "Pick an algorithm, set the speed and watch what it compares and moves at every step. It is the kind of exercise I use to teach Algorithms in class.",
    noteStrong: "This is a teaching version:",
    noteRest: " the algorithms are the real ones (they run and record every step), but with few elements so you can follow them by eye.",
    sorting: "Sort",
    searching: "Search",
    play: "Play", pause: "Pause", back1: "Step back", fwd1: "Step forward", reset: "Reset",
    newArray: "New array",
    speed: "Speed",
    size: "Size",
    target: "Value to find",
    pickRandom: "One from the array",
    pickAbsent: "One that isn't there",
    step: "Step",
    cmps: "Comparisons",
    swaps: "Swaps",
    elements: "Elements",
    complexity: "Complexity",
    best: "Best case", avg: "Average case", worst: "Worst case",
    legend: { compare: "Comparing", swap: "Swapping", sorted: "In place", pivot: "Pivot", normal: "Untouched" },
    legendSearch: { probe: "Checking", found: "Found", out: "Ruled out", normal: "Still in play" },
    chartLabel: "Array bars",
    needSorted: "The array is generated sorted from low to high: binary search needs it that way.",
    describe: {
      start: (n) => `Array of ${n} elements. Press ▶ or step through it.`,
      startSearch: (n, v) => `Looking for ${v} in an array of ${n} elements.`,
      compare: (algo, s) => {
        const [i, j] = s.idx;
        const x = s.a[i], y = s.a[j];
        if (algo === "selection") return `Comparing the current minimum (${x}, pos. ${i}) with ${y} (pos. ${j}): ${s.gt ? `${y} is smaller, it becomes the new minimum` : "the minimum stays the same"}.`;
        if (algo === "quick") return `Comparing ${x} (pos. ${i}) with the pivot ${y}: ${s.gt ? "it goes to the right, stays put" : "it is smaller, goes to the left"}.`;
        return `Comparing ${x} (pos. ${i}) with ${y} (pos. ${j}): ${s.gt ? "they are out of order" : "already in order"}.`;
      },
      swap: (s) => `Swapping ${s.a[s.idx[0]]} and ${s.a[s.idx[1]]}.`,
      newmin: (s) => `New minimum: ${s.a[s.idx[0]]} at position ${s.idx[0]}.`,
      pivot: (s) => `Picking pivot ${s.a[s.pivot]}: the last one in the range (positions ${s.range[0]} to ${s.range[1]}).`,
      place: (s) => `Pivot ${s.a[s.idx[0]]} lands in its final position (${s.idx[0]}). Now each side gets sorted.`,
      done: (s) => `Done: ${s.cmps} comparisons and ${s.swaps} swaps.`,
      probeLinear: (s) => `Checking position ${s.idx[0]}: it holds ${s.value}. ${s.rel === "eq" ? "That's the one!" : "Not it."}`,
      probeBinary: (s) => `Checking the middle: position ${s.idx[0]}, it holds ${s.value}. ${s.rel === "eq" ? "That's the one!" : s.rel === "lt" ? `${s.value} is smaller than ${s.target}: discard the left half.` : `${s.value} is larger than ${s.target}: discard the right half.`}`,
      found: (s) => `Found: ${s.target} is at position ${s.at}, after ${s.cmps} comparisons.`,
      missing: (s) => `${s.target} is not in the array (${s.cmps} comparisons).`,
    },
  },
};

function describe(t, algo, s, n) {
  const d = t.describe;
  switch (s.kind) {
    case "start": return ALGOS[algo].type === "search" ? d.startSearch(n, s.target) : d.start(n);
    case "compare": return d.compare(algo, s);
    case "swap": return d.swap(s);
    case "newmin": return d.newmin(s);
    case "pivot": return d.pivot(s);
    case "place": return d.place(s);
    case "done": return d.done(s);
    case "probe": return algo === "binary" ? d.probeBinary(s) : d.probeLinear(s);
    case "found": return d.found(s);
    case "missing": return d.missing(s);
    default: return "";
  }
}

function barColor(s, i, isSearch) {
  if (isSearch) {
    if (s.kind === "found" && s.idx.includes(i)) return "bg-green-500";
    if (s.idx.includes(i)) return "bg-amber-400";
    if (s.range && (i < s.range[0] || i > s.range[1])) return "bg-stone-700";
    return "bg-stone-500";
  }
  if (s.sorted.includes(i)) return "bg-green-500";
  if (s.idx.includes(i)) return s.kind === "swap" ? "bg-red-400" : "bg-amber-400";
  if (s.pivot === i) return "bg-stone-100";
  if (s.range && (i < s.range[0] || i > s.range[1])) return "bg-stone-700";
  return "bg-stone-500";
}

function Swatch({ className, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-stone-400">
      <span className={`inline-block w-3 h-3 rounded-sm ${className}`} /> {label}
    </span>
  );
}

const BTN = "inline-flex items-center justify-center gap-2 text-sm bg-stone-900/60 hover:bg-stone-700 border border-stone-700 text-stone-200 px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-stone-900/60";

export default function AlgoVisualizerDemo() {
  const shouldReduceMotion = useReducedMotion();
  const { lang } = useLang();
  const t = TEXT[lang];
  useDocumentMeta({ title: t.metaTitle, description: t.metaDescription });

  const [algo, setAlgo] = useState("bubble");
  const [seed, setSeed] = useState(7);
  const [size, setSize] = useState(20);
  const [speed, setSpeed] = useState(6);
  const [targetChoice, setTargetChoice] = useState(null);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const meta = ALGOS[algo];
  const isSearch = meta.type === "search";

  const arr = useMemo(
    () => makeArray(size, seed, { sorted: algo === "binary" }),
    [size, seed, algo]
  );
  const target = targetChoice ?? arr[Math.floor(arr.length * 0.65)];

  const steps = useMemo(
    () => (isSearch ? SEARCHERS[algo](arr, target) : SORTERS[algo](arr)),
    [algo, arr, target, isSearch]
  );
  const last = steps.length - 1;
  const cur = steps[Math.min(step, last)];

  // Reproducción automática: un paso cada DELAYS[speed-1] ms.
  useEffect(() => {
    if (!playing || step >= last) return;
    const id = setTimeout(() => setStep((s) => Math.min(s + 1, last)), DELAYS[speed - 1]);
    return () => clearTimeout(id);
  }, [playing, step, last, speed]);

  const finished = step >= last;
  const running = playing && !finished;

  const restart = () => {
    setStep(0);
    setPlaying(false);
  };
  const pickAlgo = (id) => {
    setAlgo(id);
    setTargetChoice(null);
    restart();
  };
  const newArray = () => {
    setSeed((x) => x + 1);
    setTargetChoice(null);
    restart();
  };
  const togglePlay = () => {
    if (finished) {
      setStep(0);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  };
  const goStep = (delta) => {
    setPlaying(false);
    setStep((s) => Math.max(0, Math.min(last, s + delta)));
  };
  const chooseTarget = (v) => {
    setTargetChoice(v);
    restart();
  };

  const fadeIn = shouldReduceMotion ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };
  const showValues = arr.length <= 22;
  const sortIds = Object.keys(ALGOS).filter((id) => ALGOS[id].type === "sort");
  const searchIds = Object.keys(ALGOS).filter((id) => ALGOS[id].type === "search");
  const legend = isSearch
    ? [["bg-amber-400", t.legendSearch.probe], ["bg-green-500", t.legendSearch.found], ["bg-stone-700", t.legendSearch.out], ["bg-stone-500", t.legendSearch.normal]]
    : [["bg-amber-400", t.legend.compare], ["bg-red-400", t.legend.swap], ["bg-green-500", t.legend.sorted], ...(algo === "quick" ? [["bg-stone-100", t.legend.pivot]] : []), ["bg-stone-500", t.legend.normal]];
  const counters = [
    [t.step, `${Math.min(step, last)} / ${last}`],
    [t.cmps, cur.cmps],
    isSearch ? [t.elements, arr.length] : [t.swaps, cur.swaps],
  ];

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
          <p className="text-stone-400 max-w-3xl text-lg leading-relaxed">{t.intro}</p>
        </motion.div>

        <div className="flex items-start gap-3 bg-stone-800/50 border border-stone-700/50 rounded-xl px-5 py-4 mb-8 text-sm text-stone-300">
          <LuInfo className="mt-0.5 shrink-0 text-stone-400" />
          <p><strong className="text-white">{t.noteStrong}</strong>{t.noteRest}</p>
        </div>

        {/* Elegir algoritmo */}
        <div className="bg-stone-800/50 border border-stone-700/50 rounded-2xl p-6 mb-6">
          <div className="grid gap-5 md:grid-cols-2">
            {[[t.sorting, sortIds], [t.searching, searchIds]].map(([label, ids]) => (
              <div key={label}>
                <p className="text-xs font-semibold tracking-wider uppercase text-stone-500 mb-2">{label}</p>
                <div className="flex flex-wrap gap-2">
                  {ids.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => pickAlgo(id)}
                      aria-pressed={algo === id}
                      className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
                        algo === id
                          ? "bg-stone-100 text-stone-950 border-stone-100"
                          : "bg-stone-900/40 text-stone-300 border-stone-700 hover:border-stone-500"
                      }`}
                    >
                      {ALGOS[id].name[lang]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico */}
        <div className="bg-stone-800/50 border border-stone-700/50 rounded-2xl p-6 mb-6">
          <div
            role="img"
            aria-label={`${t.chartLabel}: ${cur.a.join(", ")}`}
            className="flex items-end gap-[3px] h-72 sm:h-80"
          >
            {cur.a.map((v, i) => (
              <div key={i} className="flex-1 min-w-0 h-full flex flex-col justify-end items-center">
                {showValues && <span className="text-[10px] text-stone-400 mb-1 tabular-nums">{v}</span>}
                <div
                  className={`w-full rounded-t ${barColor(cur, i, isSearch)} ${shouldReduceMotion ? "" : "transition-colors duration-100"}`}
                  style={{ height: `${v}%` }}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
            {legend.map(([cls, label]) => <Swatch key={label} className={cls} label={label} />)}
          </div>

          <p className="mt-4 min-h-[3rem] text-stone-200 leading-relaxed" aria-live={running ? "off" : "polite"}>
            {describe(t, algo, cur, arr.length)}
          </p>
          {algo === "binary" && <p className="text-xs text-stone-500">{t.needSorted}</p>}
        </div>

        {/* Controles */}
        <div className="bg-stone-800/50 border border-stone-700/50 rounded-2xl p-6 mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button type="button" onClick={togglePlay} className="inline-flex items-center gap-2 text-sm font-semibold bg-stone-100 hover:bg-white text-stone-950 px-5 py-2 rounded-lg transition-colors">
              {running ? <LuPause /> : <LuPlay />} {running ? t.pause : t.play}
            </button>
            <button type="button" onClick={() => goStep(-1)} disabled={step === 0} className={BTN} aria-label={t.back1} title={t.back1}>
              <LuStepBack />
            </button>
            <button type="button" onClick={() => goStep(1)} disabled={finished} className={BTN} aria-label={t.fwd1} title={t.fwd1}>
              <LuStepForward />
            </button>
            <button type="button" onClick={restart} className={BTN}>
              <LuRotateCcw /> {t.reset}
            </button>
            <button type="button" onClick={newArray} className={BTN}>
              <LuShuffle /> {t.newArray}
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block text-sm text-stone-300">
              <span className="flex justify-between mb-2"><span>{t.speed}</span><span className="text-stone-500 tabular-nums">{speed}/10</span></span>
              <input type="range" min="1" max="10" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-stone-400" />
            </label>
            <label className="block text-sm text-stone-300">
              <span className="flex justify-between mb-2"><span>{t.size}</span><span className="text-stone-500 tabular-nums">{size}</span></span>
              <input
                type="range" min="6" max="40" value={size}
                onChange={(e) => { setSize(Number(e.target.value)); setTargetChoice(null); restart(); }}
                className="w-full accent-stone-400"
              />
            </label>
            {isSearch && (
              <div className="text-sm text-stone-300">
                <label htmlFor="algo-target" className="block mb-2">{t.target}</label>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    id="algo-target" type="number" min="1" max="99" value={target}
                    onChange={(e) => { const v = Number(e.target.value); if (Number.isFinite(v)) chooseTarget(v); }}
                    className="w-20 bg-stone-900/60 border border-stone-700 rounded-lg px-3 py-1.5 text-white"
                  />
                  <button type="button" className={`${BTN} !px-3 !py-1.5`} onClick={() => chooseTarget(arr[Math.floor(Math.random() * arr.length)])}>{t.pickRandom}</button>
                  <button type="button" className={`${BTN} !px-3 !py-1.5`} onClick={() => chooseTarget(2)}>{t.pickAbsent}</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contadores + complejidad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {counters.map(([label, value]) => (
            <div key={label} className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-4">
              <p className="text-xs uppercase tracking-wider text-stone-500 mb-1">{label}</p>
              <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-stone-800/50 border border-stone-700/50 rounded-2xl p-6">
          <h2 className="text-white font-bold mb-2">{meta.name[lang]}</h2>
          <p className="text-stone-300 leading-relaxed mb-4">{meta.info[lang]}</p>
          <p className="text-xs font-semibold tracking-wider uppercase text-stone-500 mb-2">{t.complexity}</p>
          <div className="flex flex-wrap gap-3 text-sm">
            {[[t.best, meta.best], [t.avg, meta.avg], [t.worst, meta.worst]].map(([label, value]) => (
              <span key={label} className="bg-stone-900/50 border border-stone-700 rounded-lg px-3 py-1.5 text-stone-300">
                {label}: <code className="text-white font-semibold">{value}</code>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

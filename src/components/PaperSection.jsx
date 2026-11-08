import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { HiOutlineArrowRight } from "react-icons/hi";
import { FaPlay } from "react-icons/fa";
import papel from "../data/papel";
import { bubbleSort, binarySearch } from "../lib/algorithms";
import { loadHandFont } from "../lib/theme";
import { EASE } from "../lib/motion";
import useLang from "../i18n/useLang";
import tr from "../i18n/tr";

const TEXT = {
  es: {
    badge: "Programo en papel",
    title: "Primero a mano, después en código",
    intro: "Antes de escribir una línea, resuelvo el algoritmo en el cuaderno. Es como pienso y como lo enseño en clase. A la izquierda, la hoja; a la derecha, el mismo algoritmo corriendo de verdad.",
    sheetLabel: "Del cuaderno",
    codeLabel: "En código",
    run: "Ejecutar",
    output: "Salida",
    outputHint: "Tocá Ejecutar para correrlo.",
    lab: "Verlo animado en el Lab",
    modeHint: "Tip: el botón de la hoja en la barra activa el modo papel de todo el sitio.",
  },
  en: {
    badge: "I code on paper",
    title: "By hand first, then in code",
    intro: "Before writing a line, I work the algorithm out in a notebook. It's how I think and how I teach it in class. On the left, the page; on the right, the same algorithm actually running.",
    sheetLabel: "From the notebook",
    codeLabel: "As code",
    run: "Run",
    output: "Output",
    outputHint: "Press Run to execute it.",
    lab: "See it animated in the Lab",
    modeHint: "Tip: the page button in the navbar turns the whole site into paper mode.",
  },
};

// Corre el algoritmo REAL (src/lib/algorithms.js) y devuelve las líneas de salida.
function runExample(id, lang) {
  if (id === "binaria") {
    const a = [3, 8, 15, 23, 42, 57, 61, 78, 90];
    const target = 57;
    const out = [`a = [${a.join(", ")}], x = ${target}`];
    for (const s of binarySearch(a, target)) {
      if (s.kind === "probe") {
        const sym = s.rel === "eq" ? "=" : s.rel === "lt" ? "<" : ">";
        out.push(
          lang === "es"
            ? `[${s.range[0]}..${s.range[1]}] medio=${s.idx[0]} → ${s.value} ${sym} ${target}`
            : `[${s.range[0]}..${s.range[1]}] mid=${s.idx[0]} → ${s.value} ${sym} ${target}`
        );
      } else if (s.kind === "found") {
        out.push(lang === "es" ? `⇒ índice ${s.at} (${s.cmps} comparaciones)` : `⇒ index ${s.at} (${s.cmps} comparisons)`);
      }
    }
    return out;
  }
  const arr = [5, 2, 9, 1, 6];
  const steps = bubbleSort(arr);
  const out = [`[${arr.join(", ")}]`];
  for (const s of steps) {
    if (s.kind === "swap") out.push(`  ↔ [${s.a.join(", ")}]`);
  }
  const end = steps[steps.length - 1];
  out.push(
    lang === "es"
      ? `⇒ [${end.a.join(", ")}] (${end.cmps} comparaciones, ${end.swaps} intercambios)`
      : `⇒ [${end.a.join(", ")}] (${end.cmps} comparisons, ${end.swaps} swaps)`
  );
  return out;
}

// Hoja de cuaderno: renglones, margen rojo y letra manuscrita. Los colores son fijos
// (papel y tinta) para que se vea igual en modo oscuro y en modo papel.
function Sheet({ entry, lang }) {
  const frame = "relative rounded-sm shadow-xl shadow-black/40 rotate-[-1deg]";
  if (entry.image) {
    return (
      <div className={`${frame} bg-[#fbf6e6] p-2`}>
        <img src={entry.image} alt={tr(entry.imageAlt, lang)} loading="lazy" className="w-full h-auto rounded-sm" />
      </div>
    );
  }
  return (
    <div
      className={`${frame} bg-[#fbf6e6] text-[#1e3a8a] pl-14 pr-5 py-5`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(to bottom, transparent 0, transparent 35px, rgba(59,130,246,0.28) 35px, rgba(59,130,246,0.28) 36px)",
      }}
    >
      <span aria-hidden="true" className="absolute top-0 bottom-0 left-10 w-px bg-red-400/70" />
      <span aria-hidden="true" className="absolute -top-2 left-1/2 -translate-x-1/2 w-24 h-5 rotate-[2deg] bg-amber-200/70" />
      <div className="font-hand text-[22px] leading-[36px] whitespace-pre-wrap" role="img" aria-label={tr(entry.sheet, lang).join(". ")}>
        {tr(entry.sheet, lang).map((line, i) => (
          <div key={`${entry.id}-${i}`} aria-hidden="true">{line}</div>
        ))}
      </div>
    </div>
  );
}

export default function PaperSection() {
  const shouldReduceMotion = useReducedMotion();
  const { lang } = useLang();
  const t = TEXT[lang];
  const [activeId, setActiveId] = useState(papel[0].id);
  const [output, setOutput] = useState(null);

  useEffect(() => {
    loadHandFont();
  }, []);

  const entry = papel.find((p) => p.id === activeId);
  const fade = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 } };

  const pick = (id) => {
    setActiveId(id);
    setOutput(null);
  };

  return (
    <motion.div {...fade} viewport={{ once: true }} transition={{ duration: 0.7, ease: EASE }} className="mt-32 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <span className="inline-block py-1 px-3 rounded-full bg-white/5 text-stone-300 text-xs font-semibold tracking-wider uppercase mb-4 border border-white/15">
          ✎ {t.badge}
        </span>
        <h2 className="text-3xl font-bold text-white mb-4">{t.title}</h2>
        <p className="text-stone-400 max-w-2xl mx-auto">{t.intro}</p>
      </div>

      <div className="flex justify-center gap-2 mb-8" role="group" aria-label={t.badge}>
        {papel.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => pick(p.id)}
            aria-pressed={activeId === p.id}
            className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
              activeId === p.id
                ? "bg-stone-100 text-stone-950 border-stone-100"
                : "bg-stone-900/40 text-stone-300 border-stone-700 hover:border-stone-500"
            }`}
          >
            {tr(p.title, lang)}
          </button>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 items-start">
        <div>
          <p className="text-[11px] font-semibold tracking-wider uppercase text-stone-500 mb-3">{t.sheetLabel}</p>
          <Sheet entry={entry} lang={lang} />
        </div>

        <div>
          <p className="text-[11px] font-semibold tracking-wider uppercase text-stone-500 mb-3">{t.codeLabel}</p>
          <pre className="bg-stone-950 border border-stone-700/60 rounded-xl p-4 text-[13px] leading-relaxed text-stone-200 overflow-x-auto">
            <code>{tr(entry.code, lang)}</code>
          </pre>
          <div className="flex items-center gap-3 mt-3">
            <button
              type="button"
              onClick={() => setOutput(runExample(entry.id, lang))}
              className="inline-flex items-center gap-2 text-sm font-semibold bg-stone-100 hover:bg-white text-stone-950 px-4 py-2 rounded-lg transition-colors"
            >
              <FaPlay className="text-xs" /> {t.run}
            </button>
            <Link to="/lab/algoritmos" className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-white underline underline-offset-4 transition-colors">
              {t.lab} <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-3 bg-stone-950 border border-stone-700/60 rounded-xl p-4 min-h-[6rem] text-[13px] leading-relaxed" aria-live="polite">
            <p className="text-[11px] font-semibold tracking-wider uppercase text-stone-500 mb-2">{t.output}</p>
            {output ? (
              <pre className="text-green-400 whitespace-pre-wrap">{output.join("\n")}</pre>
            ) : (
              <p className="text-stone-500">{t.outputHint}</p>
            )}
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-stone-500 mt-8">{t.modeHint}</p>
    </motion.div>
  );
}

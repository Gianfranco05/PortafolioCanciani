import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import useLang from "../i18n/useLang";
import projects from "../data/projects";
import experience from "../data/experience";
import labDemos from "../data/lab";
import { MEDITATIONS_AUTHOR, randomQuote } from "../lib/quotes";
import { getTheme, setTheme, toggleTheme } from "../lib/theme";

const EMAIL = "gianfrancocanciani@gmail.com";
const PAGES = {
  home: "/", inicio: "/",
  projects: "/projects", proyectos: "/projects",
  experience: "/experience", experiencia: "/experience",
  lab: "/lab",
  contact: "/contact", contacto: "/contact",
  facetrack: "/lab/facetrack",
  synctune: "/lab/synctune",
  siem: "/lab/siem",
  algoritmos: "/lab/algoritmos", algorithms: "/lab/algoritmos",
};
const COMMANDS = ["help", "whoami", "ls", "projects", "experience", "stack", "lab", "contact", "goto", "theme", "lang", "quote", "coffee", "date", "echo", "sudo", "clear", "exit"];

const pick = (v, lang) => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] ?? v.es : v);

const TEXT = {
  es: {
    welcome: "Terminal de GC. Escribí help para ver los comandos. Esc para salir.",
    unknown: (c) => `comando no encontrado: ${c}. Probá con help.`,
    help: [
      ["whoami", "quién soy"],
      ["projects", "mis proyectos"],
      ["experience", "dónde enseño y trabajo"],
      ["stack", "con qué tecnologías trabajo"],
      ["lab", "demos para probar en vivo"],
      ["contact", "cómo escribirme"],
      ["goto <página>", "abrir una página (home, projects, lab, algoritmos…)"],
      ["theme [paper|dark]", "cambiar el tema; sin argumento alterna"],
      ["lang [es|en]", "cambiar el idioma"],
      ["quote", "una cita de Marco Aurelio"],
      ["coffee", "un café"],
      ["clear · exit", "limpiar · cerrar"],
    ],
    whoami: ["Gianfranco Canciani", "Desarrollador backend y docente de programación.", "Mendoza, Argentina. Tutor en la UTN, profesor en el Instituto Celsius."],
    stack: ["Python (FastAPI) · Java (Spring Boot) · React · TypeScript", "PostgreSQL · MySQL · Docker · Git"],
    ls: "Páginas: home  projects  experience  lab  contact. Abrilas con goto <nombre>.",
    gotoUsage: "uso: goto <página>. Opciones: ",
    gotoOk: (p) => `abriendo ${p}…`,
    themeNow: (t) => `tema: ${t === "paper" ? "papel" : "oscuro"}`,
    themeBad: "uso: theme [paper|dark]",
    langBad: "uso: lang [es|en]",
    langOk: "idioma: español",
    sudo: "visitante no figura en el archivo sudoers. Este incidente no será reportado (nadie lee eso).",
    coffee: ["      ( (", "       ) )", "    ........", "    |      |]", "    \\      /", "     `----'", "café servido. Ahora sí, a programar."],
    contact: "Escribime:",
    labDemo: "demos del Lab:",
  },
  en: {
    welcome: "GC terminal. Type help to see the commands. Esc to leave.",
    unknown: (c) => `command not found: ${c}. Try help.`,
    help: [
      ["whoami", "who I am"],
      ["projects", "my projects"],
      ["experience", "where I teach and work"],
      ["stack", "the technologies I use"],
      ["lab", "demos you can try live"],
      ["contact", "how to reach me"],
      ["goto <page>", "open a page (home, projects, lab, algorithms…)"],
      ["theme [paper|dark]", "switch theme; no argument toggles"],
      ["lang [es|en]", "switch language"],
      ["quote", "a Marcus Aurelius quote"],
      ["coffee", "a coffee"],
      ["clear · exit", "clear · close"],
    ],
    whoami: ["Gianfranco Canciani", "Backend developer and programming teacher.", "Mendoza, Argentina. Tutor at UTN, teacher at Instituto Celsius."],
    stack: ["Python (FastAPI) · Java (Spring Boot) · React · TypeScript", "PostgreSQL · MySQL · Docker · Git"],
    ls: "Pages: home  projects  experience  lab  contact. Open them with goto <name>.",
    gotoUsage: "usage: goto <page>. Options: ",
    gotoOk: (p) => `opening ${p}…`,
    themeNow: (t) => `theme: ${t === "paper" ? "paper" : "dark"}`,
    themeBad: "usage: theme [paper|dark]",
    langBad: "usage: lang [es|en]",
    langOk: "language: English",
    sudo: "visitor is not in the sudoers file. This incident will not be reported (nobody reads that).",
    coffee: ["      ( (", "       ) )", "    ........", "    |      |]", "    \\      /", "     `----'", "coffee served. Now, back to coding."],
    contact: "Reach me at:",
    labDemo: "Lab demos:",
  },
};

export default function HiddenTerminal({ onClose }) {
  const shouldReduceMotion = useReducedMotion();
  const { lang, setLang } = useLang();
  const navigate = useNavigate();
  const t = TEXT[lang];
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const previousFocus = useRef(null);
  const [lines, setLines] = useState(() => [{ text: t.welcome, tone: "dim" }]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState([]);
  const [cursor, setCursor] = useState(-1);

  useEffect(() => {
    previousFocus.current = document.activeElement;
    inputRef.current?.focus();
    return () => previousFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const print = (...items) =>
    setLines((prev) => [...prev, ...items.flat().map((i) => (typeof i === "string" ? { text: i } : i))]);

  const run = (raw) => {
    const [cmd, ...args] = raw.trim().split(/\s+/);
    const arg = args.join(" ").toLowerCase();
    switch ((cmd || "").toLowerCase()) {
      case "":
        return;
      case "help":
        return print(t.help.map(([c, d]) => ({ text: `${c.padEnd(20)}${d}` })));
      case "whoami":
        return print(t.whoami);
      case "ls":
        return print(t.ls);
      case "stack":
        return print(t.stack);
      case "projects":
        return print(projects.map((p) => ({ text: `• ${pick(p.name, lang)}`, ...(p.repoUrl ? { href: p.repoUrl } : {}) })));
      case "experience":
        return print(experience.map((e) => `• ${pick(e.role, lang)} — ${pick(e.org, lang)} (${pick(e.period, lang)})`));
      case "lab":
        return print(t.labDemo, labDemos.map((d) => ({ text: `• ${pick(d.name, lang)}  ${d.path}`, to: d.path })));
      case "contact":
        return print(t.contact, [
          { text: `  ${EMAIL}`, href: `mailto:${EMAIL}` },
          { text: "  github.com/Gianfranco05", href: "https://github.com/Gianfranco05" },
          { text: "  linkedin.com/in/gianfranco-canciani-6a5189255", href: "https://www.linkedin.com/in/gianfranco-canciani-6a5189255" },
        ]);
      case "goto":
      case "cd":
      case "open": {
        const path = PAGES[arg.replace(/^\/+/, "")];
        if (!path) return print(t.gotoUsage + [...new Set(Object.keys(PAGES))].join(", "));
        print(t.gotoOk(path));
        navigate(path);
        onClose();
        return;
      }
      case "theme": {
        if (!arg) toggleTheme();
        else if (arg === "paper" || arg === "papel") setTheme("paper");
        else if (arg === "dark" || arg === "oscuro") setTheme("dark");
        else return print(t.themeBad);
        return print(t.themeNow(getTheme()));
      }
      case "lang": {
        if (arg !== "es" && arg !== "en") return print(t.langBad);
        setLang(arg);
        return print(TEXT[arg].langOk);
      }
      case "quote":
        return print(`“${randomQuote(lang)}”`, { text: `— ${MEDITATIONS_AUTHOR[lang]}`, tone: "dim" });
      case "coffee":
        return print(t.coffee);
      case "date":
        return print(new Date().toLocaleString(lang === "es" ? "es-AR" : "en-US"));
      case "echo":
        return print(args.join(" "));
      case "sudo":
        return print(t.sudo);
      case "clear":
        return setLines([]);
      case "exit":
      case "quit":
        return onClose();
      default:
        return print({ text: t.unknown(cmd), tone: "error" });
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const raw = value;
    setLines((prev) => [...prev, { text: `visitante@gc:~$ ${raw}`, tone: "prompt" }]);
    if (raw.trim()) setHistory((h) => [...h, raw]);
    setCursor(-1);
    setValue("");
    run(raw);
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = cursor === -1 ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cursor === -1) return;
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(-1);
        setValue("");
      } else {
        setCursor(next);
        setValue(history[next]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const word = value.trim().toLowerCase();
      if (!word || value.includes(" ")) return;
      const match = COMMANDS.find((c) => c.startsWith(word));
      if (match) setValue(match);
    }
  };

  const toneClass = { dim: "text-[#5f8f6a]", error: "text-[#f87171]", prompt: "text-[#d9f99d]" };
  const anim = shouldReduceMotion ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6" data-terminal>
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <motion.div
        {...anim}
        transition={{ duration: 0.2 }}
        role="dialog"
        aria-modal="true"
        aria-label={lang === "es" ? "Terminal" : "Terminal"}
        onClick={() => inputRef.current?.focus()}
        className="relative w-full max-w-3xl h-[70dvh] sm:h-[28rem] flex flex-col rounded-t-xl sm:rounded-xl border border-[#1f3d27] bg-[#0a0e0b] text-[#9be7a8] shadow-2xl shadow-black/60 font-mono text-[13px] sm:text-sm"
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#1f3d27] text-[#5f8f6a] text-xs">
          <span>gc — bash</span>
          <button type="button" onClick={onClose} className="hover:text-[#d9f99d]" aria-label={lang === "es" ? "Cerrar terminal" : "Close terminal"}>
            esc ✕
          </button>
        </div>

        <div ref={scrollRef} role="log" aria-live="polite" className="flex-1 overflow-y-auto px-4 py-3 whitespace-pre-wrap break-words">
          {lines.map((l, i) => {
            const cls = `${toneClass[l.tone] ?? ""} leading-relaxed`;
            const key = `${i}-${l.text.slice(0, 12)}`;
            if (l.to) {
              return (
                <button key={key} type="button" className={`${cls} block text-left underline decoration-dotted underline-offset-4 hover:text-[#d9f99d]`} onClick={() => { navigate(l.to); onClose(); }}>
                  {l.text}
                </button>
              );
            }
            if (l.href) {
              return (
                <a key={key} href={l.href} target={l.href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" className={`${cls} block underline decoration-dotted underline-offset-4 hover:text-[#d9f99d]`}>
                  {l.text}
                </a>
              );
            }
            return <div key={key} className={cls}>{l.text}</div>;
          })}
        </div>

        <form onSubmit={submit} className="flex items-center gap-2 px-4 py-3 border-t border-[#1f3d27]">
          <label htmlFor="terminal-input" className="text-[#d9f99d] shrink-0">visitante@gc:~$</label>
          <input
            id="terminal-input"
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="flex-1 min-w-0 bg-transparent outline-none text-[#9be7a8] caret-[#d9f99d] text-base sm:text-sm"
          />
        </form>
      </motion.div>
    </div>
  );
}

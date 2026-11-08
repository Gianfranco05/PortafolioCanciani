import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaExternalLinkAlt, FaPlay } from 'react-icons/fa';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import projects from '../data/projects';
import { EASE, fadeUp, staggerContainer, handleSpotlightMove } from '../lib/motion';
import useLang from '../i18n/useLang';
import tr from '../i18n/tr';
import useDocumentMeta from '../i18n/useDocumentMeta';

const TEXT = {
  es: {
    metaTitle: "Proyectos",
    metaDescription: "Proyectos de Gianfranco Canciani: reconocimiento facial, SyncTune (YouTube a Spotify), SIEM con machine learning y ecommerce con Java y FastAPI.",
    title: "Proyectos Destacados",
    subtitle: "Una selección de mis trabajos recientes enfocados en automatización, APIs, machine learning y desarrollo backend.",
    filterLabel: "Filtrar por tecnología",
    all: "Todos",
    count: (n, total) => `${n} de ${total} proyectos`,
    clear: "Quitar filtro",
    empty: "Ningún proyecto usa esa tecnología.",
    captureOf: (name) => `Portada de ${name}`,
    tryDemo: "Probar demo",
    viewDemo: "Ver Demo",
    viewCode: "Ver Código",
    repoSoon: "Repo próximamente",
  },
  en: {
    metaTitle: "Projects",
    metaDescription: "Projects by Gianfranco Canciani: face recognition, SyncTune (YouTube to Spotify), an ML-powered SIEM and Java/FastAPI e-commerce platforms.",
    title: "Featured Projects",
    subtitle: "A selection of my recent work focused on automation, APIs, machine learning and backend development.",
    filterLabel: "Filter by technology",
    all: "All",
    count: (n, total) => `${n} of ${total} projects`,
    clear: "Clear filter",
    empty: "No project uses that technology.",
    captureOf: (name) => `Cover of ${name}`,
    tryDemo: "Try demo",
    viewDemo: "View Demo",
    viewCode: "View Code",
    repoSoon: "Repo coming soon",
  },
};

// Tecnologías que se ofrecen como filtro (las más relevantes; el resto sigue visible en cada tarjeta).
const FILTERS = ["Python", "Java", "React", "React Native", "TypeScript", "FastAPI", "Spring Boot", "PostgreSQL", "Docker"];

export default function Projects() {
  const shouldReduceMotion = useReducedMotion();
  const { lang } = useLang();
  const t = TEXT[lang];
  useDocumentMeta({ title: t.metaTitle, description: t.metaDescription });
  const [filter, setFilter] = useState(null);
  const visible = useMemo(
    () => (filter ? projects.filter((p) => p.tech.includes(filter)) : projects),
    [filter],
  );

  const containerVariants = staggerContainer(shouldReduceMotion, 0.12);
  const itemVariants = fadeUp(shouldReduceMotion, 36);

  const titleAnim = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <section id="main-content" className="min-h-screen bg-stone-900 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          {...titleAnim}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            {t.title}
          </h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-stone-500 to-stone-200 mx-auto rounded-full mb-6"
          />
          <p className="text-stone-400 max-w-2xl mx-auto text-lg">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Filtro por tecnología */}
        <div className="mb-10">
          <div role="group" aria-label={t.filterLabel} className="flex flex-wrap justify-center gap-2">
            {[null, ...FILTERS].map((tech) => {
              const active = filter === tech;
              return (
                <button
                  key={tech ?? "all"}
                  type="button"
                  onClick={() => setFilter(tech)}
                  aria-pressed={active}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    active
                      ? "bg-stone-100 text-stone-950 border-stone-100"
                      : "bg-stone-800/60 text-stone-300 border-stone-700 hover:border-stone-400 hover:text-white"
                  }`}
                >
                  {tech ?? t.all}
                </button>
              );
            })}
          </div>
          <p className="text-center text-xs text-stone-500 mt-4" aria-live="polite">
            {filter ? (
              <>
                {t.count(visible.length, projects.length)} ·{" "}
                <button type="button" onClick={() => setFilter(null)} className="underline underline-offset-2 hover:text-stone-300">
                  {t.clear}
                </button>
              </>
            ) : (
              ""
            )}
          </p>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
          {visible.map((proj) => (
            <motion.div
              layout={!shouldReduceMotion}
              variants={itemVariants}
              exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
              key={proj.id}
              onMouseMove={handleSpotlightMove}
              whileHover={shouldReduceMotion ? {} : { y: -8, borderColor: "rgba(255, 255, 255, 0.25)" }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="spotlight bg-stone-800 rounded-2xl overflow-hidden border border-stone-700/50 flex flex-col group hover:shadow-2xl hover:shadow-black/50 transition-shadow duration-500"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={proj.image} 
                  alt={t.captureOf(tr(proj.name, lang))} 
                  loading="lazy"
                  className="w-full h-56 object-cover object-top transform group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
               
              <div className="p-8 flex flex-col grow">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-stone-300 transition-colors">{tr(proj.name, lang)}</h3>
                <p className="text-stone-400 mb-6 grow leading-relaxed">{tr(proj.description, lang)}</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {proj.tech.map((tag) => (
                    <motion.span 
                      key={tag}
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.10)", borderColor: "rgba(255, 255, 255, 0.3)" }}
                      className="bg-stone-900/50 border border-stone-600 text-stone-300 text-xs font-medium px-3 py-1 rounded-full cursor-default"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
                
                <div className="mt-auto flex flex-wrap gap-3">
                  {proj.demoUrl && proj.demoUrl.startsWith("/") && (
                    <Link
                      to={proj.demoUrl}
                      className="btn-shine flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap bg-stone-100 hover:bg-white text-stone-950 px-4 py-2.5 rounded-lg font-medium transition-colors"
                    >
                      <FaPlay className="text-xs" /> {t.tryDemo}
                    </Link>
                  )}
                  {proj.demoUrl && !proj.demoUrl.startsWith("/") && (
                    <motion.a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="btn-shine flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap bg-stone-100 hover:bg-white text-stone-950 px-4 py-2.5 rounded-lg font-medium transition-colors"
                    >
                      <FaExternalLinkAlt className="text-xs" /> {t.viewDemo}
                    </motion.a>
                  )}

                  {proj.repos ? (
                    proj.repos.map((repo) => (
                      <motion.a
                        key={repo.url}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap bg-stone-700 hover:bg-stone-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                      >
                        <FaGithub /> {repo.label}
                      </motion.a>
                    ))
                  ) : proj.repoUrl ? (
                    <motion.a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap bg-stone-700 hover:bg-stone-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors ${
                        proj.demoUrl ? "flex-1" : "w-full"
                      }`}
                    >
                      <FaGithub /> {t.viewCode}
                    </motion.a>
                  ) : (
                    <span
                      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap bg-stone-900/50 border border-stone-700/50 text-stone-500 px-4 py-2.5 rounded-lg font-medium cursor-default ${
                        proj.demoUrl ? "flex-1" : "w-full"
                      }`}
                    >
                      <FaGithub /> {t.repoSoon}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </motion.div>

        {visible.length === 0 && <p className="text-center text-stone-500 mt-10">{t.empty}</p>}
      </div>
    </section>
  );
}

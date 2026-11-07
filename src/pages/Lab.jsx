import { Link } from 'react-router-dom';
import { LuFlaskConical, LuPlay, LuClock } from 'react-icons/lu';
import { motion, useReducedMotion } from 'framer-motion';
import labDemos from '../data/lab';
import { EASE, fadeUp, staggerContainer, handleSpotlightMove } from '../lib/motion';
import useLang from '../i18n/useLang';
import tr from '../i18n/tr';
import useDocumentMeta from '../i18n/useDocumentMeta';

const TEXT = {
  es: {
    metaTitle: "Lab — Demos interactivas",
    metaDescription: "Probá en tu navegador demos de mis proyectos: reconocimiento facial, matching de YouTube a Spotify y detección de anomalías en logs.",
    title: "Probá mis proyectos",
    subtitle: "Demos interactivas que corren directo en tu navegador. Cada una aclara qué parte es real y qué parte es una versión simplificada del proyecto completo.",
    tryDemo: "Probar demo",
    soon: "Próximamente",
  },
  en: {
    metaTitle: "Lab — Interactive demos",
    metaDescription: "Try demos of my projects in your browser: face recognition, YouTube-to-Spotify matching and log anomaly detection.",
    title: "Try my projects",
    subtitle: "Interactive demos that run right in your browser. Each one states which part is real and which part is a simplified version of the full project.",
    tryDemo: "Try demo",
    soon: "Coming soon",
  },
};

export default function Lab() {
  const shouldReduceMotion = useReducedMotion();
  const { lang } = useLang();
  const t = TEXT[lang];
  useDocumentMeta({ title: t.metaTitle, description: t.metaDescription });
  const containerVariants = staggerContainer(shouldReduceMotion, 0.12);
  const itemVariants = fadeUp(shouldReduceMotion, 30);
  const titleAnim = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <section id="main-content" className="min-h-screen bg-stone-900 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          {...titleAnim}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/5 text-stone-200 text-sm font-semibold tracking-wider mb-6 border border-white/15">
            <LuFlaskConical className="text-xs" /> Lab
          </span>
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {labDemos.map((demo) => {
            const available = demo.status === "available";
            return (
              <motion.div
                key={demo.id}
                variants={itemVariants}
                onMouseMove={handleSpotlightMove}
                whileHover={shouldReduceMotion || !available ? {} : { y: -6 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={`spotlight rounded-2xl border p-8 flex flex-col ${
                  available
                    ? "bg-stone-800 border-stone-700/50"
                    : "bg-stone-800/40 border-stone-800"
                }`}
              >
                <p className="text-xs font-semibold tracking-wider uppercase text-stone-500 mb-2">
                  {tr(demo.tagline, lang)}
                </p>
                <h3 className={`text-2xl font-bold mb-3 ${available ? "text-white" : "text-stone-400"}`}>
                  {tr(demo.name, lang)}
                </h3>
                <p className="text-stone-400 leading-relaxed mb-6 grow">{tr(demo.description, lang)}</p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {demo.tech.map((tag) => (
                    <span
                      key={tr(tag, "es")}
                      className="bg-stone-900/50 border border-stone-600 text-stone-300 text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {tr(tag, lang)}
                    </span>
                  ))}
                </div>

                {available ? (
                  <Link
                    to={demo.path}
                    className="btn-shine mt-auto inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-white text-stone-950 px-4 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    <LuPlay className="text-xs" /> {t.tryDemo}
                  </Link>
                ) : (
                  <span className="mt-auto inline-flex items-center justify-center gap-2 bg-stone-900/50 border border-stone-700/50 text-stone-500 px-4 py-2.5 rounded-lg font-medium cursor-default">
                    <LuClock className="text-xs" /> {t.soon}
                  </span>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

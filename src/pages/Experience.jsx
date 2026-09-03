import { FaBriefcase } from 'react-icons/fa';
import { motion, useReducedMotion } from 'framer-motion';
import experience from '../data/experience';
import { EASE, fadeUp, staggerContainer, handleSpotlightMove } from '../lib/motion';

export default function Experience() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = staggerContainer(shouldReduceMotion, 0.18);
  const itemVariants = fadeUp(shouldReduceMotion, 30);

  const titleAnim = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <section id="main-content" className="min-h-screen bg-stone-900 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          {...titleAnim}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Experiencia
          </h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-stone-500 to-stone-200 mx-auto rounded-full mb-6"
          />
          <p className="text-stone-400 max-w-2xl mx-auto text-lg">
            Docencia y tutoría en programación, combinando la enseñanza con el desarrollo de software.
          </p>
        </motion.div>

        <motion.ol
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative"
        >
          {/* Línea vertical del timeline */}
          <div
            aria-hidden="true"
            className="absolute left-[27px] md:left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-stone-700 via-stone-700 to-transparent md:-translate-x-1/2"
          />

          {experience.map((job, idx) => {
            const alignRight = idx % 2 === 1;
            return (
              <motion.li
                key={job.id}
                variants={itemVariants}
                className="relative pl-16 md:pl-0 mb-12 last:mb-0 md:grid md:grid-cols-2 md:gap-10"
              >
                {/* Marcador */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 md:left-1/2 top-1 w-14 h-14 -translate-x-0 md:-translate-x-1/2 rounded-full bg-stone-800 border border-stone-600 flex items-center justify-center shadow-lg"
                >
                  <FaBriefcase className="text-stone-300 text-lg" />
                </span>

                <div className={`hidden md:block ${alignRight ? "md:order-2" : ""}`} />

                <div
                  onMouseMove={handleSpotlightMove}
                  className={`spotlight bg-stone-800/50 rounded-2xl border border-stone-700/50 p-7 md:p-8 ${
                    alignRight ? "md:order-1 md:text-right" : ""
                  }`}
                >
                  <p className="text-xs font-semibold tracking-wider text-stone-400 uppercase mb-2">
                    {job.period}
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{job.role}</h3>
                  <p className="text-stone-300 font-medium mb-4">{job.org}</p>
                  <p className="text-stone-400 leading-relaxed mb-5">{job.description}</p>

                  <div className={`flex flex-wrap gap-2 ${alignRight ? "md:justify-end" : ""}`}>
                    {job.tech.map((t) => (
                      <motion.span
                        key={t}
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.10)" }}
                        className="bg-stone-900/50 border border-stone-600 text-stone-300 text-xs font-medium px-3 py-1 rounded-full cursor-default"
                      >
                        {t}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}

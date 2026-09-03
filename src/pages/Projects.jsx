import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { motion, useReducedMotion } from 'framer-motion';
import projects from '../data/projects';
import { EASE, fadeUp, staggerContainer, handleSpotlightMove } from '../lib/motion';

export default function Projects() {
  const shouldReduceMotion = useReducedMotion();

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
            Proyectos Destacados
          </h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-stone-500 to-stone-200 mx-auto rounded-full mb-6"
          />
          <p className="text-stone-400 max-w-2xl mx-auto text-lg">
            Una selección de mis trabajos recientes enfocados en automatización, APIs, machine learning y desarrollo backend.
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((proj) => (
            <motion.div
              variants={itemVariants}
              key={proj.id}
              onMouseMove={handleSpotlightMove}
              whileHover={shouldReduceMotion ? {} : { y: -8, borderColor: "rgba(255, 255, 255, 0.25)" }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="spotlight bg-stone-800 rounded-2xl overflow-hidden border border-stone-700/50 flex flex-col group hover:shadow-2xl hover:shadow-black/50 transition-shadow duration-500"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={proj.image} 
                  alt={`Captura de ${proj.name}`} 
                  loading="lazy"
                  className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
               
              <div className="p-8 flex flex-col grow">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-stone-300 transition-colors">{proj.name}</h3>
                <p className="text-stone-400 mb-6 grow leading-relaxed">{proj.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {proj.tech.map((t) => (
                    <motion.span 
                      key={t}
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.10)", borderColor: "rgba(255, 255, 255, 0.3)" }}
                      className="bg-stone-900/50 border border-stone-600 text-stone-300 text-xs font-medium px-3 py-1 rounded-full cursor-default"
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
                
                <div className="mt-auto flex flex-wrap gap-3">
                  {proj.demoUrl && (
                    <motion.a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="btn-shine flex-1 inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-white text-stone-950 px-4 py-2.5 rounded-lg font-medium transition-colors"
                    >
                      <FaExternalLinkAlt className="text-xs" /> Ver Demo
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
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-stone-700 hover:bg-stone-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
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
                      className={`inline-flex items-center justify-center gap-2 bg-stone-700 hover:bg-stone-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors ${
                        proj.demoUrl ? "flex-1" : "w-full"
                      }`}
                    >
                      <FaGithub /> Ver Código
                    </motion.a>
                  ) : (
                    <span
                      className={`inline-flex items-center justify-center gap-2 bg-stone-900/50 border border-stone-700/50 text-stone-500 px-4 py-2.5 rounded-lg font-medium cursor-default ${
                        proj.demoUrl ? "flex-1" : "w-full"
                      }`}
                    >
                      <FaGithub /> Repo próximamente
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

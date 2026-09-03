import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaInstagram, FaServer, FaCode, FaDatabase, FaUsers, FaBrain, FaRocket, FaHandshake, FaBook, FaDownload } from 'react-icons/fa';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE, fadeUp, handleSpotlightMove } from '../lib/motion';

const specialtyCards = [
  { icon: FaCode, title: "Desarrollo Fullstack", text: "Construcción de aplicaciones web con React y TypeScript en el frontend, y APIs robustas con Java, Spring Boot, FastAPI y Node.js en el backend. Guiado por la metodología SDD con flujo OPSX: especificar, diseñar, implementar y archivar." },
  { icon: FaDatabase, title: "Bases de Datos & DevOps", text: "Modelado y administración de bases de datos relacionales con MySQL y PostgreSQL. Control de versiones con Git y despliegues containerizados con Docker." },
  { icon: FaServer, title: "Automatización & Sistemas", text: "Automatización de flujos de trabajo con n8n, sistemas de monitoreo SIEM, y scripting en Python para tareas de integración y análisis de datos." },
];

const skillCards = [
  { icon: FaCode, title: "Lenguajes", tags: ["TypeScript", "Python", "Java", "JavaScript"] },
  { icon: FaServer, title: "Backend", tags: ["Spring Boot", "FastAPI", "Node.js"] },
  { icon: FaCode, title: "Frontend", tags: ["React", "Tailwind CSS", "HTML/CSS"] },
  { icon: FaDatabase, title: "Bases de Datos", tags: ["MySQL", "PostgreSQL", "Elasticsearch"] },
  { icon: FaRocket, title: "Herramientas & DevOps", tags: ["Docker", "Git", "n8n", "Grafana"] },
  { icon: FaBook, title: "Metodologías", tags: ["SDD / OPSX", "Ágil / Scrum"] },
];

const softSkills = [
  { icon: FaUsers, title: "Trabajo en Equipo", text: "Colaboración fluida en equipos multidisciplinarios, aportando y aprendiendo de cada miembro." },
  { icon: FaBrain, title: "Resolución de Problemas", text: "Enfoque analítico para descomponer problemas complejos en soluciones simples y efectivas." },
  { icon: FaRocket, title: "Aprendizaje Continuo", text: "Actualización constante en nuevas tecnologías y metodologías para estar siempre a la vanguardia." },
  { icon: FaHandshake, title: "Comunicación Efectiva", text: "Capacidad para explicar conceptos técnicos de forma clara tanto a colegas como a stakeholders." },
];

const socialLinks = [
  { href: "https://github.com/Gianfranco05", icon: FaGithub, hoverColor: "hover:text-white hover:bg-stone-700", label: "GitHub" },
  { href: "https://www.linkedin.com/in/gianfranco-canciani-6a5189255", icon: FaLinkedin, hoverColor: "hover:text-white hover:bg-stone-700", label: "LinkedIn" },
  { href: "https://instagram.com/gianfranco.c05", icon: FaInstagram, hoverColor: "hover:text-pink-400 hover:bg-stone-700", label: "Instagram" },
];

// Stagger container para secciones con múltiples cards
const staggerContainer = (shouldReduce) => ({
  hidden: { opacity: shouldReduce ? 1 : 0 },
  show: {
    opacity: 1,
    transition: shouldReduce ? {} : { staggerChildren: 0.1 }
  }
});

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const [coinFlipped, setCoinFlipped] = useState(false);
  const [showCoinHint, setShowCoinHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowCoinHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const flipCoin = () => {
    setCoinFlipped((f) => !f);
    setShowCoinHint(false);
  };

  const heroLeft = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 } };

  const heroRight = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } };

  const sectionFade = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0, y: 40, filter: "blur(6px)" }, whileInView: { opacity: 1, y: 0, filter: "blur(0px)" } };

  const containerVariants = staggerContainer(shouldReduceMotion);
  const itemVariants = fadeUp(shouldReduceMotion, 22);

  return (
    <div id="main-content" className="min-h-screen bg-stone-900 pt-28 pb-12 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Sección Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          <motion.div
            {...heroLeft}
            transition={{ duration: 0.9, ease: EASE }}
            className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0"
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="inline-block py-1 px-3 rounded-full bg-white/5 text-stone-200 text-sm font-semibold tracking-wider mb-6 border border-white/15 cursor-default"
            >
              Desarrollador de Software
            </motion.span>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Hola, soy <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-300 via-stone-100 to-white">Gianfranco</span>
            </h1>
            <p className="text-lg lg:text-xl text-stone-400 mb-10 leading-relaxed">
              Apasionado por la creación de software. Radicado en Mendoza, Argentina. Trabajo con TypeScript, Python, Java, Spring Boot, React, FastAPI y Node.js para construir soluciones robustas y escalables. Aplico la metodología SDD (Spec-Driven Development) con el flujo OPSX para mantener un desarrollo organizado, trazable y con especificaciones vivas. Me encanta transformar ideas en código bien escrito.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-5 mb-12">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/projects"
                  className="btn-shine group inline-flex items-center justify-center gap-3 bg-stone-100 hover:bg-white text-stone-950 px-8 py-4 rounded-lg text-lg font-medium transition-all shadow-lg shadow-black/30 hover:shadow-black/40"
                >
                  Explorar Proyectos
                  <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <a
                  href="/CV-Gianfranco-Canciani.pdf"
                  download
                  className="inline-flex items-center justify-center gap-3 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white px-8 py-4 rounded-lg text-lg font-medium transition-all border border-stone-700 hover:border-stone-400/50"
                >
                  <FaDownload className="w-4 h-4" />
                  Descargar CV
                </a>
              </motion.div>
              <div className="flex justify-center gap-4 items-center">
                {socialLinks.map(({ href, icon: Icon, hoverColor, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 bg-stone-800 text-stone-300 rounded-lg transition-all ${hoverColor}`}
                    aria-label={label}
                  >
                    <Icon size={24} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            {...heroRight}
            transition={{ duration: 0.9, delay: shouldReduceMotion ? 0 : 0.15, ease: EASE }}
            className="flex justify-center items-center"
          >
            <div className="relative w-80 h-80 lg:w-96 lg:h-96">
              <motion.div
                animate={shouldReduceMotion ? {} : { scale: [1, 1.08, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-white rounded-full blur-[100px] opacity-20"
              />
              <motion.div
                animate={shouldReduceMotion ? {} : { scale: [1.1, 0.95, 1.1], rotate: [0, 15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-4 bg-stone-400 rounded-full blur-[90px] opacity-10"
              />

              {/* Easter egg: tocá la foto — gira como una moneda */}
              <motion.button
                type="button"
                onClick={flipCoin}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10 block w-full h-full rounded-full cursor-pointer [perspective:1200px]"
                aria-label={coinFlipped ? "Volver a mostrar la foto" : "Tocá la foto — tiene una sorpresa"}
              >
                <motion.div
                  className="relative w-full h-full [transform-style:preserve-3d]"
                  animate={{ rotateY: coinFlipped ? 180 : 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, ease: EASE }}
                >
                  {/* Cara: foto */}
                  <img
                    src="/images/foto-perfil.jpg"
                    alt="Gianfranco"
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover rounded-full border-4 border-stone-800 shadow-2xl [backface-visibility:hidden]"
                  />

                  {/* Cruz: moneda */}
                  <div
                    className="absolute inset-0 rounded-full border-4 border-stone-800 shadow-2xl flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]"
                    style={{
                      background:
                        "radial-gradient(circle at 32% 28%, #f3f0e8, #cfc9b8 40%, #a9a290 72%, #85806f 100%)",
                    }}
                  >
                    <div className="absolute inset-3 rounded-full border-2 border-stone-950/15" />
                    <div className="absolute inset-6 rounded-full border border-dashed border-stone-950/15" />
                    <div className="relative flex flex-col items-center text-stone-900">
                      <span className="text-[11px] font-semibold tracking-[0.3em] mb-1">GIANFRANCO</span>
                      <span
                        className="text-5xl font-extrabold leading-none"
                        style={{ textShadow: "0 1px 0 rgba(255,255,255,0.5), 0 -1px 0 rgba(0,0,0,0.25)" }}
                      >
                        GC
                      </span>
                      <span className="text-[10px] font-medium tracking-[0.25em] mt-1">FULL STACK DEV</span>
                    </div>
                  </div>
                </motion.div>
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: showCoinHint ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-stone-500 whitespace-nowrap pointer-events-none"
              >
                🪙 tocá la foto
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* Sección Especialidades Técnicas */}
        <motion.div 
          {...sectionFade}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-32 mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Especialidades Técnicas</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-stone-500 to-stone-200 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {specialtyCards.map(({ icon: Icon, title, text }) => (
              <motion.div
                key={title}
                onMouseMove={handleSpotlightMove}
                whileHover={{ y: -6, borderColor: "rgba(255, 255, 255, 0.3)", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.35)" }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="spotlight bg-stone-800/50 p-8 rounded-2xl border border-stone-700/50 transition-colors cursor-default"
              >
                <Icon className="text-4xl text-stone-200 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-stone-400">{text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills Detalladas */}
        <motion.div
          {...sectionFade}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-24 mb-16"
        >
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">Skills & Competencias</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-stone-500 to-stone-200 mx-auto rounded-full"></div>
          </div>

          <div className="max-w-5xl mx-auto space-y-14">
            {/* Skills Técnicas */}
            <div>
              <h3 className="text-xl font-semibold text-stone-200 mb-8 text-center">Skills Técnicas</h3>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {skillCards.map(({ icon: Icon, title, tags }) => (
                  <motion.div
                    key={title}
                    variants={itemVariants}
                    onMouseMove={handleSpotlightMove}
                    whileHover={{ y: -4, borderColor: "rgba(255, 255, 255, 0.3)" }}
                    className="spotlight bg-stone-800/30 p-6 rounded-xl border border-stone-700/30 transition-colors cursor-default"
                  >
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Icon className="text-stone-300" />
                      {title}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((s) => (
                        <motion.span
                          key={s}
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                          className="bg-white/5 text-stone-300 text-xs font-medium px-3 py-1.5 rounded-full border border-white/10 cursor-default"
                        >
                          {s}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Soft Skills */}
            <div>
              <h3 className="text-xl font-semibold text-stone-200 mb-8 text-center">Soft Skills</h3>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {softSkills.map(({ icon: Icon, title, text }) => (
                  <motion.div
                    key={title}
                    variants={itemVariants}
                    onMouseMove={handleSpotlightMove}
                    whileHover={{ y: -5, borderColor: "rgba(255, 255, 255, 0.25)", boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.3)" }}
                    className="spotlight bg-stone-800/30 p-6 rounded-xl border border-stone-700/30 text-center transition-colors cursor-default"
                  >
                    <Icon className="text-3xl text-stone-300 mx-auto mb-4" />
                    <h4 className="text-white font-bold mb-2">{title}</h4>
                    <p className="text-stone-400 text-sm">{text}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

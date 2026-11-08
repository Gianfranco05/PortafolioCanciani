import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaInstagram, FaServer, FaCode, FaDatabase, FaUsers, FaBrain, FaRocket, FaHandshake, FaBook, FaDownload } from 'react-icons/fa';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE, fadeUp, handleSpotlightMove } from '../lib/motion';
import labDemos from '../data/lab';
import PaperSection from "../components/PaperSection";
import useLang from '../i18n/useLang';
import tr from '../i18n/tr';
import useDocumentMeta from '../i18n/useDocumentMeta';

const TEXT = {
  es: {
    metaTitle: "Desarrollador de Software",
    metaDescription: "Gianfranco Canciani, desarrollador backend y docente de programación en Mendoza, Argentina. Proyectos con Python, Java y React y demos para probar en vivo.",
    badge: "Desarrollador de Software · Docente",
    hello: "Hola, soy",
    intro: "Soy desarrollador backend en Mendoza, Argentina. Construyo APIs y aplicaciones web con Python (FastAPI), Java (Spring Boot) y React, y enseño programación en la UTN y en el Instituto Celsius. Me gusta resolver problemas reales con código claro: desde reconocer rostros en vivo hasta detectar ataques en logs con machine learning.",
    exploreProjects: "Explorar Proyectos",
    downloadCv: "Descargar CV",
    coinBack: "Volver a mostrar la foto",
    coinFront: "Tocá la foto — tiene una sorpresa",
    photoAlt: "Gianfranco Canciani",
    coinHint: "🪙 tocá la foto",
    labTitle: "Probá mis proyectos en vivo",
    labText: "No solo capturas: tres de mis proyectos tienen una demo que corre directo en tu navegador, y hay un visualizador de algoritmos.",
    tryDemo: "Probar demo",
    labHow: "Ver cómo funciona cada demo",
    specialties: "Especialidades Técnicas",
    skills: "Skills & Competencias",
    techSkills: "Skills Técnicas",
    softSkills: "Soft Skills",
  },
  en: {
    metaTitle: "Software Developer",
    metaDescription: "Gianfranco Canciani, backend developer and programming teacher in Mendoza, Argentina. Python, Java and React projects with live demos.",
    badge: "Software Developer · Teacher",
    hello: "Hi, I'm",
    intro: "I'm a backend developer based in Mendoza, Argentina. I build APIs and web apps with Python (FastAPI), Java (Spring Boot) and React, and I teach programming at UTN and Instituto Celsius. I enjoy solving real problems with clean code — from recognizing faces live to detecting attacks in logs with machine learning.",
    exploreProjects: "Explore Projects",
    downloadCv: "Download CV",
    coinBack: "Show the photo again",
    coinFront: "Tap the photo — there's a surprise",
    photoAlt: "Gianfranco Canciani",
    coinHint: "🪙 tap the photo",
    labTitle: "Try my projects live",
    labText: "Not just screenshots: three of my projects have a demo that runs right in your browser, plus an algorithm visualizer.",
    tryDemo: "Try demo",
    labHow: "See how each demo works",
    specialties: "Technical Expertise",
    skills: "Skills",
    techSkills: "Technical Skills",
    softSkills: "Soft Skills",
  },
};

const specialtyCards = [
  {
    id: "fullstack",
    icon: FaCode,
    title: { es: "Desarrollo Fullstack", en: "Fullstack Development" },
    text: {
      es: "Aplicaciones web con React y TypeScript en el frontend, y APIs con Python (FastAPI) y Java (Spring Boot) en el backend. Defino qué tiene que hacer cada parte antes de escribir código, para que el proyecto crezca ordenado.",
      en: "Web apps with React and TypeScript on the frontend and APIs with Python (FastAPI) and Java (Spring Boot) on the backend. I define what each part must do before writing code, so the project grows in an orderly way.",
    },
  },
  {
    id: "data-devops",
    icon: FaDatabase,
    title: { es: "Bases de Datos & DevOps", en: "Databases & DevOps" },
    text: {
      es: "Modelado y administración de bases de datos relacionales con MySQL y PostgreSQL. Control de versiones con Git y despliegues containerizados con Docker.",
      en: "Relational database modeling and administration with MySQL and PostgreSQL. Version control with Git and containerized deployments with Docker.",
    },
  },
  {
    id: "automation",
    icon: FaServer,
    title: { es: "Automatización & Sistemas", en: "Automation & Systems" },
    text: {
      es: "Automatización de flujos de trabajo con n8n, sistemas de monitoreo SIEM, y scripting en Python para tareas de integración y análisis de datos.",
      en: "Workflow automation with n8n, SIEM monitoring systems, and Python scripting for integration and data analysis tasks.",
    },
  },
];

const skillCards = [
  { id: "languages", icon: FaCode, title: { es: "Lenguajes", en: "Languages" }, tags: ["Python", "Java", "TypeScript", "JavaScript"] },
  { id: "backend", icon: FaServer, title: "Backend", tags: ["FastAPI", "Spring Boot", "JPA / Hibernate"] },
  { id: "frontend", icon: FaCode, title: "Frontend", tags: ["React", "Tailwind CSS", "HTML/CSS"] },
  { id: "databases", icon: FaDatabase, title: { es: "Bases de Datos", en: "Databases" }, tags: ["MySQL", "PostgreSQL", "Elasticsearch"] },
  { id: "tools", icon: FaRocket, title: { es: "Herramientas & DevOps", en: "Tools & DevOps" }, tags: ["Docker", "Git", "n8n", "Grafana"] },
  { id: "methods", icon: FaBook, title: { es: "Metodologías", en: "Methodologies" }, tags: ["Spec-Driven Development", { es: "Ágil / Scrum", en: "Agile / Scrum" }] },
];

const softSkills = [
  {
    id: "teamwork",
    icon: FaUsers,
    title: { es: "Trabajo en Equipo", en: "Teamwork" },
    text: {
      es: "Colaboración fluida en equipos multidisciplinarios, aportando y aprendiendo de cada miembro.",
      en: "Smooth collaboration in cross-functional teams, contributing to and learning from every member.",
    },
  },
  {
    id: "problem-solving",
    icon: FaBrain,
    title: { es: "Resolución de Problemas", en: "Problem Solving" },
    text: {
      es: "Enfoque analítico para descomponer problemas complejos en soluciones simples y efectivas.",
      en: "An analytical approach to breaking complex problems down into simple, effective solutions.",
    },
  },
  {
    id: "learning",
    icon: FaRocket,
    title: { es: "Aprendizaje Continuo", en: "Continuous Learning" },
    text: {
      es: "Actualización constante en nuevas tecnologías y metodologías para estar siempre a la vanguardia.",
      en: "Always keeping up with new technologies and methodologies.",
    },
  },
  {
    id: "communication",
    icon: FaHandshake,
    title: { es: "Comunicación Efectiva", en: "Clear Communication" },
    text: {
      es: "Como docente, explico conceptos técnicos de forma clara y adaptada a quien escucha: estudiantes, colegas o stakeholders.",
      en: "As a teacher, I explain technical concepts clearly and adapt them to the audience: students, colleagues or stakeholders.",
    },
  },
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
  const { lang } = useLang();
  const t = TEXT[lang];
  useDocumentMeta({ title: t.metaTitle, description: t.metaDescription, home: true });
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
              {t.badge}
            </motion.span>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              {t.hello} <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-300 via-stone-100 to-white">Gianfranco</span>
            </h1>
            <p className="text-lg lg:text-xl text-stone-400 mb-10 leading-relaxed">
              {t.intro}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-5 mb-12">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/projects"
                  className="btn-shine group inline-flex items-center justify-center gap-3 bg-stone-100 hover:bg-white text-stone-950 px-8 py-4 rounded-lg text-lg font-medium transition-all shadow-lg shadow-black/30 hover:shadow-black/40"
                >
                  {t.exploreProjects}
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
                  {t.downloadCv}
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
                aria-label={coinFlipped ? t.coinBack : t.coinFront}
              >
                <motion.div
                  className="relative w-full h-full [transform-style:preserve-3d]"
                  animate={{ rotateY: coinFlipped ? 180 : 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, ease: EASE }}
                >
                  {/* Cara: foto */}
                  <img
                    src="/images/foto-perfil.jpg"
                    alt={t.photoAlt}
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
                {t.coinHint}
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* Lab: demos en vivo */}
        <motion.div
          {...sectionFade}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-32 max-w-5xl mx-auto"
        >
          <div className="text-center mb-10">
            <span className="inline-block py-1 px-3 rounded-full bg-white/5 text-stone-300 text-xs font-semibold tracking-wider uppercase mb-4 border border-white/15">
              Lab
            </span>
            <h2 className="text-3xl font-bold text-white mb-4">{t.labTitle}</h2>
            <p className="text-stone-400 max-w-2xl mx-auto">
              {t.labText}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {labDemos
              .filter((d) => d.status === "available")
              .map((demo) => (
                <Link
                  key={demo.id}
                  to={demo.path}
                  onMouseMove={handleSpotlightMove}
                  className="spotlight group flex flex-col bg-stone-800/50 hover:bg-stone-800 p-6 rounded-2xl border border-stone-700/50 hover:border-stone-500 transition-colors"
                >
                  <p className="text-[11px] font-semibold tracking-wider uppercase text-stone-500 mb-2">{tr(demo.tagline, lang)}</p>
                  <h3 className="text-xl font-bold text-white mb-4">{tr(demo.name, lang)}</h3>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-stone-300 group-hover:text-white transition-colors">
                    {t.tryDemo}
                    <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/lab" className="text-sm text-stone-400 hover:text-white underline underline-offset-4 transition-colors">
              {t.labHow}
            </Link>
          </div>
        </motion.div>

        <PaperSection />

        {/* Sección Especialidades Técnicas */}
        <motion.div
          {...sectionFade}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-32 mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">{t.specialties}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-stone-500 to-stone-200 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {specialtyCards.map(({ id, icon: Icon, title, text }) => (
              <motion.div
                key={id}
                onMouseMove={handleSpotlightMove}
                whileHover={{ y: -6, borderColor: "rgba(255, 255, 255, 0.3)", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.35)" }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="spotlight bg-stone-800/50 p-8 rounded-2xl border border-stone-700/50 transition-colors cursor-default"
              >
                <Icon className="text-4xl text-stone-200 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">{tr(title, lang)}</h3>
                <p className="text-stone-400">{tr(text, lang)}</p>
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
            <h2 className="text-3xl font-bold text-white mb-4">{t.skills}</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-stone-500 to-stone-200 mx-auto rounded-full"></div>
          </div>

          <div className="max-w-5xl mx-auto space-y-14">
            {/* Skills Técnicas */}
            <div>
              <h3 className="text-xl font-semibold text-stone-200 mb-8 text-center">{t.techSkills}</h3>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {skillCards.map(({ id, icon: Icon, title, tags }) => (
                  <motion.div
                    key={id}
                    variants={itemVariants}
                    onMouseMove={handleSpotlightMove}
                    whileHover={{ y: -4, borderColor: "rgba(255, 255, 255, 0.3)" }}
                    className="spotlight bg-stone-800/30 p-6 rounded-xl border border-stone-700/30 transition-colors cursor-default"
                  >
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Icon className="text-stone-300" />
                      {tr(title, lang)}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((s) => (
                        <motion.span
                          key={tr(s, "es")}
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                          className="bg-white/5 text-stone-300 text-xs font-medium px-3 py-1.5 rounded-full border border-white/10 cursor-default"
                        >
                          {tr(s, lang)}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Soft Skills */}
            <div>
              <h3 className="text-xl font-semibold text-stone-200 mb-8 text-center">{t.softSkills}</h3>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {softSkills.map(({ id, icon: Icon, title, text }) => (
                  <motion.div
                    key={id}
                    variants={itemVariants}
                    onMouseMove={handleSpotlightMove}
                    whileHover={{ y: -5, borderColor: "rgba(255, 255, 255, 0.25)", boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.3)" }}
                    className="spotlight bg-stone-800/30 p-6 rounded-xl border border-stone-700/30 text-center transition-colors cursor-default"
                  >
                    <Icon className="text-3xl text-stone-300 mx-auto mb-4" />
                    <h4 className="text-white font-bold mb-2">{tr(title, lang)}</h4>
                    <p className="text-stone-400 text-sm">{tr(text, lang)}</p>
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

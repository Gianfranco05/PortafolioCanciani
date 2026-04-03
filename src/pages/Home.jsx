import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaServer, FaCode, FaDatabase } from 'react-icons/fa';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 pt-28 pb-12 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Sección Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-900/50 text-indigo-300 text-sm font-semibold tracking-wider mb-6 border border-indigo-700/50">
              Desarrollador & Docente IT
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Hola, soy <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Gianfranco</span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-400 mb-10 leading-relaxed">
              Radicado en Mendoza, Argentina. Me especializo en el desarrollo de software robusto usando Java, Python y arquitecturas web modernas. Combino la creación de sistemas complejos con la vocación de enseñar y formar a futuros programadores.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-5 mb-12">
              <Link
                to="/projects"
                className="group inline-flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all shadow-lg shadow-indigo-900/20"
              >
                Explorar Proyectos
                <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex justify-center gap-4 items-center">
                <a href="https://github.com/tu-usuario" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all">
                  <FaGithub size={24} />
                </a>
                <a href="https://linkedin.com/in/tu-usuario" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all">
                  <FaLinkedin size={24} />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center items-center"
          >
            <div className="relative w-80 h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
              <img 
                src="https://via.placeholder.com/400x400.png?text=Foto+Profesional" 
                alt="Gianfranco" 
                className="relative z-10 rounded-full w-full h-full object-cover border-4 border-slate-800 shadow-2xl" 
              />
            </div>
          </motion.div>
        </div>

        {/* Sección de Habilidades */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-32 mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Especialidades Técnicas</h2>
            <div className="w-20 h-1 bg-indigo-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 transition-colors">
              <FaCode className="text-4xl text-indigo-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Desarrollo Backend</h3>
              <p className="text-slate-400">Creación de APIs RESTful y lógica de negocios utilizando FastAPI, Python y Java. Enfoque en código limpio y escalable.</p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 transition-colors">
              <FaDatabase className="text-4xl text-indigo-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Bases de Datos & Arquitectura</h3>
              <p className="text-slate-400">Diseño relacional (N:N), manejo de PostgreSQL, H2 y motores de búsqueda y analítica como Elasticsearch.</p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 transition-colors">
              <FaServer className="text-4xl text-indigo-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Sistemas & Automatización</h3>
              <p className="text-slate-400">Implementación de sistemas de monitoreo (SIEM), visualización de datos con Grafana y flujos de trabajo con n8n.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
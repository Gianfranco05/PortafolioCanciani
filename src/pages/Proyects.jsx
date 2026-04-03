import { FaGithub } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import { motion } from 'framer-motion';

const projects = [
  {
    name: "Sistema SIEM Automatizado",
    description: "Arquitectura de gestión de eventos de seguridad integrada con n8n, Elasticsearch, PostgreSQL y dashboards en Grafana para el análisis en tiempo real.",
    tech: ["Python", "n8n", "Elasticsearch", "Grafana", "PostgreSQL"],
    image: "https://via.placeholder.com/600x400/1e293b/cbd5e1.png?text=SIEM+Dashboard",
    repoUrl: "https://github.com/tu-usuario/siem-project",
    liveUrl: "",
  },
  {
    name: "API RESTful con FastAPI",
    description: "Backend de alto rendimiento desarrollado en Python. Incluye validación de datos, autenticación y documentación automática.",
    tech: ["FastAPI", "Python", "Uvicorn", "Pydantic"],
    image: "https://via.placeholder.com/600x400/1e293b/cbd5e1.png?text=FastAPI+Backend",
    repoUrl: "https://github.com/tu-usuario/fastapi-backend",
    liveUrl: "https://tu-api.com/docs",
  },
  {
    name: "Gestor CRUD Persistente",
    description: "Sistema de gestión académico y administrativo con interfaz de consola, persistencia de datos en H2 y arquitectura MVC desarrollada en NetBeans.",
    tech: ["Java", "JDBC", "H2 Database", "NetBeans"],
    image: "https://via.placeholder.com/600x400/1e293b/cbd5e1.png?text=Java+CRUD",
    repoUrl: "https://github.com/tu-usuario/java-crud",
    liveUrl: "",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Projects() {
  return (
    <section className="min-h-screen bg-slate-900 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Proyectos Destacados
          </h2>
          <div className="w-24 h-1 bg-indigo-500 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Una selección de mis trabajos recientes enfocados en automatización, APIs y desarrollo backend.
          </p>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((proj, idx) => (
            <motion.div
              variants={itemVariants}
              key={idx}
              className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/50 flex flex-col group hover:border-indigo-500/50 transition-colors"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={proj.image} 
                  alt={`Captura de ${proj.name}`} 
                  className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              
              <div className="p-8 flex flex-col grow">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">{proj.name}</h3>
                <p className="text-slate-400 mb-6 grow leading-relaxed">{proj.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {proj.tech.map((t, i) => (
                    <span 
                      key={i} 
                      className="bg-slate-900/50 border border-slate-600 text-slate-300 text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-4 mt-auto">
                  <a
                    href={proj.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    <FaGithub /> Código
                  </a>
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-900/20"
                    >
                      <FiExternalLink /> Ver Demo
                    </a>
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
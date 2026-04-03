import { FaGithub, FaLinkedin, FaMapMarkerAlt } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <section className="min-h-screen flex items-center bg-slate-900 pt-28 pb-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Ponte en Contacto
          </h2>
          <div className="w-24 h-1 bg-indigo-500 mx-auto rounded-full"></div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 bg-slate-800/50 rounded-3xl p-8 md:p-12 border border-slate-700/50 shadow-2xl">
          
          {/* Información */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">Hablemos</h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                ¿Tienes un proyecto en mente, una propuesta docente o simplemente quieres conectar? Estaré encantado de leerte.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-5 text-slate-300">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                  <MdOutlineEmail size={22} className="text-indigo-400" />
                </div>
                <a href="mailto:tu-email@gmail.com" className="hover:text-indigo-400 transition-colors font-medium">tu-email@gmail.com</a>
              </div>
              
              <div className="flex items-center gap-5 text-slate-300">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                  <FaMapMarkerAlt size={20} className="text-indigo-400" />
                </div>
                <span className="font-medium">Mendoza, Argentina</span>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-700/50">
              <p className="text-sm text-slate-400 mb-4 font-semibold uppercase tracking-wider">Redes Sociales</p>
              <div className="flex gap-4">
                <a href="https://github.com/tu-usuario" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:text-white transition-all">
                  <FaGithub size={20} />
                </a>
                <a href="https://linkedin.com/in/tu-usuario" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:text-white transition-all">
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>
          </motion.div>
          
          {/* Formulario */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <form action="https://formspree.io/f/TU_ID_DE_FORMSPREE" method="POST" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-slate-300">Nombre Completo</label>
                  <input type="text" id="name" name="name" required
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-slate-300">Correo Electrónico</label>
                  <input type="email" id="email" name="email" required
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    placeholder="juan@ejemplo.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-slate-300">Mensaje</label>
                <textarea id="message" name="message" rows="6" required
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
                  placeholder="Cuéntame sobre tu proyecto..."
                ></textarea>
              </div>
              
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1 shadow-lg shadow-indigo-900/30">
                Enviar Mensaje
              </button>
            </form>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
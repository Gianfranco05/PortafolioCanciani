import { useRef, useState } from 'react';
import { FaGithub, FaLinkedin, FaMapMarkerAlt, FaWhatsapp, FaInstagram, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE, handleSpotlightMove } from '../lib/motion';
import { WOLOLO_EVENT } from '../components/WololoEgg';

const FORM_URL = 'https://formspree.io/f/xeedoklk';

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const infoItems = [
  { icon: MdOutlineEmail, iconColor: "text-stone-300", label: "gianfrancocanciani@gmail.com", href: "mailto:gianfrancocanciani@gmail.com", hoverColor: "hover:text-white" },
  { icon: FaMapMarkerAlt, iconColor: "text-stone-300", label: "Mendoza, Argentina", href: null, hoverColor: "" },
  { icon: FaWhatsapp, iconColor: "text-green-400", label: "+54 9 261 681 1044", href: "https://wa.me/5492616811044", hoverColor: "hover:text-green-400", bgClass: "bg-green-900/50", borderClass: "border-green-700/50" },
];

const socialLinks = [
  { href: "https://github.com/Gianfranco05", icon: FaGithub, hoverClass: "hover:bg-stone-700 hover:text-white", label: "GitHub" },
  { href: "https://www.linkedin.com/in/gianfranco-canciani-6a5189255", icon: FaLinkedin, hoverClass: "hover:bg-stone-700 hover:text-white", label: "LinkedIn" },
  { href: "https://instagram.com/gianfranco.c05", icon: FaInstagram, hoverClass: "hover:bg-pink-600 hover:text-white", label: "Instagram" },
];

export default function Contact() {
  const shouldReduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [errores, setErrores] = useState({});

  // Easter egg: si escribís "Jack Ross" en el nombre... 🚢
  const [jackEgg, setJackEgg] = useState(false);
  // Easter egg: escribir "wololo" en el mensaje también vale (para mobile, sin teclado físico)
  const wololoSentRef = useRef(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }));
    }
    if (name === 'name') {
      if (value.trim().toLowerCase() === 'jack ross') {
        setJackEgg(true);
        setTimeout(() => setJackEgg(false), 5000);
      } else {
        setJackEgg(false);
      }
    }
    if (name === 'message') {
      const hasWololo = value.toLowerCase().includes('wololo');
      if (hasWololo && !wololoSentRef.current) {
        wololoSentRef.current = true;
        window.dispatchEvent(new Event(WOLOLO_EVENT));
      } else if (!hasWololo) {
        wololoSentRef.current = false;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevosErrores = {};
    if (!formData.name.trim()) nuevosErrores.name = 'El nombre es obligatorio';
    if (!formData.email.trim()) nuevosErrores.email = 'El email es obligatorio';
    else if (!validarEmail(formData.email)) nuevosErrores.email = 'Email no válido';
    if (!formData.message.trim()) nuevosErrores.message = 'El mensaje no puede estar vacío';

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});
    setStatus('loading');

    try {
      const res = await fetch(FORM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const titleAnim = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  const infoStagger = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    show: {
      opacity: 1,
      transition: shouldReduceMotion ? {} : { staggerChildren: 0.12 }
    }
  };

  const infoItemAnim = {
    hidden: shouldReduceMotion ? {} : { opacity: 0, x: -30 },
    show: shouldReduceMotion ? {} : { opacity: 1, x: 0 }
  };

  const formAnim = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 } };

  return (
    <section id="main-content" className="min-h-screen flex items-center bg-stone-900 pt-28 pb-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          {...titleAnim}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Ponte en Contacto
          </h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-stone-500 to-stone-200 mx-auto rounded-full"
          />
        </motion.div>
        
        <div
          onMouseMove={handleSpotlightMove}
          className="spotlight grid grid-cols-1 lg:grid-cols-5 gap-12 bg-stone-800/50 rounded-3xl p-8 md:p-12 border border-stone-700/50 shadow-2xl"
        >
          
          {/* Información */}
          <motion.div 
            variants={infoStagger}
            initial="hidden"
            animate="show"
            className="lg:col-span-2 space-y-8"
          >
            <motion.div variants={infoItemAnim}>
              <h3 className="text-3xl font-bold text-white mb-4">Hablemos</h3>
              <p className="text-stone-400 text-lg leading-relaxed">
                ¿Tienes un proyecto en mente, una propuesta docente o simplemente quieres conectar? Estaré encantado de leerte.
              </p>
            </motion.div>
            
            <div className="space-y-6">
              {infoItems.map(({ icon: Icon, iconColor, label, href, hoverColor, bgClass, borderClass }, idx) => (
                <motion.div
                  key={label}
                  variants={infoItemAnim}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-5 text-stone-300"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border ${bgClass || "bg-stone-800"} ${borderClass || "border-stone-700"}`}
                  >
                    <Icon size={idx === 0 ? 22 : 20} className={iconColor} />
                  </motion.div>
                  {href ? (
                    <a href={href} target={href.startsWith('http') ? "_blank" : undefined} rel="noopener noreferrer" className={`${hoverColor} transition-colors font-medium`}>
                      {label}
                    </a>
                  ) : (
                    <span className="font-medium">{label}</span>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div variants={infoItemAnim} className="pt-8 border-t border-stone-700/50">
              <p className="text-sm text-stone-400 mb-4 font-semibold uppercase tracking-wider">Redes Sociales</p>
              <div className="flex gap-4">
                {socialLinks.map(({ href, icon: Icon, hoverClass, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center text-stone-300 transition-all ${hoverClass}`}
                    aria-label={label}
                  >
                    <Icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
          
          {/* Formulario */}
          <motion.div
            {...formAnim}
            transition={{ duration: 0.7, delay: shouldReduceMotion ? 0 : 0.3, ease: EASE }}
            className="lg:col-span-3"
          >
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col items-center justify-center h-full py-16 text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <FaCheckCircle className="text-green-400 text-6xl mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">¡Mensaje enviado!</h3>
                <p className="text-stone-400 text-lg">Gracias por escribirme, te respondo a la brevedad.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-semibold text-stone-300">Nombre Completo</label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="text" id="name" name="name"
                      value={formData.name} onChange={handleChange}
                      className={`w-full px-4 py-3 bg-stone-900 border rounded-xl text-white focus:outline-none focus:ring-1 transition-colors placeholder:text-stone-600 ${
                        errores.name
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-stone-700 focus:border-stone-400 focus:ring-stone-400'
                      }`}
                      placeholder="Ej. Jack Ross"
                    />
                    {errores.name && <p className="text-red-400 text-sm mt-1">{errores.name}</p>}
                    <AnimatePresence>
                      {jackEgg && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-stone-400 text-xs italic mt-1"
                        >
                          🚢 Jack... había lugar para los dos en la puerta.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-stone-300">Correo Electrónico</label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="email" id="email" name="email"
                      value={formData.email} onChange={handleChange}
                      className={`w-full px-4 py-3 bg-stone-900 border rounded-xl text-white focus:outline-none focus:ring-1 transition-colors placeholder:text-stone-600 ${
                        errores.email
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-stone-700 focus:border-stone-400 focus:ring-stone-400'
                      }`}
                      placeholder="jack.ross@ejemplo.com"
                    />
                    {errores.email && <p className="text-red-400 text-sm mt-1">{errores.email}</p>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-semibold text-stone-300">Mensaje</label>
                  <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    id="message" name="message" rows="6"
                    value={formData.message} onChange={handleChange}
                    className={`w-full px-4 py-3 bg-stone-900 border rounded-xl text-white focus:outline-none focus:ring-1 transition-colors resize-none placeholder:text-stone-600 ${
                      errores.message
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-stone-700 focus:border-stone-400 focus:ring-stone-400'
                    }`}
                    placeholder="Cuéntame sobre tu proyecto..."
                  ></motion.textarea>
                  {errores.message && <p className="text-red-400 text-sm mt-1">{errores.message}</p>}
                </div>
                
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-xl"
                  >
                    <FaExclamationCircle className="shrink-0" />
                    <p className="text-sm">Hubo un error al enviar el mensaje. Podés escribirme directo por <a href="https://wa.me/5492616811044" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">WhatsApp</a>.</p>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={status === 'loading'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-shine w-full bg-stone-100 hover:bg-white disabled:bg-stone-400 disabled:cursor-not-allowed text-stone-950 px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-black/30"
                >
                  {status === 'loading' ? (
                    <span className="inline-flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        className="inline-block w-4 h-4 border-2 border-stone-950/30 border-t-stone-950 rounded-full"
                      />
                      Enviando...
                    </span>
                  ) : 'Enviar Mensaje'}
                </motion.button>
              </form>
            )}

            {status !== 'success' && (
              <div className="mt-6 text-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-700/50"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-stone-800 text-stone-400 font-medium">o</span>
                  </div>
                </div>
                <motion.a
                  href="https://wa.me/5492616811044"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-shine w-full inline-flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-green-900/30"
                >
                  <FaWhatsapp size={22} />
                  Escríbeme por WhatsApp
                </motion.a>
              </div>
            )}
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}

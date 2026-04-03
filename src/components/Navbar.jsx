import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Detectar scroll para cambiar el estilo del navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-slate-900/80 backdrop-blur-md shadow-lg py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tight text-white hover:text-indigo-400 transition-colors">
          GF<span className="text-indigo-500">.</span>
        </Link>
        <div className="flex gap-8">
          {[
            { path: "/", label: "Inicio" },
            { path: "/projects", label: "Proyectos" },
            { path: "/contact", label: "Contacto" }
          ].map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`text-sm font-medium tracking-wide transition-colors ${
                isActive(item.path) 
                  ? "text-indigo-400 border-b-2 border-indigo-400 pb-1" 
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
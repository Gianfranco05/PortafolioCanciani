import { Component } from "react";
import { FaExclamationTriangle, FaRedo } from "react-icons/fa";

const TEXT = {
  es: {
    title: "Algo salió mal",
    text: "Ocurrió un error inesperado al renderizar esta sección. Ya lo registramos para revisarlo.",
    reload: "Recargar página",
  },
  en: {
    title: "Something went wrong",
    text: "An unexpected error occurred while rendering this section. We've logged it for review.",
    reload: "Reload page",
  },
};

// Un class component no puede usar hooks: se lee el idioma desde <html lang>, que mantiene LanguageProvider.
const currentLang = () => (document.documentElement.lang === "en" ? "en" : "es");

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error capturado por ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const t = TEXT[currentLang()];
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6">
          <FaExclamationTriangle className="text-5xl text-amber-400 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-3">
            {t.title}
          </h2>
          <p className="text-stone-400 max-w-md mb-8 leading-relaxed">
            {t.text}
          </p>
          <button
            onClick={this.handleReload}
            className="inline-flex items-center gap-3 bg-stone-100 hover:bg-white text-stone-950 px-8 py-3 rounded-xl font-medium transition-all"
          >
            <FaRedo />
            {t.reload}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

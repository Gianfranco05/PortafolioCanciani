import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import PageTransition from "./components/PageTransition";
import ErrorBoundary from "./components/ErrorBoundary";
import Loading from "./components/Loading";
import KonamiEgg from "./components/KonamiEgg";
import WololoEgg from "./components/WololoEgg";
import useScrollToTop from "./components/useScrollToTop";
import { printConsoleEgg } from "./lib/consoleEgg";

const Home = lazy(() => import("./pages/Home"));
const Projects = lazy(() => import("./pages/Projects"));
const Experience = lazy(() => import("./pages/Experience"));
const Lab = lazy(() => import("./pages/Lab"));
const FaceTrackDemo = lazy(() => import("./pages/lab/FaceTrackDemo"));
const SyncTuneDemo = lazy(() => import("./pages/lab/SyncTuneDemo"));
const SiemDemo = lazy(() => import("./pages/lab/SiemDemo"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

function AppContent() {
  const location = useLocation();
  useScrollToTop();

  useEffect(() => {
    printConsoleEgg();
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      <ScrollProgress />
      <KonamiEgg />
      <WololoEgg />
      <Navbar />
      <ErrorBoundary>
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Suspense fallback={<Loading />}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/experience" element={<Experience />} />
                <Route path="/lab" element={<Lab />} />
                <Route path="/lab/facetrack" element={<FaceTrackDemo />} />
                <Route path="/lab/synctune" element={<SyncTuneDemo />} />
                <Route path="/lab/siem" element={<SiemDemo />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </PageTransition>
        </AnimatePresence>
      </ErrorBoundary>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

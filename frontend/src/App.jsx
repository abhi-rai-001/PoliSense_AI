import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lenis from 'lenis';
import LandingPage from "./pages/LandingPage";
import UploadPage from "./pages/UploadPage";
import ChatPage from "./pages/ChatPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 0.5,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<><Navbar/> <LandingPage /> <Footer/> </>} />
        <Route path="/upload" element={<><Navbar/> <UploadPage /> <Footer/> </>} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

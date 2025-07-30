import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Lenis from 'lenis';
import LandingPage from "./pages/LandingPage";
import UploadPage from "./pages/UploadPage";
import ChatPage from "./pages/ChatPage";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import ProtectedRoute from "./components/ProtectedRoute";
import { SSOCallback } from "@clerk/clerk-react";


function App() {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<><Navbar/> <LandingPage /> <Footer/> </>} />
        <Route 
          path="/upload" 
          element={
            <ProtectedRoute>
              <Navbar/> 
              <UploadPage /> 
              <Footer/> 
            </ProtectedRoute>
          } 
        />

        <Route path="/about" element={<><Navbar/> <AboutPage />  </>} />
        <Route path="/contact" element={<><Navbar/> <ContactPage /> <Footer/> </>} />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/sign-in/sso-callback" element={<SSOCallback />} />
        <Route path="/sign-in/*" element={<SignedOut><SignInPage /></SignedOut>} />
        <Route path="/sign-up/*" element={<SignedOut><SignUpPage /></SignedOut>} />
        <Route path="/login" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

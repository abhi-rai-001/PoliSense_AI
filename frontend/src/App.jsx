import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UploadPage from "./pages/UploadPage";
import ChatPage from "./pages/ChatPage";
import Navbar from "./components/Navbar";




export default function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<><Navbar/> <LandingPage /> </>} />
        <Route path="/upload" element={<><Navbar/> <UploadPage /> </>} />
        <Route path="/chat" element={<ChatPage />} />

      </Routes>
    </Router>
  );
}

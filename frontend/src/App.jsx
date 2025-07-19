import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UploadPage from "./pages/UploadPage";


export default function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<UploadPage />} />
        
      </Routes>
    </Router>
  );
}

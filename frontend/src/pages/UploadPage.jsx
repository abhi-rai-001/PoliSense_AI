/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence  } from 'framer-motion'; 
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import GradientText from "../animations/GradientText";
import { FileUp, Mail, FileText, FileBadge } from "lucide-react";

export default function UploadPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [emailText, setEmailText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [inputMode, setInputMode] = useState("file");

  const maxSizeMB = 10;

  const handleEmailTextChange = (e) => {
    setEmailText(e.target.value);
    if (e.target.value.trim()) {
      setFile(null);
    }
  };

  const handleFileInput = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Clear previous documents when new file is selected
    const clearPreviousDocuments = async () => {
      if (!user?.id) return;
      
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/user/clear-documents`, {
          data: { userId: user.id } // Use actual user ID
        });
      } catch (error) {
        console.error('Failed to clear previous documents:', error);
      }
    };

    clearPreviousDocuments();
    setFile(selectedFile);
    setEmailText("");
    console.log("File selected:", selectedFile.name);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const event = { target: { files: [droppedFile] } };
      handleFileInput(event);
    }
  };

  const handleUpload = async () => {
    if (!file && !emailText.trim()) {
      toast.error("Please select a file or enter email text.");
      return;
    }

    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    console.log("DEBUG: Uploading with user ID:", user.id); // Add this debug line

    setUploading(true);
    toast.loading("Uploading...");

    try {
      const formData = new FormData();
      
      if (file) {
        formData.append("file", file);
      } else {
        const emailBlob = new Blob([emailText], { type: 'text/plain' });
        const emailFile = new File([emailBlob], 'email.txt', { type: 'text/plain' });
        formData.append("file", emailFile);
        formData.append("isEmailText", "true");
      }
      
      formData.append("userId", user.id); // Make sure this line exists and uses user.id
      
      console.log("DEBUG: FormData userId:", formData.get("userId")); // Add this debug line
      
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      toast.dismiss();
      toast.success("Content uploaded successfully");
      setFile(null);
      setEmailText("");
      
      setTimeout(() => {
        navigate('/chat');
      }, 1500);
      
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] relative overflow-hidden flex flex-col text-white">
      {/* Aurora Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[600px] bg-gradient-to-br from-cyan-500/10 via-violet-500/10 to-transparent blur-[120px] pointer-events-none z-0"></div>

      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(22, 22, 31, 0.9)',
            backdropFilter: 'blur(10px)',
            color: '#f0f0f5',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            iconTheme: { primary: '#34d399', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#f43f5e', secondary: '#fff' },
          },
        }}
      />
      
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-16 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg sm:max-w-xl md:max-w-3xl"
        >
          <div className="text-center mb-10">
            <GradientText
              className="text-4xl md:text-5xl lg:text-6xl mx-auto font-bold mb-4 font-['Clash_Grotesk'] tracking-tight"
            >
              Document Intelligence
            </GradientText>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">
              Upload PDF, DOCX, or Email files for AI-powered analysis
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-8 justify-center">
            <button
              onClick={() => setInputMode("file")}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-all duration-300 font-medium ${
                inputMode === "file" 
                  ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 scale-105" 
                  : "glass-panel text-gray-400 hover:text-white"
              }`}
            >
              <FileUp className="w-4 h-4" />
              Upload File
            </button>
            <button
              onClick={() => setInputMode("text")}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-all duration-300 font-medium ${
                inputMode === "text" 
                  ? "bg-violet-500/10 border border-violet-500/30 text-violet-400 scale-105" 
                  : "glass-panel text-gray-400 hover:text-white"
              }`}
            >
              <Mail className="w-4 h-4" />
              Paste Email
            </button>
          </div>

          {/* Animated Upload/Paste Area */}
          <AnimatePresence mode="wait">
            {inputMode === "file" ? (
              <motion.div
                key="file-upload"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="relative glass-panel rounded-3xl p-8 sm:p-12 text-center group cursor-pointer overflow-hidden border-dashed border-2 border-white/20 hover:border-cyan-500/50 hover:bg-white/[0.04] transition-all"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById("fileInput").click()}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <motion.div 
                  className="flex justify-center mb-6 text-cyan-400"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FileUp className="w-16 h-16" />
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 font-['Clash_Grotesk'] tracking-wide">
                  Drop your file here or click to browse
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Supports PDF, DOCX, and EML files up to {maxSizeMB}MB
                </p>

                {file && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-left mx-auto max-w-sm p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between"
                  >
                    <div className="truncate flex-1 pr-4">
                      <p className="text-sm font-medium text-emerald-400 truncate">{file.name}</p>
                      <p className="text-xs text-emerald-500/70">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <span className="text-emerald-400 text-xs">✓</span>
                    </div>
                  </motion.div>
                )}

                <input
                  id="fileInput"
                  type="file"
                  accept="application/pdf,.docx,.eml"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </motion.div>
            ) : (
              <motion.div
                key="email-paste"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="glass-panel rounded-3xl p-6 sm:p-8"
              >
                <div className="flex justify-center mb-6 text-violet-400">
                  <Mail className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 text-center font-['Clash_Grotesk'] tracking-wide">
                  Paste Your Email Content
                </h3>
                <textarea
                  value={emailText}
                  onChange={handleEmailTextChange}
                  placeholder="Paste email headers and content here..."
                  className="w-full h-40 sm:h-48 p-4 bg-black/40 border border-white/10 text-gray-300 rounded-xl resize-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all text-sm"
                />
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Include headers (From, To, Subject) and email body for best results
                </p>
                
                {emailText.trim() && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center"
                  >
                    <p className="text-sm text-emerald-400">
                      ✅ Content ready ({emailText.length} chars)
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="relative group overflow-hidden rounded-full p-[1px] w-full sm:w-auto disabled:opacity-50"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500 rounded-full opacity-100 group-hover:opacity-80 transition-opacity animate-gradient"></span>
              <div className="relative bg-black px-8 py-3 rounded-full transition-all group-hover:bg-transparent flex justify-center items-center h-full">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : "Analyze Document"}
                </span>
              </div>
            </button>
            <button
              onClick={() => {
                setFile(null);
                setEmailText("");
              }}
              className="px-8 py-3 rounded-full text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all w-full sm:w-auto text-center"
            >
              Clear
            </button>
          </motion.div>

          {/* Info Grid */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-6 glass-panel rounded-2xl">
              <div className="flex justify-center text-cyan-400 mb-3"><FileText className="w-8 h-8" /></div>
              <h4 className="font-semibold text-white font-['Clash_Grotesk']">PDF Files</h4>
              <p className="text-xs text-gray-400 mt-1">Contracts & reports</p>
            </div>
            <div className="text-center p-6 glass-panel rounded-2xl">
              <div className="flex justify-center text-violet-400 mb-3"><FileBadge className="w-8 h-8" /></div>
              <h4 className="font-semibold text-white font-['Clash_Grotesk']">DOCX Files</h4>
              <p className="text-xs text-gray-400 mt-1">Proposals & essays</p>
            </div>
            <div className="text-center p-6 glass-panel rounded-2xl">
              <div className="flex justify-center text-emerald-400 mb-3"><Mail className="w-8 h-8" /></div>
              <h4 className="font-semibold text-white font-['Clash_Grotesk']">Email Files</h4>
              <p className="text-xs text-gray-400 mt-1">EML formats</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

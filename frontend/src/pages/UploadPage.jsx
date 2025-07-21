import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import GradientText from "../animations/GradientText";

export default function UploadPage() {
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

    const maxSizeMB = 10;
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

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
      
      await axios.post("http://localhost:3000/user/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      toast.dismiss();
      toast.success("✅ Content uploaded successfully!");
      setFile(null);
      setEmailText("");
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Toaster position="top-right" />
      
      <main className="flex-1 flex items-center justify-center px-8 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          <div className="text-center mb-8">
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={8}
              showBorder={false}
              className="text-3xl md:text-4xl mx-auto font-bold mb-4"
            >
              Upload Your Document
            </GradientText>
            <p className="text-gray-400">
              Upload PDF, DOCX, or Email files for AI-powered analysis
            </p>
          </div>

          <div
            className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center bg-gray-900/50 backdrop-blur-sm hover:border-blue-400 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Drop your file here or click to browse
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Supports PDF, DOCX, and EML files up to {maxSizeMB}MB
            </p>

            {file && (
              <div className="text-left mb-4 p-4 bg-green-900/30 border border-green-700 rounded-lg">
                <p className="text-sm text-green-300">📄 {file.name}</p>
                <p className="text-xs text-green-400">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            )}

            <input
              id="fileInput"
              type="file"
              accept="application/pdf,.docx,.eml"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>

          <div className="mt-8">
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setInputMode("file")}
                className={`px-4 py-2 rounded-lg ${inputMode === "file" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
              >
                📁 Upload File
              </button>
              <button
                onClick={() => setInputMode("text")}
                className={`px-4 py-2 rounded-lg ${inputMode === "text" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
              >
                📧 Paste Email
              </button>
            </div>

            {inputMode === "text" && (
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Paste your email content here:
                </label>
                <textarea
                  value={emailText}
                  onChange={handleEmailTextChange}
                  placeholder="Paste email headers and content here..."
                  className="w-full h-40 p-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Include headers (From, To, Subject) and email body for best results
                </p>
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex gap-4 justify-center"
          >
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-all"
            >
              {uploading ? "Uploading..." : "Upload & Analyze"}
            </button>
            <button
              onClick={() => {
                setFile(null);
                setEmailText("");
              }}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Clear
            </button>
          </motion.div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg">
              <div className="text-3xl mb-2">📄</div>
              <h4 className="font-semibold text-white">PDF Files</h4>
              <p className="text-sm text-gray-400">Contracts, policies, reports</p>
            </div>
            <div className="text-center p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg">
              <div className="text-3xl mb-2">📝</div>
              <h4 className="font-semibold text-white">DOCX Files</h4>
              <p className="text-sm text-gray-400">Word documents, proposals</p>
            </div>
            <div className="text-center p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg">
              <div className="text-3xl mb-2">📧</div>
              <h4 className="font-semibold text-white">Email Files</h4>
              <p className="text-sm text-gray-400">EML format emails</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

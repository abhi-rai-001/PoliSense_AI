import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const maxSizeMB = 10;

  const handleFileInput = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const ext = selectedFile.name.split(".").pop().toLowerCase();
    const sizeMB = selectedFile.size / (1024 * 1024);

    if (!["pdf", "docx", "eml"].includes(ext)) {
      toast.error(`❌ ${selectedFile.name} has invalid type.`);
      return;
    }
    
    if (sizeMB > maxSizeMB) {
      toast.error(`❌ ${selectedFile.name} is too large (${sizeMB.toFixed(2)} MB).`);
      return;
    }

    setFile(selectedFile);
    toast.success(`✅ ${selectedFile.name} ready!`);
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
    if (!file) {
      toast.error("No file selected.");
      return;
    }

    setUploading(true);
    toast.loading("Uploading...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      
      await axios.post("http://localhost:3000/user/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      toast.dismiss();
      toast.success("✅ File uploaded successfully!");
      setFile(null);
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="w-full px-8 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-md">
        <Link to="/" className="text-xl font-bold text-gray-800">
          PoliSense_AI
        </Link>
        <nav className="flex gap-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600 transition">
            Home
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Upload Your Document
            </h1>
            <p className="text-gray-600">
              Upload PDF, DOCX, or Email files for AI-powered analysis
            </p>
          </div>

          {/* Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-white/50 backdrop-blur-sm hover:border-blue-400 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Drop your file here or click to browse
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Supports PDF, DOCX, and EML files up to {maxSizeMB}MB
            </p>

            {file && (
              <div className="text-left mb-4 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-700">📄 {file.name}</p>
                <p className="text-xs text-gray-500">
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

          {/* Upload Button */}
          {file && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 flex gap-4 justify-center"
            >
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                {uploading ? "Uploading..." : "Upload & Analyze"}
              </button>
              <button
                onClick={() => setFile(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Clear
              </button>
            </motion.div>
          )}

          {/* File Types Info */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/60 rounded-lg">
              <div className="text-3xl mb-2">📄</div>
              <h4 className="font-semibold text-gray-800">PDF Files</h4>
              <p className="text-sm text-gray-600">Contracts, policies, reports</p>
            </div>
            <div className="text-center p-6 bg-white/60 rounded-lg">
              <div className="text-3xl mb-2">📝</div>
              <h4 className="font-semibold text-gray-800">DOCX Files</h4>
              <p className="text-sm text-gray-600">Word documents, proposals</p>
            </div>
            <div className="text-center p-6 bg-white/60 rounded-lg">
              <div className="text-3xl mb-2">📧</div>
              <h4 className="font-semibold text-gray-800">Email Files</h4>
              <p className="text-sm text-gray-600">EML format emails</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

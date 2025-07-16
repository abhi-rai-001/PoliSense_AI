import React, { useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const maxSizeMB = 10;

  const handleFiles = (selectedFiles) => {
    const validFiles = [];
    Array.from(selectedFiles).forEach((file) => {
      const ext = file.name.split(".").pop().toLowerCase();
      const sizeMB = file.size / (1024 * 1024);

      if (!["pdf", "docx", "eml"].includes(ext)) {
        toast.error(`❌ ${file.name} has invalid type.`);
      } else if (sizeMB > maxSizeMB) {
        toast.error(`❌ ${file.name} is too large (${sizeMB.toFixed(2)} MB).`);
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length) {
      setFiles(validFiles);
      toast.success(`✅ ${validFiles.length} file(s) ready!`);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!files.length) {
      toast.error("No files to upload.");
      return;
    }

    setUploading(true);
    setProgress(0);
    toast.loading("Uploading...");

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      // 👉 Uncomment when backend is ready!
      /*
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed.");
      }
      */

      // Fake upload progress for demo
      const fakeUpload = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(fakeUpload);
            setUploading(false);
            toast.dismiss();
            toast.success("✅ Upload complete!");
          }
          return prev + 5;
        });
      }, 100);
    } catch (err) {
      toast.dismiss();
      toast.error(err.message);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-r from-purple-300 via-blue-300 to-blue-400">
      <Toaster position="top-center" />
      {/* Navbar */}
      <header className="w-full px-8 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
        <div className="text-xl font-bold text-blue-800">PoliSense_AI</div>
        <Link to="/" className="text-gray-700 hover:text-purple-600">
          Home
        </Link>
      </header>

      {/* Upload Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg p-8 max-w-md w-full text-center mt-32"
      >
        <h1 className="text-2xl font-bold mb-2 text-blue-800">Upload Your Files</h1>
        <p className="text-gray-700 mb-2">
          Upload <span className="font-semibold text-gray-800">PDF, DOCX, or EML</span> files only.
        </p>
        <p className="text-gray-700 mb-6">
          Max file size: <span className="font-semibold text-gray-800">{maxSizeMB} MB</span> per file.
        </p>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-blue-400 rounded-lg p-8 mb-6 cursor-pointer"
          onClick={() => document.getElementById("fileInput").click()}
        >
          <p className="text-gray-600">Drag & drop files here, or click to select</p>
          <input
            id="fileInput"
            type="file"
            multiple
            accept=".pdf,.docx,.eml"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <ul className="text-left mb-4 max-h-40 overflow-y-auto">
            {files.map((file, idx) => (
              <li key={idx} className="text-sm text-gray-700">
                📄 {file.name}
              </li>
            ))}
          </ul>
        )}

        {/* Progress */}
        {uploading && (
          <div className="w-full bg-gray-200 rounded-full mb-4">
            <div
              className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-1 leading-none rounded-full"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`${
            uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          } text-white px-6 py-3 rounded-full font-semibold w-full`}
        >
          {uploading ? "Uploading..." : "Upload Files"}
        </button>
      </motion.div>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 text-sm w-full">
        &copy; {new Date().getFullYear()} PoliSense_AI. All rights reserved.
      </footer>
    </div>
  );
}

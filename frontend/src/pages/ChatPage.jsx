// src/pages/ChatPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaRobot, FaUser, FaPaperPlane, FaFileUpload } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi there! How can I assist you with your documents today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "ai", text: "Thanks for your message! (AI response goes here)" }]);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-white to-blue-100 text-gray-800">
      {/* Navbar */}
      <header className="w-full px-8 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
        {/* Logo → Landing Page */}
        <Link to="/" className="text-xl font-bold text-purple-700 hover:text-purple-900 transition-colors">
          PoliSense_AI
        </Link>

        {/* Nav Buttons */}
        <nav className="flex gap-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-purple-600">Home</Link>
          <Link to="/upload" className="hover:text-purple-600">Upload Documents</Link>
          <a href="/#contact" className="hover:text-purple-600">Contact Us</a>
          <button
            onClick={() => alert("Support coming soon!")}
            className="hover:text-purple-600"
          >
            Support
          </button>
        </nav>
      </header>

      {/* Chat Area */}
      <main className="flex-grow px-4 md:px-8 py-6 overflow-y-auto space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "ai" && (
              <div className="p-2 bg-purple-200 rounded-full text-white">
                <FaRobot className="text-purple-600" />
              </div>
            )}
            <div
              className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow ${
                msg.sender === "ai"
                  ? "bg-white text-left"
                  : "bg-blue-600 text-white text-right"
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === "user" && (
              <div className="p-2 bg-blue-100 rounded-full">
                <FaUser className="text-blue-600" />
              </div>
            )}
          </motion.div>
        ))}
      </main>

      {/* Input Area */}
      <div className="px-4 md:px-8 py-4 bg-white/80 backdrop-blur-md shadow-inner">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <label className="cursor-pointer text-gray-500 hover:text-blue-500">
            <input type="file" className="hidden" />
            <FaFileUpload size={18} />
          </label>
          <input
            type="text"
            value={input}
            placeholder="Ask anything about your document..."
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
}

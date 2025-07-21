// src/pages/ChatPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaRobot, FaUser, FaPaperPlane, FaFileUpload } from "react-icons/fa";
import { Link } from "react-router-dom";
import GradientText from "../animations/GradientText";

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
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Header with title */}
      <div className="px-8 py-8 text-center border-b border-gray-800">
        <GradientText
          colors={["#40ffaa", "#4079ff", "#40ffaa"]}
          animationSpeed={8}
          showBorder={false}
          className="text-3xl mx-auto md:text-4xl font-bold"
        >
          AI Document Assistant
        </GradientText>
        <p className="text-gray-400 mt-2">
          Ask questions about your uploaded documents
        </p>
      </div>

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
              <div className="p-2 bg-gray-800 rounded-full text-white">
                <FaRobot className="text-blue-400" />
              </div>
            )}
            <div
              className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow ${
                msg.sender === "ai"
                  ? "bg-gray-900/50 border border-gray-800 text-left text-white"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white text-right"
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === "user" && (
              <div className="p-2 bg-gray-800 rounded-full">
                <FaUser className="text-blue-400" />
              </div>
            )}
          </motion.div>
        ))}
      </main>

      {/* Input Area */}
      <div className="px-4 md:px-8 py-4 bg-black/80 backdrop-blur-md border-t border-gray-800">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <label className="cursor-pointer text-gray-400 hover:text-blue-400">
            <input type="file" className="hidden" />
            <FaFileUpload size={18} />
          </label>
          <input
            type="text"
            value={input}
            placeholder="Ask anything about your document..."
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSend}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-full"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
}

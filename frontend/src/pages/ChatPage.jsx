
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaRobot, FaUser, FaPaperPlane, FaFileUpload } from "react-icons/fa";
import GradientText from "../animations/GradientText";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([
    { 
      sender: "ai", 
      text: "Hi there! I'm ready to help you analyze your uploaded documents. What would you like to know?" 
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isPageVisible = true;

    const clearDocuments = async () => {
      try {
        await axios.delete("http://localhost:3000/user/clear-all-documents");
        console.log("Documents cleared");
      } catch (error) {
        console.error('Failed to clear documents:', error);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && isPageVisible) {
        const navigationType = performance.getEntriesByType('navigation')[0]?.type;
        if (navigationType !== 'reload') {
          clearDocuments();
        }
      }
      isPageVisible = !document.hidden;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      const navigationType = performance.getEntriesByType('navigation')[0]?.type;
      if (navigationType !== 'reload') {
        clearDocuments();
      }
    };
  }, []);

  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;
    
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    const userQuestion = input;
    setInput("");
    setIsLoading(true);
    
    try {
      const response = await axios.post("http://localhost:3000/user/query", {
        question: userQuestion,
        userId: "user123"
      });
      
      const aiMessage = {
        sender: "ai",
        text: response.data.answer || "No response available",
        Decision: response.data.Decision,
        Amount: response.data.Amount,
        Justification: response.data.Justification,
        sources: response.data.sources || []
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Query failed:', error);
      setMessages((prev) => [...prev, { 
        sender: "ai", 
        text: "I apologize, but I encountered an error while processing your question. Please try again or rephrase your query."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <header className="px-6 py-6 border-b border-gray-800/50 backdrop-blur-sm bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={8}
            showBorder={false}
            className="text-2xl mx-auto md:text-3xl font-bold"
          >
            AI Document Assistant
          </GradientText>
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Ask intelligent questions about your uploaded documents
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`flex items-start gap-4 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "ai" && (
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <FaRobot className="text-white text-sm" />
                </div>
              )}

              <div
                className={`max-w-[70%] px-6 py-4 rounded-2xl shadow-lg ${
                  msg.sender === "ai"
                    ? "bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 text-gray-100"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-auto"
                }`}
              >
                {msg.sender === "ai" && msg.Decision ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">�</span>
                        <span className="font-semibold text-white">Analysis:</span>
                      </div>
                      <div className="text-gray-200 leading-relaxed pl-6">
                        {msg.Justification?.Summary || msg.Justification || msg.text}
                      </div>
                    </div>

                    {/* Sources section commented out temporarily
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="pt-3 border-t border-gray-600/30">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">📚</span>
                          <span className="font-medium text-gray-300">Sources:</span>
                        </div>
                        <div className="space-y-1 pl-6">
                          {msg.sources.map((source, idx) => (
                            <div key={idx} className="text-sm text-gray-400">
                              {source.filename || `Document ${idx + 1}`}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    */}
                  </div>
                ) : (
                  <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>
                )}
              </div>

              {msg.sender === "user" && (
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <FaUser className="text-white text-sm" />
                </div>
              )}
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <FaRobot className="text-white text-sm" />
              </div>
              <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 px-6 py-4 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-gray-400 text-sm">Analyzing your documents...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <footer className="px-4 py-4 border-t border-gray-800/50 backdrop-blur-sm bg-black/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700/50 p-2">
            <label className="cursor-pointer text-gray-400 hover:text-blue-400 transition-colors p-2">
              <input type="file" className="hidden" />
              <FaFileUpload size={18} />
            </label>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything about your documents..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none px-2 py-2"
              disabled={isLoading}
            />
            
            <button
              onClick={handleSend}
              disabled={isLoading || input.trim() === ""}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-full transition-all duration-200 hover:scale-105"
            >
              {isLoading ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <FaPaperPlane size={16} />
              )}
            </button>
          </div>
          
          <p className="text-center text-xs text-gray-500 mt-3">
            Press Enter to send • Upload documents to get started
          </p>
        </div>
      </footer>
    </div>
  );
}

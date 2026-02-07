import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { Send, Upload, X, FileText, Bot, User, Loader2, Sparkles, AlertCircle } from "lucide-react";
// import ReactMarkdown from 'react-markdown'; // eslint-disable-line no-unused-vars
import { useAuth } from "../contexts/AuthContext";
// import { getChatResponse } from "../lib/gemini"; // eslint-disable-line no-unused-vars
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom"; // eslint-disable-line no-unused-vars

const ChatPage = () => {
  const { user } = useAuth();
  const location = useLocation(); // eslint-disable-line no-unused-vars
  const navigate = useNavigate(); // eslint-disable-line no-unused-vars
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I've analyzed your document. What would you like to know about it?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clear documents when leaving the page or closing the tab
  useEffect(() => {
    const clearDocuments = async () => {
      if (!user?.uid) return;
      try {
        await axios.delete("https://polisense-backend.onrender.com/user/clear-all-documents", {
          data: { userId: user.uid }
        });
        console.log("Documents cleared for user:", user.uid);
      } catch (error) {
        console.error('Failed to clear documents:', error);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && user?.uid) {
        clearDocuments();
      }
    };

    // Handle visibility change (tab switch/minimize)
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Handle beforeunload (tab close/refresh)
    window.addEventListener("beforeunload", clearDocuments);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", clearDocuments);
      
      // Also clear on component unmount if navigating away
      // But we need to distinguish between navigation within app vs closing
      // For now, let's just clear on unmount as a safety measure
      if (user?.uid) {
        // We use sendBeacon for reliable execution during unload/navigation
        const blob = new Blob([JSON.stringify({ userId: user.uid })], { type: 'application/json' });
        navigator.sendBeacon("https://polisense-backend.onrender.com/user/clear-all-documents", blob);
      }
    };
  }, [user?.uid]);


  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Get AI response
      const response = await axios.post("https://polisense-backend.onrender.com/chat/query", {
        query: input,
        userId: user.uid
      });

      console.log("Full AI Response:", response.data);

      const aiResponseText = response.data.answer || "I couldn't generate a response.";
      
      // Parse structured data if available
      let decision = null;
      let amount = null;
      let justification = null;
      let cleanText = aiResponseText;

      // Extract JSON if present in the text (sometimes AI returns markdown code blocks)
      const jsonMatch = aiResponseText.match(/```json\n([\s\S]*?)\n```/) || aiResponseText.match(/{[\s\S]*}/);
      
      if (jsonMatch) {
         try {
            const jsonStr = jsonMatch[1] || jsonMatch[0];
            const parsed = JSON.parse(jsonStr);
            if (parsed.Decision) {
               decision = parsed.Decision;
               amount = parsed.Amount;
               justification = parsed.Justification;
               // If the text was just the JSON, we might want to construct a readable text
               // Or if the text has other parts, use them.
               // For now, let's use the Justification as the main text if we have structured data
               cleanText = justification || "I've analyzed the request.";
            }
         } catch (e) {
            console.error("Failed to parse JSON from response", e);
         }
      }

      // Fallback: Check if response.data has direct fields if backend parses it
      if (response.data.decision) decision = response.data.decision;
      if (response.data.amount) amount = response.data.amount;
      if (response.data.justification) {
         justification = response.data.justification;
         cleanText = justification;
      }

      const aiMessage = {
        id: messages.length + 2,
        text: cleanText,
        sender: "ai",
        timestamp: new Date(),
        Decision: decision,
        Amount: amount,
        Justification: justification
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get response");
      
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error processing your request.",
        sender: "ai",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans selection:bg-purple-500/30">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="flex-none p-4 border-b border-white/10 bg-black/50 backdrop-blur-lg z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                Polisense AI
              </h1>
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs text-gray-400">Online & Ready</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => {
               // Clear docs? navigate home?
               navigate("/");
            }}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        <div className="max-w-3xl mx-auto space-y-6 pb-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"} items-start gap-3`}>
                  
                  {/* Icon */}
                  <div className={`flex-none w-8 h-8 rounded-full flex items-center justify-center mt-1 shadow-lg ${
                    msg.sender === "user" 
                      ? "bg-gradient-to-br from-blue-600 to-purple-600" 
                      : "bg-gradient-to-br from-emerald-600 to-teal-600"
                  }`}>
                    {msg.sender === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`relative px-4 py-3 md:px-6 md:py-4 rounded-2xl shadow-xl backdrop-blur-sm border ${
                    msg.sender === "user"
                      ? "bg-blue-600/20 border-blue-500/30 text-blue-50"
                      : "bg-white/5 border-white/10 text-gray-100"
                  }`}>
                    {/* Structured Decision Display */}
                    {msg.sender === "ai" && msg.Decision ? (
                       <div className="space-y-3">
                          <div className={`flex items-center space-x-2 font-bold text-lg mb-2 ${
                             msg.Decision === "Approved" ? "text-green-400" :
                             msg.Decision === "Rejected" ? "text-red-400" : "text-yellow-400"
                          }`}>
                             {msg.Decision === "Approved" ? <div className="w-3 h-3 rounded-full bg-green-500" /> :
                              msg.Decision === "Rejected" ? <div className="w-3 h-3 rounded-full bg-red-500" /> :
                              <div className="w-3 h-3 rounded-full bg-yellow-500" />}
                             <span>{msg.Decision}</span>
                          </div>
                          
                          {msg.Amount && (
                             <div className="text-xl font-mono text-white bg-white/5 p-2 rounded inline-block">
                                {msg.Amount}
                             </div>
                          )}

                           <div className="h-px bg-white/20 my-2" />

                          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                            {msg.text}
                          </p>
                       </div>
                    ) : (
                      <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className="text-[10px] text-gray-500 mt-2 select-none">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start items-center space-x-2 pl-12"
            >
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-xs text-gray-400 animate-pulse">Analyzing document...</span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-none p-4 md:p-6 bg-black/80 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-end gap-2 bg-white/5 rounded-xl border border-white/10 p-2 focus-within:border-purple-500/50 focus-within:bg-white/10 transition-all duration-300">
            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Upload new document">
               <Upload className="w-5 h-5" />
            </button>
            
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about your document..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm md:text-base p-2 max-h-32 min-h-[44px] focus:outline-none resize-none scrollbar-hide"
              rows="1"
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`p-2 rounded-lg transition-all duration-300 ${
                input.trim() && !isLoading
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95" 
                  : "bg-white/5 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
          <div className="mt-2 text-center">
            <p className="text-[10px] text-gray-600">
              AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

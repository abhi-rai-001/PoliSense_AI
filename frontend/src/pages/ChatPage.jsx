/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence  } from 'framer-motion';
import { Send, X, Bot, User, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GradientText from "../animations/GradientText";

const ChatPage = () => {
  const { user } = useAuth();
  
  const navigate = useNavigate();
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
      try {
        if (!user?.id) return;
        
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/user/clear-documents`, {
          data: { userId: user.id }
        });
        console.log("Documents cleared for user:", user.id);
      } catch (error) {
        console.error('Failed to clear documents:', error);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && user?.id) {
        clearDocuments();
      }
    };

    const handleBeforeUnload = () => {
      // Send a synchronous beacon request before page unloads
      // This is more reliable than fetch/axios during page unload
      if (user?.id) {
        const blob = new Blob([JSON.stringify({ userId: user.id })], { type: 'application/json' });
        navigator.sendBeacon(`${import.meta.env.VITE_BACKEND_URL}/user/clear-documents`, blob);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user?.id]);

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
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/query`, {
        query: input,
        userId: user.id
      });

      console.log("Full AI Response:", response.data);

      const aiResponseText = response.data.answer || "I couldn't generate a response.";
      
      // Parse structured data if available
      let decision = null;
      let amount = null;
      let justification = null;
      let cleanText = aiResponseText;

      const jsonMatch = aiResponseText.match(/```json\n([\s\S]*?)\n```/) || aiResponseText.match(/{[\s\S]*}/);
      
      if (jsonMatch) {
         try {
            const jsonStr = jsonMatch[1] || jsonMatch[0];
            const parsed = JSON.parse(jsonStr);
            if (parsed.Decision) {
               decision = parsed.Decision;
               amount = parsed.Amount;
               justification = parsed.Justification;
               cleanText = justification || "I've analyzed the request.";
            }
         } catch (e) {  
            console.error("Failed to parse JSON from response", e);
         }
      }

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
    <div className="flex flex-col h-screen bg-[#050508] text-white font-sans selection:bg-cyan-500/30 relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[600px] bg-gradient-to-br from-cyan-500/5 via-violet-500/5 to-transparent blur-[120px] pointer-events-none z-0"></div>

      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'rgba(22, 22, 31, 0.9)',
            backdropFilter: 'blur(10px)',
            color: '#f0f0f5',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      />
      
      {/* Header */}
      <header className="flex-none z-10 relative">
        {/* Top gradient line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        <div className="px-5 py-3 bg-[#07070d]/80 backdrop-blur-2xl border-b border-white/[0.06] flex items-center justify-between">

          {/* Left — Logo + Info */}
          <div className="flex items-center gap-4">
            {/* Logo mark */}
            <div className="relative flex-none">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 blur-md opacity-50" />
              <div className="relative w-9 h-9 bg-gradient-to-br from-cyan-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/10">
                <Bot className="w-4.5 h-4.5 text-white" strokeWidth={2} />
              </div>
            </div>

            {/* Brand text */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5">
                <span className="text-[15px] font-semibold tracking-[-0.01em] text-white" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.01em' }}>
                  PoliSense
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <span className="text-[11px] text-white/30 tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Model active · Gemini 3.5 Flash
                </span>
              </div>
            </div>
          </div>

          {/* Right — Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-2 px-3.5 py-2 rounded-xl text-white/40 hover:text-white/80 bg-white/0 hover:bg-white/5 border border-white/0 hover:border-white/10 transition-all duration-200"
            >
              <X className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
              <span className="text-[12px] font-medium hidden sm:block" style={{ fontFamily: "'Inter', sans-serif" }}>Close</span>
            </button>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6 scrollbar-hide z-10 relative">
        <div className="max-w-3xl mx-auto space-y-8 pb-4 pt-4">
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
                <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"} items-end gap-3 group`}>
                  
                  {/* Icon */}
                  <div className={`flex-none w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                    msg.sender === "user" 
                      ? "bg-gradient-to-br from-cyan-500 to-blue-600" 
                      : "bg-gradient-to-br from-violet-500 to-fuchsia-600"
                  }`}>
                    {msg.sender === "user" ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`relative px-5 py-4 rounded-2xl shadow-xl backdrop-blur-md border transition-all ${
                    msg.sender === "user"
                      ? "bg-cyan-900/30 border-cyan-500/30 text-cyan-50 rounded-br-sm"
                      : "bg-white/5 border-white/10 text-gray-200 rounded-bl-sm group-hover:bg-white/10 group-hover:border-white/20"
                  }`}>
                    {/* Structured Decision Display */}
                    {msg.sender === "ai" && msg.Decision ? (
                       <div className="space-y-4">
                          <div className={`flex items-center space-x-2 font-bold text-lg ${
                             msg.Decision === "Approved" ? "text-emerald-400" :
                             msg.Decision === "Rejected" ? "text-rose-400" : "text-yellow-400"
                          }`}>
                             {msg.Decision === "Approved" ? <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> :
                              msg.Decision === "Rejected" ? <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" /> :
                              <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]" />}
                             <span className="font-['Clash_Grotesk'] tracking-wide">{msg.Decision}</span>
                          </div>
                          
                          {msg.Amount && (
                             <div className="text-xl font-mono text-white bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg inline-block shadow-inner">
                                {msg.Amount}
                             </div>
                          )}

                           <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-3" />

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
                  <span className="text-[10px] text-gray-500/0 group-hover:text-gray-500 transition-colors select-none mb-1">
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
              className="flex justify-start items-center space-x-3 pl-12"
            >
              <div className="flex space-x-1.5 p-3 glass-panel rounded-2xl rounded-bl-sm border border-white/10">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-none p-4 md:p-6 bg-black/60 backdrop-blur-2xl border-t border-white/5 z-20">
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-end gap-3 bg-[#0a0a0f] rounded-2xl border border-white/10 p-2 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about your document..."
              className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm md:text-base p-3 max-h-32 min-h-[48px] focus:outline-none resize-none scrollbar-hide"
              rows="1"
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-xl transition-all duration-300 ${
                input.trim() && !isLoading
                  ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/25 hover:scale-105 active:scale-95" 
                  : "bg-white/5 text-gray-600 cursor-not-allowed"
              }`}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
          <div className="mt-3 text-center">
            <p className="text-[11px] text-gray-500 font-medium">
              AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

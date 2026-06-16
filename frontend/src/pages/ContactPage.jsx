import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, MapPin, Instagram, Linkedin, Send, CheckCircle2 } from "lucide-react";
import GradientText from "../animations/GradientText";
import toast, { Toaster } from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
      
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-20 left-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'rgba(22, 22, 31, 0.9)',
            backdropFilter: 'blur(10px)',
            color: '#f0f0f5',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      />

      <main className="relative z-10 px-6 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <GradientText
                className="text-4xl md:text-5xl lg:text-6xl mx-auto font-bold mb-6 font-['Clash_Grotesk'] tracking-tight"
              >
                Let's Talk
              </GradientText>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto"
            >
              Have questions or want to learn more? We'd love to hear from you.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-panel rounded-3xl p-8 md:p-10"
            >
              <h3 className="text-2xl font-semibold mb-6 font-['Clash_Grotesk']">Send us a message</h3>
              
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center h-[380px]">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <CheckCircle2 className="w-20 h-20 text-emerald-400 mb-6" />
                  </motion.div>
                  <h4 className="text-2xl font-semibold text-white mb-2">Message Sent!</h4>
                  <p className="text-gray-400">We'll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      rows="4"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative group overflow-hidden rounded-xl p-[1px] disabled:opacity-50"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity"></span>
                    <div className="relative bg-black px-6 py-4 rounded-xl transition-all group-hover:bg-transparent flex justify-center items-center">
                      <span className="text-sm font-semibold text-white flex items-center gap-2">
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </span>
                    </div>
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact Info & Socials */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-8"
            >
              <div className="glass-panel rounded-3xl p-8 md:p-10">
                <h3 className="text-2xl font-semibold mb-8 font-['Clash_Grotesk']">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/20 transition-colors border border-cyan-500/20">
                      <Mail className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Email Us</p>
                      <a href="mailto:raiabhinav182@gmail.com" className="text-white font-medium hover:text-cyan-400 transition-colors">
                        raiabhinav182@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0 group-hover:bg-violet-500/20 transition-colors border border-violet-500/20">
                      <MapPin className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Location</p>
                      <p className="text-white font-medium">Pune, India</p>
                    </div>
                  </div>
                </div>

                <hr className="my-8 border-white/10" />

                <h3 className="text-lg font-medium mb-6">Connect With Us</h3>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/its_abhinavrai?igsh=MWo2eGQxcDlmMTg1bQ%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-gray-400 hover:text-rose-400 hover:border-rose-500/30 transition-all hover:-translate-y-1"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/abhinav-rai-2611a8259?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-all hover:-translate-y-1"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Promo Banner */}
              <div className="relative group overflow-hidden rounded-3xl p-[1px]">
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/50 via-violet-500/50 to-emerald-500/50 rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></span>
                <div className="relative bg-black/80 backdrop-blur-xl p-8 rounded-3xl flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left justify-between h-full border border-white/10">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Ready to Get Started?</h4>
                    <p className="text-sm text-gray-400">Start analyzing your documents today.</p>
                  </div>
                  <Link
                    to="/upload"
                    className="shrink-0 bg-white text-black px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-200 transition-colors"
                  >
                    Try Now
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

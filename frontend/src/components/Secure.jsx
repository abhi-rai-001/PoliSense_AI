/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import React from 'react';
import GradientText from '../animations/GradientText';
import { ShieldCheck, Lock, Server } from 'lucide-react';
const Secure = () => {
  const features = [
    {
      icon: <Server className="w-5 h-5 text-emerald-400" />,
      text: "Secure file processing with rigorous validation and sanitization"
    },
    {
      icon: <Lock className="w-5 h-5 text-cyan-400" />,
      text: "Private data access - your documents remain exclusively yours"
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-violet-400" />,
      text: "Bank-grade encryption and secure request validation"
    }
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex flex-col gap-8"
        >
          <div>
            <GradientText
              className="text-4xl md:text-5xl font-bold font-['Clash_Grotesk'] tracking-tight mb-6"
            >
              Your Privacy, Our Priority
            </GradientText>
            
            <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
              Your files are protected with advanced security measures and are 
              <span className="text-emerald-400 font-semibold"> only accessible by you</span>. 
              Trust that your documents remain fully confidential and secure throughout your entire experience.
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            {features.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="glass-panel p-4 rounded-xl flex items-center gap-4 hover:bg-white/[0.05] transition-colors"
              >
                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                  {item.icon}
                </div>
                <span className="text-gray-300 font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 relative w-full flex justify-center"
        >
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-violet-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 p-2 glass-panel rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/10">
            {/* If Secure.png is not found, this falls back gracefully, but keeping it as requested */}
            <img 
              src="./Secure.png" 
              alt="Security Infrastructure" 
              className="w-full h-auto max-w-md object-contain mix-blend-screen opacity-90 hover:opacity-100 transition-opacity"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback visual if image is missing */}
            <div className="hidden w-80 h-80 flex-col items-center justify-center gap-6 p-8">
               <ShieldCheck className="w-32 h-32 text-cyan-400/80 animate-pulse" />
               <div className="text-center text-gray-400 font-medium">Enterprise Security</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Secure;

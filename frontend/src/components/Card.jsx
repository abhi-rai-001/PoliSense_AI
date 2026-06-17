/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import React from 'react';
const Card = ({ icon, title, description, className = '' }) => {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className={`glass-panel glass-panel-hover p-8 rounded-2xl flex flex-col h-full relative overflow-hidden group ${className}`}
    >
      {/* Subtle background glow effect on hover */}
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-cyan-400 group-hover:text-white group-hover:bg-cyan-500/20 transition-all duration-300">
        {icon}
      </div>
      
      <h3 className="text-xl font-semibold mb-3 text-white font-['Clash_Grotesk'] tracking-wide">
        {title}
      </h3>
      
      <p className="text-gray-400 text-sm leading-relaxed flex-grow">
        {description}
      </p>
    </motion.div>
  );
};

export default Card;

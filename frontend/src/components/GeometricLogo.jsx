import React from 'react';

const GeometricLogo = ({ className = "w-24 h-24" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full animate-[spin_20s_linear_infinite]"
        style={{ filter: 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.5))' }}
      >
        <defs>
          <linearGradient id="polyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        
        {/* Outer Hexagon */}
        <polygon 
          points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" 
          fill="none" 
          stroke="url(#polyGrad)" 
          strokeWidth="2"
          className="opacity-80"
        />
        
        {/* Inner Star/Geometry */}
        <polygon 
          points="50,20 75,65 25,65" 
          fill="none" 
          stroke="#00d4ff" 
          strokeWidth="2"
          className="animate-pulse"
        />
        <polygon 
          points="50,80 25,35 75,35" 
          fill="none" 
          stroke="#8b5cf6" 
          strokeWidth="2"
          className="opacity-70"
        />
        
        {/* Center dot */}
        <circle cx="50" cy="50" r="4" fill="#34d399" />
      </svg>
    </div>
  );
};

export default GeometricLogo;
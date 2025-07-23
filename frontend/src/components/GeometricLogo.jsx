import React from 'react';

const GeometricLogo = ({ className = "w-8 h-8" }) => {
  return (
    <div className={`${className} relative`}>
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#40ffaa" />
            <stop offset="100%" stopColor="#4079ff" />
          </linearGradient>
        </defs>
        
        {/* Outer hexagon */}
        <polygon 
          points="20,3 32,10 32,25 20,32 8,25 8,10" 
          fill="none" 
          stroke="url(#logoGradient)" 
          strokeWidth="2"
          className="animate-pulse"
        />
        
        {/* Inner elements */}
        <polygon 
          points="20,8 28,12 28,23 20,27 12,23 12,12" 
          fill="url(#logoGradient)" 
          opacity="0.3"
        />
        
        {/* Central AI symbol */}
        <text x="20" y="25" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
          AI
        </text>
        
        {/* Animated dots */}
        <circle cx="20" cy="6" r="1" fill="#40ffaa" className="animate-bounce" />
        <circle cx="29" cy="13" r="1" fill="#4079ff" className="animate-bounce" style={{animationDelay: '0.2s'}} />
        <circle cx="29" cy="22" r="1" fill="#40ffaa" className="animate-bounce" style={{animationDelay: '0.4s'}} />
      </svg>
    </div>
  );
};

export default GeometricLogo;
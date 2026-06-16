import React from 'react';
import CircularGallery from '@/animations/CircularGallery';
import GradientText from '@/animations/GradientText';

const Languages = () => {
  const supportedLanguages = [
    { image: `https://flagcdn.com/w320/us.png`, text: "English" },
    { image: `https://flagcdn.com/w320/es.png`, text: "Spanish" },
    { image: `https://flagcdn.com/w320/fr.png`, text: "French" },
    { image: `https://flagcdn.com/w320/de.png`, text: "German" },
    { image: `https://flagcdn.com/w320/it.png`, text: "Italian" },
    { image: `https://flagcdn.com/w320/pt.png`, text: "Portuguese" },
    { image: `https://flagcdn.com/w320/cn.png`, text: "Chinese" },
    { image: `https://flagcdn.com/w320/jp.png`, text: "Japanese" },
    { image: `https://flagcdn.com/w320/kr.png`, text: "Korean" },
    { image: `https://flagcdn.com/w320/in.png`, text: "Hindi" },
    { image: `https://flagcdn.com/w320/sa.png`, text: "Arabic" },
    { image: `https://flagcdn.com/w320/ru.png`, text: "Russian" },
  ];

  return (
    <section className="py-24 relative overflow-hidden text-white">
      {/* Background Aurora */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-gradient-to-r from-cyan-500/5 via-violet-500/10 to-emerald-500/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <GradientText
            className="text-4xl md:text-5xl mx-auto font-bold mb-6 font-['Clash_Grotesk'] tracking-tight"
          >
            Global Language Support
          </GradientText>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Analyze documents in over 100+ languages with our advanced AI. 
            Upload content in your native language and get intelligent insights instantly.
          </p>
        </div>

        {/* Circular Gallery */}
        <div className="h-[500px] w-full relative">
          <CircularGallery 
            items={supportedLanguages}
            bend={2} 
            textColor="#ffffff" 
            borderRadius={0.05} 
            scrollEase={0.02}
            scrollSpeed={1.5}
            font="600 24px Clash Grotesk, Inter, sans-serif"
          />
          {/* Subtle vignette to fade edges */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_40px_rgba(10,10,15,1)]"></div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-panel rounded-full">
            <span className="text-cyan-400">⚡</span>
            <span className="text-gray-300 text-sm font-medium">
              Powered by Google's Gemini Flash for accurate multilingual analysis
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Languages;

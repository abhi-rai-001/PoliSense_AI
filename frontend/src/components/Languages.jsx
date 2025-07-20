import React from 'react'
import CircularGallery from '@/animations/CircularGallery'
import GradientText from '@/animations/GradientText'

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
    <section className='min-h-screen py-30 text-white'>
      <div className=" mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={8}
            showBorder={false}
            className="text-4xl md:text-5xl mx-auto font-bold mb-6"
          >
            Global Language Support
          </GradientText>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Analyze documents in over 100+ languages with our advanced AI. 
            Upload content in your native language and get intelligent insights instantly.
          </p>
        </div>

        {/* Circular Gallery */}
        <div className="h-[500px] w-full">
          <CircularGallery 
            items={supportedLanguages}
            bend={2} 
            textColor="#ffffff" 
            borderRadius={0.1} 
            scrollEase={0.01}
            scrollSpeed={1.5}
            font="bold 24px Poppins, sans-serif"
          />
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Powered by Google's Gemini Flash for accurate multilingual document analysis
          </p>
        </div>
      </div>
    </section>
  )
}

export default Languages

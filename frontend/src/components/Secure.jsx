import React from 'react'
import GradientText from '../animations/GradientText'

const Secure = () => {
  return (
    <div className='mx-auto w-full px-30 min-h-[70vh]  flex items-center'>
      <div className="flex justify-between items-center gap-12 w-full">
        
        <section className='flex  flex-col gap-6 flex-1'>
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={8}
            showBorder={false}
            className="text-5xl font-bold "
          >
            Your Privacy, Our Priority
          </GradientText>
          
          <p className='text-xl text-gray-300 leading-relaxed max-w-2xl'>
            Your files are protected with advanced security measures and are 
            <span className='text-green-400 font-semibold'> only accessible by you</span>. 
            Trust that your documents remain fully confidential and secure throughout your entire experience.
          </p>

          <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-300">Secure file processing with validation and sanitization</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300">Private data access - your documents remain exclusively yours</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-gray-300">CORS protection and secure request validation</span>
            </div>
          </div>
        </section>

        <section className='flex-1 relative'>
          <img src="./Secure.png" alt="Secure"/>
        </section>
      </div>
    </div>
  )
}

export default Secure

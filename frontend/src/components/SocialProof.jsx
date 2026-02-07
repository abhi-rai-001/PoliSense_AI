import React from 'react'
import GradientText from '@/animations/GradientText'
import { FaStar, FaUsers, FaFileAlt, FaGlobe } from 'react-icons/fa'


const SocialProof = () => {
  const testimonialImages = [
    './Users/User1.jpg',
    './Users/User2.jpg',
    './Users/User3.jpg',
    './Users/User5.jpg',
    './Users/User4.jpg'
  ]

  const testimonials = [
    {
      name: "Chi Chen",
      role: "Legal Analyst",
      company: "Morrison & Associates",
      text: "PoliSense.AI transformed how we analyze contracts. What used to take hours now takes minutes.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Research Director", 
      company: "TechFlow Solutions",
      text: "The multilingual support is game-changing for our global operations.",
      rating: 5
    },
    {
      name: "Dr. Emily Watson",
      role: "Policy Researcher",
      company: "Government Affairs Institute", 
      text: "Essential tool for identifying key policy implications we might miss.",
      rating: 5
    }
  ]

  const stats = [ // eslint-disable-line no-unused-vars
    { 
      icon: <FaUsers className="w-8 h-8" />, 
      number: "10,000+", 
      label: "Active Users" 
    },
    { 
      icon: <FaFileAlt className="w-8 h-8" />, 
      number: "500K+", 
      label: "Documents Analyzed" 
    },
    { 
      icon: <FaGlobe className="w-8 h-8" />, 
      number: "100+", 
      label: "Languages Supported" 
    },
    { 
      icon: <FaStar className="w-8 h-8" />, 
      number: "4.9/5", 
      label: "User Rating" 
    }
  ]

  return (
    <section className='  text-white py-24 px-12'>
      <div className=" mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={8}
            showBorder={false}
            className="text-4xl md:text-5xl mx-auto font-bold mb-6"
          >
            Trusted by Professionals
          </GradientText>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Join thousands of professionals who rely on PoliSense.AI for intelligent document analysis
          </p>
        </div>

        {/* Stats */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center text-blue-400 mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div> */}

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700 flex flex-col justify-between transition-all duration-300 ease-out hover:scale-105 hover:border-blue-500/50"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonialImages[index] || testimonialImages[0]}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-blue-400"
                />
                <div>
                  <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                  <div className="text-xs text-gray-400">{testimonial.role}</div>
                </div>
              </div>
              
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, starIndex) => (
                  <FaStar key={starIndex} className="w-3 h-3 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-300 text-sm italic mb-4 flex-grow">
                "{testimonial.text}"
              </p>
              
              <div className="text-xs text-blue-400 font-medium">
                {testimonial.company}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default SocialProof

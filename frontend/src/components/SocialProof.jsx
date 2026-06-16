import React from 'react';
import GradientText from '@/animations/GradientText';
import { Star, Users, FileText, Globe } from 'lucide-react';
const SocialProof = () => {
  const testimonials = [
    {
      name: "Chi Chen",
      role: "Legal Analyst",
      company: "Morrison & Associates",
      text: "PoliSense.AI transformed how we analyze contracts. What used to take hours now takes minutes.",
      rating: 5,
      avatar: "https://ui-avatars.com/api/?name=Chi+Chen&background=0D8ABC&color=fff"
    },
    {
      name: "Marcus Rodriguez",
      role: "Research Director", 
      company: "TechFlow Solutions",
      text: "The multilingual support is game-changing for our global operations.",
      rating: 5,
      avatar: "https://ui-avatars.com/api/?name=Marcus+Rodriguez&background=8b5cf6&color=fff"
    },
    {
      name: "Dr. Emily Watson",
      role: "Policy Researcher",
      company: "Government Affairs Institute", 
      text: "Essential tool for identifying key policy implications we might miss.",
      rating: 5,
      avatar: "https://ui-avatars.com/api/?name=Emily+Watson&background=34d399&color=fff"
    }
  ];

  const stats = [
    { 
      icon: <Users className="w-8 h-8" />, 
      number: "10,000+", 
      label: "Active Users" 
    },
    { 
      icon: <FileText className="w-8 h-8" />, 
      number: "500K+", 
      label: "Documents Analyzed" 
    },
    { 
      icon: <Globe className="w-8 h-8" />, 
      number: "100+", 
      label: "Languages Supported" 
    },
    { 
      icon: <Star className="w-8 h-8" />, 
      number: "4.9/5", 
      label: "User Rating" 
    }
  ];

  return (
    <section className="py-24 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <GradientText
            className="text-4xl md:text-5xl mx-auto font-bold mb-6 font-['Clash_Grotesk'] tracking-tight"
          >
            Trusted by Professionals
          </GradientText>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Join thousands of professionals who rely on PoliSense.AI for intelligent document analysis
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              key={index} 
              className="text-center glass-panel p-6 rounded-2xl"
            >
              <div className="flex justify-center text-cyan-400 mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-white mb-2 font-['Clash_Grotesk']">
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              key={index}
              className="glass-panel p-8 rounded-2xl flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-cyan-500/50"
                />
                <div>
                  <div className="font-semibold text-white font-['Clash_Grotesk']">{testimonial.name}</div>
                  <div className="text-xs text-gray-400">{testimonial.role}</div>
                </div>
              </div>
              
              <div className="flex mb-4 gap-1">
                {[...Array(testimonial.rating)].map((_, starIndex) => (
                  <Star key={starIndex} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-grow">
                "{testimonial.text}"
              </p>
              
              <div className="text-xs font-semibold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                {testimonial.company}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;

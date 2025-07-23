import React from 'react';
import { motion } from 'framer-motion';
import GradientText from '../animations/GradientText';
import AILogo from '../components/GeometricLogo';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={8}
              showBorder={false}
              className="text-5xl md:text-7xl mx-auto font-bold mb-8"
            >
              About PoliSense.AI
            </GradientText>
          </motion.div>
          
          <motion.p 
            {...fadeInUp}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            Revolutionizing document analysis through intelligent AI, making complex information accessible to everyone.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-8 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                <GradientText
                  colors={["#40ffaa", "#4079ff"]}
                  animationSpeed={6}
                  showBorder={false}
                >
                  Our Mission
                </GradientText>
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                At PoliSense.AI, we believe that everyone deserves access to the insights hidden within complex documents. Too many people skip reading important documents because they're time-consuming and overwhelming.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                We're on a mission to democratize AI-powered insights, save professionals countless hours from manual document review, and make complex information accessible to everyone—regardless of their technical expertise.
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="flex justify-center"
            >
              <div className="relative">
                <AILogo className="w-64 h-64" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full blur-3xl"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-8"
            >
              <GradientText
                colors={["#40ffaa", "#4079ff"]}
                animationSpeed={6}
                showBorder={false}
                className='mx-auto'
              >
                The Problem We Solve
              </GradientText>
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            >
              Most people skip reading documents because they're complex and time-consuming. Important insights get buried in lengthy texts, and professionals waste hours on manual document review.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Save Time",
                description: "Transform hours of reading into minutes of insights",
                icon: "⏰"
              },
              {
                title: "Understand Everything",
                description: "Get answers to all your document-related queries instantly",
                icon: "🧠"
              },
              {
                title: "Reduce Complexity",
                description: "AI helps find hidden meanings and simplifies tough concepts",
                icon: "🔍"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gray-900/50 p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-colors"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 px-8 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-8"
            >
              <GradientText
                colors={["#40ffaa", "#4079ff"]}
                animationSpeed={6}
                showBorder={false}
                className='mx-auto'
              >
                What Makes Us Different
              </GradientText>
            </motion.h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Universal File Support",
                description: "Support for all file formats - PDF, DOCX, emails, and more",
                icon: "📁"
              },
              {
                title: "Lightning Fast AI",
                description: "Super-fast processing powered by cutting-edge AI technology",
                icon: "⚡"
              },
              {
                title: "Multilingual Support",
                description: "Analyze documents in 100+ languages with perfect accuracy",
                icon: "🌍"
              },
              {
                title: "User-Friendly Interface",
                description: "Intuitive design that anyone can use, no technical expertise required",
                icon: "✨"
              },
              {
                title: "Enterprise Security",
                description: "We don't store your data hence it is completely safe",
                icon: "🔒"
              },
              {
                title: "Accessible to All",
                description: "Serving every industry equally - from legal to healthcare to education",
                icon: "🤝"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-8"
            >
              <GradientText
                colors={["#40ffaa", "#4079ff"]}
                animationSpeed={6}
                showBorder={false}
                className='mx-auto'
              >
                Our Vision
              </GradientText>
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8"
            >
              We envision a future where AI reduces effort and time dramatically, helping people discover hidden meanings in documents and simplifying the most complex information.
            </motion.p>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed"
            >
              In 5 years, we see PoliSense.AI as a platform with thousands of users and awesome new features—including our upcoming "Talk to AI" feature that will revolutionize how people interact with their documents.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-8 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-8"
            >
              <GradientText
                colors={["#40ffaa", "#4079ff"]}
                animationSpeed={6}
                showBorder={false}
                                className='mx-auto'

              >
                Meet Our Team
              </GradientText>
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Founded in 2025 by two passionate software developers dedicated to making AI accessible to everyone.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto"
          >
            {[
              {
                name: "Abhinav Rai",
                role: "Co-Founder & Team Leader",
                title: "Software Developer",
                description: "Leading the technical vision and development of PoliSense.AI's cutting-edge AI capabilities."
              },
              {
                name: "Siddharth Parjane",
                role: "Co-Founder",
                title: "Software Developer", 
                description: "Driving innovation in user experience and ensuring our platform remains intuitive and powerful."
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gray-900/50 p-8 rounded-2xl border border-gray-700 text-center hover:border-blue-500/50 transition-colors"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">{member.name}</h3>
                <p className="text-blue-400 font-semibold mb-2">{member.role}</p>
                <p className="text-gray-400 text-sm mb-4">{member.title}</p>
                <p className="text-gray-300 leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-8"
            >
              <GradientText
                colors={["#40ffaa", "#4079ff"]}
                animationSpeed={6}
                showBorder={false}
              >
                Ready to Transform Your Document Analysis?
              </GradientText>
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-300 mb-12 leading-relaxed"
            >
              Join thousands of professionals who trust PoliSense.AI to save time and unlock insights from their documents.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
               <Link to ='/upload'> <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105">
            Get Started 
              </button> </Link> 

            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

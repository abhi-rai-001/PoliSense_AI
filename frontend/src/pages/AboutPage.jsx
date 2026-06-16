import React from 'react';
import { motion } from "framer-motion";
import GradientText from '../animations/GradientText';
import GeometricLogo from '../components/GeometricLogo';
import { Link } from 'react-router-dom';
import { Clock, Brain, ZoomIn, FileType2, Zap, Globe2, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';

const AboutPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    whileInView: {
      transition: {
        staggerChildren: 0.15
      }
    },
    viewport: { once: true }
  };

  return (
    <div className="min-h-screen pt-20 bg-[#050508] text-white relative overflow-hidden">
      {/* Aurora Ambient Glows */}
      <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <GradientText
              className="text-5xl md:text-6xl lg:text-7xl mx-auto font-bold mb-8 font-['Clash_Grotesk'] tracking-tight"
            >
              About PoliSense.AI
            </GradientText>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Revolutionizing document analysis through intelligent AI, making complex information accessible to everyone.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative z-10 py-24 px-6 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={fadeInUp} className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 font-['Clash_Grotesk']">
                Our Mission
              </h2>
              <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
                <p>
                  At PoliSense.AI, we believe that everyone deserves access to the insights hidden within complex documents. Too many people skip reading important documents because they're time-consuming and overwhelming.
                </p>
                <p>
                  We're on a mission to democratize AI-powered insights, save professionals countless hours from manual document review, and make complex information accessible to everyone—regardless of their technical expertise.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="order-1 lg:order-2 flex justify-center lg:justify-end"
            >
              <div className="relative">
                <GeometricLogo className="w-64 h-64 lg:w-80 lg:h-80 opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 rounded-full blur-3xl -z-10"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-6 font-['Clash_Grotesk']"
            >
              The Problem We Solve
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed"
            >
              Most people skip reading documents because they're complex and time-consuming. Important insights get buried in lengthy texts, and professionals waste hours on manual document review.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Save Time",
                description: "Transform hours of reading into minutes of insights",
                icon: <Clock className="w-8 h-8 text-cyan-400" />
              },
              {
                title: "Understand Everything",
                description: "Get answers to all your document-related queries instantly",
                icon: <Brain className="w-8 h-8 text-violet-400" />
              },
              {
                title: "Reduce Complexity",
                description: "AI helps find hidden meanings and simplifies tough concepts",
                icon: <ZoomIn className="w-8 h-8 text-emerald-400" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="glass-panel p-8 rounded-3xl glass-panel-hover"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white font-['Clash_Grotesk']">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="relative z-10 py-24 px-6 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-6 font-['Clash_Grotesk']"
            >
              What Makes Us Different
            </motion.h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                title: "Universal File Support",
                description: "Support for all file formats - PDF, DOCX, emails, and more",
                icon: <FileType2 className="w-6 h-6 text-cyan-400" />
              },
              {
                title: "Lightning Fast AI",
                description: "Super-fast processing powered by cutting-edge AI technology",
                icon: <Zap className="w-6 h-6 text-yellow-400" />
              },
              {
                title: "Multilingual Support",
                description: "Analyze documents in 100+ languages with perfect accuracy",
                icon: <Globe2 className="w-6 h-6 text-emerald-400" />
              },
              {
                title: "User-Friendly Interface",
                description: "Intuitive design that anyone can use, no technical expertise required",
                icon: <Sparkles className="w-6 h-6 text-violet-400" />
              },
              {
                title: "Enterprise Security",
                description: "We don't store your data hence it is completely safe",
                icon: <ShieldCheck className="w-6 h-6 text-cyan-500" />
              },
              {
                title: "Accessible to All",
                description: "Serving every industry equally - from legal to healthcare to education",
                icon: <HeartHandshake className="w-6 h-6 text-rose-400" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="glass-panel p-6 rounded-2xl flex items-start gap-5 glass-panel-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-1">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white font-['Clash_Grotesk']">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-8 font-['Clash_Grotesk']"
            >
              Our Vision
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8"
            >
              We envision a future where AI reduces effort and time dramatically, helping people discover hidden meanings in documents and simplifying the most complex information.
            </motion.p>
            
            <motion.p 
              variants={fadeInUp}
              className="text-base text-gray-500 leading-relaxed max-w-3xl mx-auto"
            >
              In 5 years, we see PoliSense.AI as a platform with thousands of users and awesome new features—including our upcoming "Talk to AI" feature that will revolutionize how people interact with their documents.
            </motion.p>
          </motion.div>
        </div>
      </section>


      {/* Call to Action */}
      <section className="relative z-10 py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-8 font-['Clash_Grotesk']"
            >
              Ready to Transform Your Document Analysis?
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
            >
              Join thousands of professionals who trust PoliSense.AI to save time and unlock insights from their documents.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
            >
               <Link to='/upload' className="relative group inline-block overflow-hidden rounded-full p-[1px]">
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500 rounded-full opacity-80 group-hover:opacity-100 transition-opacity animate-gradient"></span>
                  <div className="relative bg-black px-10 py-4 rounded-full transition-all group-hover:bg-transparent flex justify-center items-center">
                    <span className="text-base font-semibold text-white">Get Started Now</span>
                  </div>
              </Link> 
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

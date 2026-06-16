import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Building2 } from 'lucide-react';
import GradientText from '../animations/GradientText';

const Pricing = () => {
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
    <section className="relative py-24 px-6 border-y border-white/5 bg-[#050508] text-white overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-emerald-500/10 blur-[120px] pointer-events-none rounded-full"></div>

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        <motion.div 
          initial="initial"
          whileInView="whileInView"
          variants={staggerContainer}
          className="mb-16"
        >
          <motion.div variants={fadeInUp}>
            <GradientText
              className="text-3xl md:text-5xl font-bold mb-4 font-['Clash_Grotesk']"
            >
              Simple, Transparent Pricing
            </GradientText>
          </motion.div>
          <motion.p variants={fadeInUp} className="text-gray-400 text-lg max-w-2xl mx-auto">
            Start for free and upgrade as your document analysis needs grow.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          className="grid md:grid-cols-3 gap-8"
        >
          {/* Free Tier */}
          <motion.div 
            variants={fadeInUp}
            className="glass-panel p-8 rounded-3xl text-left border border-white/10 hover:border-cyan-500/30 transition-all duration-300 relative group flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 text-gray-400">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-2 font-['Clash_Grotesk'] text-white">Free</h3>
            <p className="text-gray-400 mb-6 min-h-[48px]">Basic features to explore PoliSense.AI.</p>
            <div className="mb-8">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-gray-500 text-sm">/month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {['Up to 5 documents/mo', 'Basic AI analysis', 'Standard support'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button className="w-full py-3 rounded-full font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors mt-auto border border-white/5">
              Start Free
            </button>
          </motion.div>

          {/* Pro Tier */}
          <motion.div 
            variants={fadeInUp}
            className="glass-panel p-8 rounded-3xl text-left border border-violet-500/30 relative flex flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent rounded-3xl pointer-events-none"></div>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
              Most Popular
            </div>

            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-6 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-2 font-['Clash_Grotesk'] text-white">Pro</h3>
            <p className="text-gray-400 mb-6 min-h-[48px]">Advanced AI analysis & larger document support.</p>
            <div className="mb-8">
              <span className="text-4xl font-bold text-white">$29</span>
              <span className="text-gray-500 text-sm">/month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1 relative z-10">
              {['Unlimited documents', 'Advanced deep AI analysis', 'Priority processing', 'Priority email support'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-200">
                  <div className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-violet-400" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button className="relative w-full py-3 rounded-full font-semibold group overflow-hidden mt-auto">
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full opacity-90 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative text-white">Get Pro</span>
            </button>
          </motion.div>

          {/* Enterprise Tier */}
          <motion.div 
            variants={fadeInUp}
            className="glass-panel p-8 rounded-3xl text-left border border-white/10 hover:border-cyan-500/30 transition-all duration-300 relative group flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 text-cyan-400">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-2 font-['Clash_Grotesk'] text-white">Enterprise</h3>
            <p className="text-gray-400 mb-6 min-h-[48px]">Custom solutions & dedicated support for teams.</p>
            <div className="mb-8">
              <span className="text-3xl font-bold text-white">Custom</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {['Custom API integrations', 'Dedicated account manager', 'SLA guarantees', 'On-premise deployment options'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button className="w-full py-3 rounded-full font-semibold bg-white text-black hover:bg-gray-200 transition-colors mt-auto">
              Contact Sales
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;

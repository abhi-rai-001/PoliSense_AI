/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import GradientText from '@/animations/GradientText';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence  } from 'framer-motion';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What file formats do you support?",
      answer: "We support PDF files, Microsoft Word documents (DOCX), and email files (.eml). Our AI can extract and analyze text from all these formats with high accuracy."
    },
    {
      question: "How secure is my data?",
      answer: "Your data security is our top priority. We use secure file processing with validation, database security, and CORS protection. Your documents remain exclusively yours and are processed with enterprise-grade security measures."
    },
    {
      question: "Which languages can you analyze?",
      answer: "We support over 100+ languages. Our AI is powered by Google's Gemini Flash for accurate multilingual analysis, meaning you can upload in any language and get insights."
    },
    {
      question: "How long does document processing take?",
      answer: "Most documents are processed within seconds to a few minutes, depending on the file size and complexity. Our AI provides real-time analysis and insights as soon as processing is complete."
    },
    {
      question: "Is there a file size limit?",
      answer: "We can handle documents of various sizes. For optimal performance, we recommend files under 10MB per upload."
    },
    {
      question: "Do you store my documents?",
      answer: "We prioritize your privacy. Documents are processed securely and we maintain strict data handling policies. Your files are cleared automatically when you leave the session."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-6 relative z-10">
      <div className="max-w-3xl mx-auto">
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
            Frequently Asked Questions
          </GradientText>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Got questions? We've got answers. Find everything you need to know about PoliSense.AI
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              key={index} 
              className={`glass-panel rounded-xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'border-cyan-500/30 bg-white/[0.05]' : ''}`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-white/[0.02] transition-colors"
              >
                <span className="font-semibold text-white pr-4 text-lg font-['Clash_Grotesk']">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-colors ${openIndex === index ? 'text-cyan-400' : 'text-gray-400'}`} />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      ease: "easeInOut",
                      opacity: { duration: 0.2 }
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2">
                      <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-6">Still have questions?</p>
          <Link to='/contact' className="relative group inline-block overflow-hidden rounded-full p-[1px]">
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500 rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-gradient"></span>
            <div className="relative bg-black px-8 py-3 rounded-full transition-all duration-300 group-hover:bg-transparent">
              <span className="text-sm font-semibold text-white">Contact Support</span>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;

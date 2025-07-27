import React, { useState } from 'react'
import GradientText from '@/animations/GradientText'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "What file formats do you support?",
      answer: "We support PDF files, Microsoft Word documents (DOCX), and email files. Our AI can extract and analyze text from all these formats with high accuracy."
    },
    {
      question: "How secure is my data?",
      answer: "Your data security is our top priority. We use secure file processing with validation, database security with MongoDB, and CORS protection. Your documents remain exclusively yours and are processed with enterprise-grade security measures."
    },
    {
      question: "Which languages can you analyze?",
      answer: "We support over 100+ languages including English, Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Korean, Hindi, Arabic, Russian, and many more. Our AI is powered by Google's Gemini Flash for accurate multilingual analysis."
    },
    {
      question: "How long does document processing take?",
      answer: "Most documents are processed within seconds to a few minutes, depending on the file size and complexity. Our AI provides real-time analysis and insights as soon as processing is complete."
    },
    {
      question: "Is there a file size limit?",
      answer: "We can handle documents of various sizes. For optimal performance, we recommend files under 50MB. Larger documents may take slightly longer to process but are fully supported."
    },
    {
      question: "Can I integrate this with my existing workflow?",
      answer: "Yes! Our API allows for seamless integration with your existing systems. Contact our team to discuss custom integration options for your specific workflow needs."
    },
    {
      question: "Do you store my documents?",
      answer: "We prioritize your privacy. Documents are processed securely and we maintain strict data handling policies. Your files are used only for analysis and are handled according to our privacy policy."
    },
    {
      question: "What kind of insights can I expect?",
      answer: "Our AI provides comprehensive document analysis including key information extraction, summaries, entity recognition, sentiment analysis, and actionable insights tailored to your document type."
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className='min-h-screen  text-white py-24 px-12'>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <GradientText
            
            animationSpeed={8}
            showBorder={false}
            className="text-4xl md:text-5xl mx-auto font-bold mb-6"
          >
            Frequently Asked Questions
          </GradientText>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Got questions? We've got answers. Find everything you need to know about PoliSense.AI
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-800/50 transition-colors"
              >
                <span className="font-semibold text-white pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <FaChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
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
                    <div className="px-6 pb-4">
                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">Still have questions?</p>
          <Link to='/contact'>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all">
            Contact Support
          </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FAQ

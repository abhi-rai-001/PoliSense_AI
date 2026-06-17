/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import React from 'react';
import Card from './Card';
import { FileText, FileBadge, Mail } from 'lucide-react';
import GradientText from '@/animations/GradientText';

const Info = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="py-24 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <GradientText className="text-4xl md:text-5xl font-bold mb-6 font-['Clash_Grotesk'] tracking-tight mx-auto">
            Universal Document Support
          </GradientText>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Extract intelligent insights from multiple formats with our enterprise-grade processing engine.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Main featured card spanning 2 columns on tablet/desktop (optional, here doing 3 equal columns but can span) */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <Card 
              icon={<FileText className="w-7 h-7" />}
              title="PDF Documents"
              description="Upload and analyze complex PDF documents including contracts, reports, research papers, and legal documents. Our AI maintains structural awareness to provide highly accurate contextual summaries."
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card 
              icon={<FileBadge className="w-7 h-7" />}
              title="Word Files (DOCX)"
              description="Process Microsoft Word documents with advanced text analysis capabilities. Extract structured data from proposals, manuscripts, and business reports while understanding formatting context."
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card 
              icon={<Mail className="w-7 h-7" />}
              title="Email Threads"
              description="Parse and analyze email communications (.eml) including attachments and complex thread conversations. Identify key stakeholders, extract action items, and understand communication sentiment."
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Info;

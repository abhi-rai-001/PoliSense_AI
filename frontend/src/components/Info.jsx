import React from 'react'
import Card from './Card'
import { HiDocumentText, HiDocument, HiEnvelope } from 'react-icons/hi2'

const Info = () => {
  return (
    <section className="min-h-screen text-white  px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-semibold mb-8 text-gray-100">
            What we offer?
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            You can upload files in any of the format below
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-16 justify-items-center">
          <Card 
            icon={<HiDocumentText className="w-16 h-16 text-gray-300" />}
            title="PDF Files"
            description="Upload and analyze complex PDF documents including contracts, reports, research papers, and legal documents. Our AI extracts key information and provides comprehensive summaries."
          />
          
          <Card 
            icon={<HiDocument className="w-16 h-16 text-gray-300" />}
            title="DOCX"
            description="Process Microsoft Word documents with advanced text analysis capabilities. Extract structured data from proposals, manuscripts, and business reports while maintaining formatting context."
          />
          
          <Card 
            icon={<HiEnvelope className="w-16 h-16 text-gray-300" />}
            title="Email"
            description="Parse and analyze email communications including attachments and thread conversations. Identify key stakeholders, extract action items, and understand communication patterns."
          />
        </div>
      </div>
    </section>
  )
}

export default Info

import React from "react";
import { motion } from "framer-motion";
import { Element, Link as ScrollLink } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";
import myHeroImage from "../assets/myHeroImage.png";


export default function LandingPage() {
  return (
    <div className="min-h-screen text-gray-800 flex flex-col animate-gradient">
      {/* Navbar */}
      <header className="w-full px-8 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
        <div className="text-xl font-bold">PoliSense_AI</div>
        <nav className="hidden md:flex gap-8 text-gray-700">
  <ScrollLink to="products" smooth duration={500} className="cursor-pointer hover:text-purple-600">
    Products
  </ScrollLink>
  <ScrollLink to="features" smooth duration={500} className="cursor-pointer hover:text-purple-600">
    Features
  </ScrollLink>
  <ScrollLink to="pricing" smooth duration={500} className="cursor-pointer hover:text-purple-600">
    Pricing
  </ScrollLink>
  <ScrollLink to="contact" smooth duration={500} className="cursor-pointer hover:text-purple-600">
    Contact Us
  </ScrollLink>
</nav>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold">
          Start Free Trial
        </button>
      </header>

      {/* Hero Section */}
      <Element name="products">
        <section className="relative flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-8 py-20 gap-12">
          {/* SVG Blob */}
          <svg
            className="absolute left-0 top-0 w-full h-full opacity-10"
            viewBox="0 0 800 800"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6EE7B7" />
                <stop offset="100%" stopColor="#A78BFA" />
              </linearGradient>
            </defs>
            <circle cx="400" cy="400" r="300" fill="url(#grad1)" />
          </svg>

          {/* Hero Text */}
          <div className="relative z-10 flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Intelligent Assistant for Document Analysis and Insights
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Leverage AI to extract, organize, and interpret key information from complex documents.
            </p>
            <RouterLink to="/upload">
  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold">
    Get Started →
  </button>
</RouterLink>

          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10 flex-1 flex justify-center"
          >
            <img
              src={myHeroImage}
              alt="AI Assistant"
              className="w-full max-w-md rounded-lg shadow-lg"
            />
          </motion.div>
        </section>
      </Element>

      {/* Features Section */}
      <Element name="features">
        <section className="py-20 px-8 max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Features</h2>
          <p className="text-gray-700 mb-12">
            Smart extraction, semantic search, explainable AI decisions & more.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">Semantic Search</h3>
              <p className="text-gray-700 text-sm">
                Understands your questions beyond keywords to find the exact clause.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">Structured Output</h3>
              <p className="text-gray-700 text-sm">
                Clear JSON decisions you can trace and audit.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">Explainability</h3>
              <p className="text-gray-700 text-sm">
                Shows why it made each decision, linked to clauses.
              </p>
            </div>
          </div>
        </section>
      </Element>

      {/* Pricing Section */}
      <Element name="pricing">
        <section className="py-20 px-8 max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing</h2>
          <p className="text-gray-700 mb-12">
            Start free and upgrade as you grow.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <p className="text-gray-700 mb-4">
                Basic features to explore PoliSense_AI.
              </p>
              <p className="text-2xl font-bold mb-4">$0</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full">
                Start Free
              </button>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-gray-700 mb-4">
                Advanced AI analysis & larger docs.
              </p>
              <p className="text-2xl font-bold mb-4">$29/mo</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full">
                Get Pro
              </button>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-lg shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <p className="text-gray-700 mb-4">
                Custom solutions & dedicated support.
              </p>
              <p className="text-2xl font-bold mb-4">Contact us</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full">
                Contact Sales
              </button>
            </div>
          </div>
        </section>
      </Element>

      {/* Get Started / What we offer */}
      <Element name="get-started">
        <section className="py-20 px-8 max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What we offer?</h2>
          <p className="text-gray-700 mb-12">Upload PDF, DOCX or Emails.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-lg shadow hover:shadow-md transition">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-2">PDF Files</h3>
              <p className="text-gray-700 text-sm">Upload policies, contracts, and more.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-lg shadow hover:shadow-md transition">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">DOCX</h3>
              <p className="text-gray-700 text-sm">Upload Word documents easily.</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-lg shadow hover:shadow-md transition">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-700 text-sm">Parse and analyze emails instantly.</p>
            </div>
          </div>
        </section>
      </Element>

      {/* Contact Section */}
      <Element name="contact">
        <section className="py-20 px-8 max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-8">Have questions? Reach out below.</p>
          <form className="max-w-xl mx-auto space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border focus:ring-2 focus:ring-purple-500"
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border focus:ring-2 focus:ring-purple-500"
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold"
            >
              Send Message
            </button>
          </form>
        </section>
      </Element>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} PoliSense_AI. All rights reserved.
      </footer>
    </div>
  );
}

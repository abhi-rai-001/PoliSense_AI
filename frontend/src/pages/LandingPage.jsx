import React from "react";
import { Element, Link as ScrollLink } from "react-scroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";



export default function LandingPage() {
  return (
    <div className="min-h-screen text-gray-800 flex flex-col bg-white">


      <Navbar/>
      <Hero/>
     


      
    
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
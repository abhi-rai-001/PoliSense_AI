import React from 'react';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { Link, Element, animateScroll as scroll } from 'react-scroll';

export default function LandingPage() {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white overflow-x-hidden">
      {/* Purple Sparkles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: "#00000000" },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              resize: true,
            },
            modes: {
              repulse: { distance: 100, duration: 0.4 },
            },
          },
          particles: {
            color: { value: "#a855f7" },
            links: {
              color: "#a855f7",
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            move: { enable: true, speed: 1 },
            number: {
              density: { enable: true, area: 800 },
              value: 60,
            },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 -z-10"
      />

      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute inset-0 bg-purple-700 blur-3xl opacity-20 -z-10"
        />

        <motion.h1
          className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 drop-shadow-[0_0_20px_rgba(168,85,247,1)]"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          PoliSense<span className="text-purple-400">_AI</span>
        </motion.h1>

        <motion.p
          className="max-w-2xl text-lg md:text-xl mb-12 text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Decode policies, contracts & emails into clear decisions.
          Understand, decide & explain — instantly.
        </motion.p>

        <motion.div
          whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(168,85,247,0.8)" }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="get-started"
            smooth={true}
            duration={500}
            className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-2xl text-lg font-semibold shadow-lg shadow-purple-700/40 transition-all duration-300"
          >
            Get Started
          </Link>
        </motion.div>
      </section>

      {/* ABOUT SECTION */}
      <Element name="about">
        <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.7)]">
            About PoliSense_AI
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            PoliSense_AI uses cutting-edge Large Language Models to understand your policies, contracts,
            or emails. It extracts key information, matches it with relevant rules, and gives you clear,
            structured answers with full traceability. Save hours of manual searching and eliminate errors
            in compliance or claims processing.
          </p>
        </section>
      </Element>

      {/* GET STARTED SECTION */}
      <Element name="get-started">
        <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.7)]">
            Get Started
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-8">
            Ready to experience PoliSense_AI? Soon, you’ll be able to upload your policy documents,
            contracts, or emails right here and get an instant decision with a clear explanation.
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-2xl text-lg font-semibold shadow-lg shadow-purple-700/40 transition-all duration-300 cursor-not-allowed">
            Upload (Coming Soon)
          </button>
        </section>
      </Element>

      {/* CONTACT SECTION */}
      <Element name="contact">
        <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.7)]">
            Contact Us
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Have questions or want to collaborate? Reach out!
          </p>
          <form className="max-w-xl mx-auto space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            ></textarea>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-2xl text-lg font-semibold shadow-lg shadow-purple-700/40 transition-all duration-300"
            >
              Send Message
            </button>
          </form>
        </section>
      </Element>

      {/* FOOTER */}
      <footer className="py-8 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} PoliSense_AI. All rights reserved.
      </footer>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import GradientText from "../animations/GradientText";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black py-10 text-white">
      {/* Main Content */}
      <main className="px-8 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={8}
              showBorder={false}
              className="text-4xl mx-auto md:text-5xl font-bold mb-6"
            >
              About Us
            </GradientText>
            <p className="text-xl text-gray-400">
              Revolutionizing document analysis with AI-powered insights
            </p>
          </div>

          {/* Content Sections - Template */}
          <div className="space-y-12">
            {/* Mission Section */}
            <section className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={8}
                showBorder={false}
                className="text-2xl font-bold mb-4"
              >
                Our Mission
              </GradientText>
              <div className="h-32 bg-gray-800/50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 italic">Content to be added...</p>
              </div>
            </section>

            {/* Vision Section */}
            <section className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={8}
                showBorder={false}
                className="text-2xl font-bold mb-4"
              >
                Our Vision
              </GradientText>
              <div className="h-32 bg-gray-800/50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 italic">Content to be added...</p>
              </div>
            </section>

            {/* Team Section */}
            <section className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={8}
                showBorder={false}
                className="text-2xl font-bold mb-4"
              >
                Our Team
              </GradientText>
              <div className="h-48 bg-gray-800/50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 italic">Team information to be added...</p>
              </div>
            </section>

            {/* Technology Section */}
            <section className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={8}
                showBorder={false}
                className="text-2xl font-bold mb-4"
              >
                Our Technology
              </GradientText>
              <div className="h-32 bg-gray-800/50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 italic">Technology details to be added...</p>
              </div>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

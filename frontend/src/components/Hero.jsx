import React from "react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import GradientText from "../animations/GradientText";

const Hero = () => {
  return (
    <div className=" z-1 h-screen flex px-10 mx-auto hero-container ">
      <section className="relative flex flex-col md:flex-row items-center justify-between max-w-1/2 p-20 gap-12">
        {/* Hero Text */}
        <div className="relative z-10 flex-1">
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={10}
            showBorder={false}
            className="text-7xl md:text-5xl font-bold mb-5  mix-blend-color-burn"
          >
            {" "}
            Your Intelligent Assistant for Document Analysis and Insights
          </GradientText>

          <p className="text-xl text-gray-600 mb-8">
            {" "}
            Leverage AI to extract, organize, and interpret key information from
            complex documents.
          </p>

          <RouterLink to="/upload">
            <button className="active">Get Started →</button>
          </RouterLink>
        </div>
      </section>
      <section className="max-w-1/2 mx-auto flex items-center justify-between">
        {/* Hero Image */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 flex-1 flex justify-center"
        >
          <img
            src="/Chat_with_AI.svg"
            alt="AI Assistant"
            className="w-full max-w-xl "
          />
        </motion.div>
      </section>




    </div>
  );
};

export default Hero;

import React from "react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import GradientText from "../animations/GradientText";
import SplashCursor from '../animations/Splash'
import Threads from '@/animations/Thread';

const Hero = () => {
  return (
    <>
<div className="z-1 absolute top-0 w-full h-screen ">
  <Threads
    amplitude={1}
    distance={0}
    enableMouseInteraction={true}
    
  />
</div>
    <div className="relative z-1 p-90 flex px-10 mx-auto overflow-hidden">

      <div className="absolute inset-0 z-50 pointer-events-none">
        {/* <SplashCursor
        SPLAT_RADIUS={0.07}/> */}
      </div>
      <section className="relative flex flex-col md:flex-row items-center justify-between max-w-[85vw] gap-12">
        {/* Hero Text */}
        <div className="relative z-1 flex-1">
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={10}
            showBorder={false}
            className="text-7xl text-center font-bold mb-5  mix-blend-color-burn"
          >
            {" "}
            Your Intelligent Assistant for Document Analysis and Insights
          </GradientText>

          <p className="text-3xl mx-auto text-center pt-20 text-white mb-8">
            {" "}
            Leverage AI to extract, organize, and interpret key information from
            complex documents.
          </p>

          <RouterLink to="/upload" >
          <div className=" w-full flex justify-center pt-15 ">
            <button className="active ">Get Started →</button>
            </div>
          </RouterLink>
        </div>
      </section>
    
 




    </div>
    </>
  );
};

export default Hero;

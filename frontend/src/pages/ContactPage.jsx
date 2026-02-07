import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { FaEnvelope, FaInstagram, FaLinkedin, FaMapMarkerAlt } from "react-icons/fa";
import GradientText from "../animations/GradientText";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black py-10 text-white">
      {/* Main Content */}
      <main className="px-8 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={8}
              showBorder={false}
              className="text-4xl mx-auto md:text-5xl font-bold mb-6"
            >
              Contact Us
            </GradientText>
            <p className="text-xl text-gray-400">
              Get in touch with our team. We'd love to hear from you!
            </p>
          </div>

          <div className="grid md:grid-cols-1 gap-12 max-w-4xl mx-auto">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Contact Details */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 text-center">
                <GradientText
                  colors={["#40ffaa", "#4079ff", "#40ffaa"]}
                  animationSpeed={8}
                  showBorder={false}
                  className="text-2xl font-bold mb-6 mx-auto"
                >
                  Get in Touch
                </GradientText>
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <FaEnvelope className="w-5 h-5 text-blue-400 mr-4" />
                    <span className="text-gray-300">raiabhinav182@gmail.com</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <FaMapMarkerAlt className="w-5 h-5 text-blue-400 mr-4" />
                    <span className="text-gray-300">Pune, India</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-800/30">
                  <p className="text-sm text-blue-300">
                    💬 We'll get back to you as soon as possible!
                  </p>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 text-center">
                <GradientText
                  colors={["#40ffaa", "#4079ff", "#40ffaa"]}
                  animationSpeed={8}
                  showBorder={false}
                  className="text-xl font-bold mb-6 mx-auto"
                >
                  Connect With Us
                </GradientText>
                <p className="text-gray-400 mb-6 text-sm">
                  Follow us on social media for updates and connect directly with our team!
                </p>
                <div className="flex space-x-4 justify-center">
                  <a
                    href="https://www.instagram.com/its_abhinavrai?igsh=MWo2eGQxcDlmMTg1bQ%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full hover:scale-110 transition-transform group"
                  >
                    <FaInstagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/abhinav-rai-2611a8259?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-700 text-white p-3 rounded-full hover:scale-110 transition-transform group"
                  >
                    <FaLinkedin className="w-5 h-5" />
                  </a>
                </div>
            
              </div>
            </motion.div>
          </div>

          {/* Additional CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16 p-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl border border-gray-700"
          >
            <h3 className="text-2xl font-bold mb-4">
              <GradientText
                colors={["#40ffaa", "#4079ff"]}
                animationSpeed={6}
                showBorder={false}
                className=" mx-auto"
              >
                Ready to Get Started?
              </GradientText>
            </h3>
            <p className="text-gray-300 mb-6">
              Don't have a question but want to try PoliSense.AI? Start analyzing your documents today!
            </p>
            <Link
              to="/upload"
              className="inline-block bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              Try PoliSense.AI Now
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

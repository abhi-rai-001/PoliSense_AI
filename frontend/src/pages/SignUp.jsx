import { useState } from "react";
import { SignUp } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";


import GradientText from "../animations/GradientText";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        {/* Main gradient orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-green-400/15 via-emerald-500/10 to-teal-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/15 via-cyan-400/10 to-indigo-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/8 via-violet-600/5 to-fuchsia-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Additional ambient effects */}
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-green-400/8 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 right-1/3 w-48 h-48 bg-blue-400/6 rounded-full blur-2xl"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3b82f6,transparent)] opacity-5"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-8 py-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-white/80 hover:text-white transition-all duration-300 group"
        >
          <svg className="w-6 h-6 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Back to Home</span>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-8">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="opacity-0 animate-[scaleIn_0.6s_ease-out_0.2s_forwards]">
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={8}
                showBorder={false}
                className="text-5xl md:text-6xl lg:text-7xl mx-auto font-bold mb-6 leading-tight font-tan-kulture   uppercase"
                
              >
                Join Us
              </GradientText>
            </div>
            <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed opacity-0 animate-[fadeInUp_0.6s_ease-out_0.4s_forwards]">
              Create your account and start analyzing documents with advanced AI technology
            </p>
          </div>

          {/* Sign Up Form - Centered */}
          <div className="flex justify-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-lg"
            >
              {/* Clerk Sign Up Component */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-1">
                  <SignUp 
                    path="/sign-up" 
                    routing="path" 
                    signInUrl="/sign-in"
                    appearance={{
                      baseTheme: "dark",
                      layout: {
                        socialButtonsPlacement: "top",
                        socialButtonsVariant: "blockButton"
                      },
                      elements: {
                        rootBox: "w-full",
                        card: "bg-transparent shadow-none border-none w-full",
                        headerTitle: "text-white text-2xl font-bold",
                        headerSubtitle: "text-gray-400",
                        socialButtonsBlockButton: "bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50 transition-all duration-200",
                        socialButtonsBlockButtonText: "text-white font-medium",
                        formButtonPrimary: "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg",
                        formFieldInput: "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500 transition-colors",
                        formFieldLabel: "text-gray-300 font-medium",
                        footerActionLink: "text-green-400 hover:text-green-300 transition-colors",
                        dividerLine: "bg-gray-700",
                        dividerText: "text-gray-500",
                        formFieldInputShowPasswordButton: "text-gray-400 hover:text-white",
                        identityPreviewText: "text-gray-300",
                        identityPreviewEditButton: "text-green-400 hover:text-green-300"
                      }
                    }}
                  />
                </div>
              </div>

            </motion.div>
          </div>

          {/* Features Preview */}
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-white text-xl font-semibold mb-3">Unlock Premium Features</h3>
              <p className="text-gray-500 text-sm">Everything you need for intelligent document analysis</p>
            </div>
            
            <div className="grid grid-cols-3 gap-8 mb-8">
              {[
                {
                  icon: "🤖",
                  title: "Advanced AI Analysis",
                  description: "Powered by cutting-edge ML algorithms"
                },
                {
                  icon: "📄",
                  title: "Universal File Support",
                  description: "PDF, DOCX, emails, 20+ formats"
                },
                {
                  icon: "🌍",
                  title: "Global Language Support",
                  description: "100+ languages processed accurately"
                },
                {
                  icon: "🔒",
                  title: "Enterprise Security",
                  description: "Bank-grade encryption, zero retention"
                },
                {
                  icon: "⚡",
                  title: "Lightning Fast",
                  description: "Get insights in seconds, not hours"
                },
                {
                  icon: "📊",
                  title: "Detailed Analytics",
                  description: "Comprehensive reports & insights"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-900/40 border border-gray-800/50 hover:border-green-500/30 hover:bg-gray-900/60 transition-all duration-300"
                >
                  <div className="text-2xl mb-3">{feature.icon}</div>
                  <h4 className="text-white font-semibold text-sm mb-2">{feature.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-gray-800">
              <div className="flex justify-center items-center space-x-12">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-500 font-medium">SOC 2 Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-500 font-medium">GDPR Ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-xs text-gray-500 font-medium">99.9% Uptime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

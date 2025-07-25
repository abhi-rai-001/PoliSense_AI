import { SignIn } from "@clerk/clerk-react";
import GradientText from "../animations/GradientText";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-8 py-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-white hover:text-gray-300 transition-colors"
        >
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <GradientText
              colors={["#40ffaa", "#4079ff", "#40ffaa"]}
              animationSpeed={8}
              showBorder={false}
              className="text-4xl md:text-5xl mx-auto font-bold mb-4"
            >
              Welcome Back
            </GradientText>
            <p className="text-gray-400 text-lg">
              Sign in to continue your AI-powered document analysis
            </p>
          </div>

          {/* Clerk Sign In Component */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-1">
              <SignIn 
                path="/sign-in" 
                routing="path" 
                signUpUrl="/sign-up"
                redirectUrl="/upload"
                afterSignInUrl="/upload"
                appearance={{
                  baseTheme: "dark",
                  layout: {
                    socialButtonsPlacement: "bottom",
                    socialButtonsVariant: "blockButton"
                  },
                  elements: {
                    rootBox: "w-full",
                    card: "bg-transparent shadow-none border-none w-full",
                    headerTitle: "text-white text-2xl font-bold",
                    headerSubtitle: "text-gray-400",
                    socialButtonsBlockButton: "bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50 transition-all duration-200",
                    socialButtonsBlockButtonText: "text-white font-medium",
                    formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg",
                    formFieldInput: "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 transition-colors",
                    formFieldLabel: "text-gray-300 font-medium",
                    footerActionLink: "text-blue-400 hover:text-blue-300 transition-colors",
                    dividerLine: "bg-gray-700",
                    dividerText: "text-gray-500",
                    formFieldInputShowPasswordButton: "text-gray-400 hover:text-white",
                    identityPreviewText: "text-gray-300",
                    identityPreviewEditButton: "text-blue-400 hover:text-blue-300"
                  }
                }}
              />
            </div>
          </div>

          {/* Additional Links */}
       
        </motion.div>
      </div>
    </div>
  );
}

import { SignIn } from "@clerk/clerk-react";
import GradientText from "../animations/GradientText";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <nav className="relative z-10 px-8 py-6">
        <Link to="/" className="inline-flex items-center text-white hover:text-gray-300 transition-colors">
          ← Back to Home
        </Link>
      </nav>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
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

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-1">
              <SignIn
                path="/sign-in"
                routing="path"
                signUpUrl="/sign-up"
                fallbackRedirectUrl="/upload"
                forceRedirectUrl="/upload"
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
                    formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg",
                    formFieldInput: "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 transition-colors",
                    formFieldLabel: "text-gray-300 font-medium",
                  }
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { signInWithGoogle } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import GradientText from "../animations/GradientText";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  // Redirect if already signed in
  React.useEffect(() => {
    if (isSignedIn) {
      navigate("/upload");
    }
  }, [isSignedIn, navigate]);

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError("");
    
    try {
      await signInWithGoogle();
      navigate("/upload");
    } catch (error) {
      console.error("Sign-up error:", error);
      setError("Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-4 sm:px-6 md:px-8">
        <div className="w-full max-w-4xl lg:max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="opacity-0 animate-[scaleIn_0.6s_ease-out_0.2s_forwards]">
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={8}
                showBorder={false}
                className="text-5xl md:text-6xl lg:text-7xl mx-auto font-bold mb-6 leading-tight font-tan-kulture uppercase"
              >
                Join Us
              </GradientText>
            </div>
            <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed opacity-0 animate-[fadeInUp_0.6s_ease-out_0.4s_forwards]">
              Create your account and start analyzing documents with advanced AI technology
            </p>
          </div>

          {/* Sign Up Form - Centered */}
          <div className="flex justify-center mb-8 sm:mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-sm sm:max-w-md md:max-w-lg"
            >
              {/* Firebase Sign Up Component */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                  {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                      {error}
                    </div>
                  )}
                  
                  <button
                    onClick={handleGoogleSignUp}
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-3 bg-white text-gray-900 hover:bg-gray-100 transition-all duration-200 rounded-lg px-6 py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span>Continue with Google</span>
                      </>
                    )}
                  </button>

                  <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm">
                      Already have an account?{" "}
                      <Link to="/sign-in" className="text-green-400 hover:text-green-300 transition-colors">
                        Sign in
                      </Link>
                    </p>
                  </div>
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8">
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

/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GradientText from "../animations/GradientText";
import { signInWithEmail } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isSignedIn, loginAsDev } = useAuth();

  // Redirect if already signed in
  React.useEffect(() => {
    if (isSignedIn) {
      navigate("/upload");
    }
  }, [isSignedIn, navigate]);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await signInWithEmail(email, password);
      navigate("/upload");
    } catch (error) {
      console.error("Sign-in error:", error);
      setError(error.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDevLogin = () => {
    loginAsDev();
    navigate("/upload");
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Aurora */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-3xl"></div>
      </div>

      <nav className="relative z-10 px-8 py-6">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </nav>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm sm:max-w-md"
        >
          <div className="text-center mb-8">
            <GradientText
              className="text-4xl md:text-5xl mx-auto font-bold mb-4 font-['Clash_Grotesk'] tracking-tight"
            >
              Welcome Back
            </GradientText>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">
              Sign in to continue your AI-powered document analysis
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-violet-600/20 rounded-2xl blur-xl"></div>
            <div className="relative glass-panel rounded-2xl p-6 sm:p-8">
              {error && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-center gap-3">
                  <span className="shrink-0">⚠️</span>
                  {error}
                </div>
              )}
              
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5" htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5" htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 flex items-center justify-center space-x-3 bg-white text-gray-900 hover:bg-gray-100 transition-all duration-300 rounded-xl px-6 py-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl shadow-white/5"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center border-t border-white/5 pt-6">
                <p className="text-gray-400 text-sm">
                  Don't have an account?{" "}
                  <Link to="/sign-up" className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
            {/* Dev Login hidden visually but functional for keyboard users or specific clicks if needed */}
            <div className="mt-4 text-center">
              <button 
                onClick={handleDevLogin}
                className="opacity-0 focus:opacity-100 hover:opacity-100 text-gray-600 text-xs transition-opacity"
                tabIndex={-1}
              >
                (Dev Login)
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
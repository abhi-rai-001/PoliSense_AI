import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUpWithEmail } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import GradientText from "../animations/GradientText";
import { ArrowLeft, BrainCircuit, FileType2, Globe2, ShieldCheck, Zap, BarChart3 } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await signUpWithEmail(email, password);
      navigate("/upload");
    } catch (error) {
      console.error("Sign-up error:", error);
      setError(error.message || "Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <BrainCircuit className="w-6 h-6 text-violet-400" />,
      title: "Advanced AI Analysis",
      description: "Powered by cutting-edge ML algorithms"
    },
    {
      icon: <FileType2 className="w-6 h-6 text-cyan-400" />,
      title: "Universal File Support",
      description: "PDF, DOCX, emails, 20+ formats"
    },
    {
      icon: <Globe2 className="w-6 h-6 text-emerald-400" />,
      title: "Global Language Support",
      description: "100+ languages processed accurately"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-cyan-500" />,
      title: "Enterprise Security",
      description: "Bank-grade encryption, zero retention"
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Lightning Fast",
      description: "Get insights in seconds, not hours"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-rose-400" />,
      title: "Detailed Analytics",
      description: "Comprehensive reports & insights"
    }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-cyan-400/10 via-emerald-500/5 to-teal-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-gradient-to-tr from-violet-500/10 via-cyan-400/5 to-indigo-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 via-violet-600/5 to-fuchsia-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-8 py-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-400 hover:text-white transition-all duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4 sm:px-6 md:px-8 py-10">
        <div className="w-full max-w-4xl lg:max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <GradientText
                className="text-5xl md:text-6xl lg:text-7xl mx-auto font-bold mb-6 font-['Clash_Grotesk'] tracking-tight"
              >
                Join Us
              </GradientText>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed"
            >
              Create your account and start analyzing documents with advanced AI technology
            </motion.p>
          </div>

          {/* Sign Up Form - Centered */}
          <div className="flex justify-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full max-w-sm sm:max-w-md md:max-w-lg"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 rounded-2xl blur-xl"></div>
                <div className="relative glass-panel rounded-2xl p-6 sm:p-8">
                  {error && (
                    <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-center gap-3">
                      <span className="shrink-0">⚠️</span>
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleEmailSignUp} className="space-y-4">
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
                        placeholder="Create a password"
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
                        <span>Create Account</span>
                      )}
                    </button>
                  </form>

                  <div className="mt-8 text-center border-t border-white/5 pt-6">
                    <p className="text-gray-400 text-sm">
                      Already have an account?{" "}
                      <Link to="/sign-in" className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Features Preview */}
          <div className="max-w-7xl mx-auto mb-10">
            <div className="text-center mb-10">
              <h3 className="text-white text-2xl font-semibold mb-3 font-['Clash_Grotesk']">Unlock Premium Features</h3>
              <p className="text-gray-400 text-sm">Everything you need for intelligent document analysis</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center p-6 rounded-2xl glass-panel glass-panel-hover"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 border-t border-white/10">
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">SOC 2 Compliant</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">GDPR Ready</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">99.9% Uptime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

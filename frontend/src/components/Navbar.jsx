import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GeometricLogo from './GeometricLogo';
import { useAuth } from '../contexts/AuthContext';
import { signOutUser } from '../lib/supabase';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { isSignedIn, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 bg-black/60 backdrop-blur-xl border-b border-white/5 shadow-lg' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group"> 
          <GeometricLogo className="w-10 h-10 transition-transform duration-500 group-hover:scale-110" />
          <span className="font-['Clash_Grotesk'] font-bold tracking-wide text-xl uppercase text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-violet-500 transition-all duration-300">
            Polisense
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`text-sm font-medium transition-colors hover:text-white ${
                  location.pathname === link.path ? 'text-white' : 'text-gray-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center border-l border-white/10 pl-8 ml-2">
            {!isSignedIn ? (
              <Link to="/sign-in" className="relative group overflow-hidden rounded-full p-[1px]">
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500 rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-gradient"></span>
                <div className="relative bg-black/80 backdrop-blur-sm px-6 py-2 rounded-full transition-all duration-300 group-hover:bg-transparent">
                  <span className="text-sm font-semibold text-white">Login</span>
                </div>
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/5 rounded-full py-1 px-3 border border-white/10">
                  {user?.photoURL && (
                    <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full" />
                  )}
                  <span className="text-xs font-medium text-gray-300">{user?.displayName?.split(' ')[0] || 'User'}</span>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="text-xs font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-black/95 backdrop-blur-xl border-b border-white/10 absolute top-full left-0 right-0"
          >
            <div className="px-6 py-6 flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`text-lg font-medium transition-colors ${
                    location.pathname === link.path ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-white/10">
                {!isSignedIn ? (
                  <Link to="/sign-in" className="w-full block text-center bg-white text-black py-3 rounded-lg font-semibold">
                    Login
                  </Link>
                ) : (
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-3">
                      {user?.photoURL && (
                        <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-white/20" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-white">{user?.displayName || 'User'}</div>
                        <div className="text-xs text-gray-400">{user?.email}</div>
                      </div>
                    </div>
                    <button 
                      onClick={handleSignOut}
                      className="w-full bg-white/10 hover:bg-white/20 transition-colors text-white py-3 rounded-lg font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;

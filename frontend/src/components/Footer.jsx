import React from 'react';
import { Link } from 'react-router-dom';
import GeometricLogo from './GeometricLogo';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-[#050508] pt-20 pb-10 px-6 overflow-hidden">
      {/* Decorative top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-1 lg:col-span-5">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <GeometricLogo className="w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity" />
              <span className="font-['Clash_Grotesk'] font-bold tracking-wide text-xl uppercase text-white group-hover:text-cyan-400 transition-colors">
                Polisense
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-8">
              Advanced AI document analysis platform for professionals. Extract intelligent insights from PDFs, Word files, and emails in seconds.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="col-span-1 lg:col-span-2 lg:col-start-7">
            <h4 className="text-white font-semibold font-['Clash_Grotesk'] mb-6 uppercase tracking-wider text-sm">Product</h4>
            <ul className="space-y-4">
              <li><Link to="/upload" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Upload Document</Link></li>
              <li><Link to="/#features" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Features</Link></li>
              <li><Link to="/#security" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Security</Link></li>
              <li><Link to="/#languages" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Languages</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-white font-semibold font-['Clash_Grotesk'] mb-6 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Contact</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-white font-semibold font-['Clash_Grotesk'] mb-6 uppercase tracking-wider text-sm">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} PoliSense.AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Built with</span>
            <span className="text-rose-500 animate-pulse">❤</span>
            <span>by the PoliSense Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

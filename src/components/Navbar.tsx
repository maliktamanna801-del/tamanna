import React, { useState } from 'react';
import { Menu, X, Rocket, Download, Volume2, VolumeX, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  isMusicPlaying: boolean;
  toggleMusic: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  isMusicPlaying,
  toggleMusic
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'certificates', label: 'Certifications' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Dashboard' }
  ];

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setIsOpen(false);
  };

  const handleResumeDownload = () => {
    // Generate simulated PDF data link
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'Tamanna_Malik_Resume.pdf';
    alert("Resume download triggered! [Note: Placeholder file initiated for Tamanna Malik]");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-4 py-4 md:px-8">
      <div className="max-w-7xl mx-auto glass-panel px-6 py-3 flex items-center justify-between border-b border-white/5 shadow-glass">
        
        {/* LOGO */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center space-x-2 cursor-pointer group"
        >
          <Rocket className="w-5 h-5 text-cosmic-pink group-hover:rotate-45 transition-transform duration-300" />
          <span className="font-display font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-cosmic-cyan text-lg">
            TAMANNA.DS
          </span>
        </div>

        {/* DESKTOP TABS */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative px-3 py-1.5 text-xs lg:text-sm font-medium tracking-wide transition-all duration-300 rounded-md hover:text-white ${
                activeSection === item.id 
                  ? 'text-white bg-white/10 font-semibold shadow-inner' 
                  : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-cosmic-pink rounded-full shadow-[0_0_8px_#ec4899]" />
              )}
            </button>
          ))}
        </div>

        {/* CONTROLS & RESUME */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Audio toggle */}
          <button
            onClick={toggleMusic}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
            title="Toggle Space Music"
          >
            {isMusicPlaying ? <Volume2 className="w-4 h-4 text-cosmic-cyan" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Admin link */}
          <button
            onClick={() => handleNavClick('admin')}
            className={`p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer ${
              activeSection === 'admin' ? 'text-cosmic-purple border-cosmic-purple/50 bg-white/10' : ''
            }`}
            title="Admin Deck"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>

          {/* Resume button */}
          <button
            onClick={handleResumeDownload}
            className="flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white font-medium text-xs tracking-wider uppercase transition-all duration-300 hover:shadow-neon-purple cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Resume</span>
          </button>
        </div>

        {/* MOBILE TOGGLE */}
        <div className="flex items-center space-x-2 md:hidden">
          <button
            onClick={toggleMusic}
            className="p-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white transition-all mr-1"
          >
            {isMusicPlaying ? <Volume2 className="w-4 h-4 text-cosmic-cyan" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white border border-white/5 transition-all"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <div className="md:hidden mt-2 p-4 glass-panel border border-white/10 shadow-glass animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.id 
                    ? 'bg-gradient-to-r from-cosmic-purple/20 to-cosmic-pink/20 text-white border-l-2 border-cosmic-pink font-semibold' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-white/5 flex flex-col space-y-2">
              <button
                onClick={() => handleNavClick('admin')}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-white/5 ${
                  activeSection === 'admin' ? 'bg-white/10 text-white' : ''
                }`}
              >
                Admin Panel Access
              </button>
              <button
                onClick={handleResumeDownload}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white font-semibold text-xs tracking-wider uppercase"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Resume</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

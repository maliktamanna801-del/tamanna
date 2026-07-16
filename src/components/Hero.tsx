import React, { useEffect, useState } from 'react';
import { ArrowDown, Star, Sparkles, Terminal, Cpu } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  const [quote, setQuote] = useState({ q: "We are all in the gutter, but some of us are looking at the stars.", a: "Oscar Wilde" });
  const [fact, setFact] = useState("The universe contains over 100 billion galaxies, each housing hundreds of billions of stars.");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    // Fetch live random quotes & NASA simulated facts from our secure APIs
    fetch('/api/quote')
      .then(res => res.json())
      .then(data => { if (data.q) setQuote(data); })
      .catch(() => {});

    fetch('/api/nasa')
      .then(res => res.json())
      .then(data => { if (data.explanation) setFact(data.explanation); })
      .catch(() => {});
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 px-4 md:px-8 overflow-hidden z-10 select-none">
      
      {/* Flight HUD Overlay */}
      <div className="absolute inset-x-8 top-28 bottom-12 border border-white/[0.03] pointer-events-none rounded-2xl hidden lg:block">
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-cosmic-pink/40" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-cosmic-purple/40" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-cosmic-cyan/40" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20" />
        
        {/* Horizontal & vertical scales */}
        <div className="absolute top-1/2 left-0 w-4 h-[1px] bg-white/30" />
        <div className="absolute top-1/2 right-0 w-4 h-[1px] bg-white/30" />
        <div className="absolute top-0 left-1/2 w-[1px] h-4 bg-white/30" />
        <div className="absolute bottom-0 left-1/2 w-[1px] h-4 bg-white/30" />

        {/* HUD Data stream readouts */}
        <div className="absolute top-6 left-6 font-mono text-[10px] text-gray-500 space-y-1">
          <div>COSMIC-RELAY: CONNECTED</div>
          <div>SECTOR: SOL-SYS / ORBIT-GRID</div>
          <div>THRUSTERS: AUTO-STABILIZED</div>
        </div>

        <div className="absolute top-6 right-6 font-mono text-[10px] text-gray-500 space-y-1 text-right">
          <div>REACTION ENGINE: ACTIVE</div>
          <div>FPS: 60 / WebGL 2.0</div>
          <div>DATE: 2026.07.16</div>
        </div>
      </div>

      <div className={`max-w-4xl mx-auto text-center space-y-8 transition-all duration-1000 transform ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Orbital greeting tag */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-cosmic-cyan font-mono animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CELESTIAL WORKSPACE DECK ONLINE</span>
        </div>

        {/* Display Typography Title */}
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-tight">
          <span className="text-white block">Hi, I'm</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-cosmic-cyan block font-black pb-2 mt-1">
            Tamanna Malik
          </span>
        </h1>

        {/* Subtitle / Role description */}
        <p className="font-sans font-normal text-gray-300 text-base sm:text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
          Full Stack Developer specializing in <span className="text-cosmic-cyan font-semibold">AI & Data Science</span>. Exploring orbits of responsive frontends, neural intelligence, and complex server solutions.
        </p>

        {/* Daily quote glass card */}
        <div className="glass-panel p-4 max-w-xl mx-auto border-white/5 shadow-glass text-left flex items-start space-x-3.5">
          <div className="p-2 rounded-lg bg-cosmic-purple/10 text-cosmic-purple shrink-0 mt-1">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-mono italic leading-relaxed">
              "{quote.q}"
            </p>
            <p className="text-[10px] text-cosmic-cyan font-mono mt-1 text-right">
              — {quote.a}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onExplore}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-cosmic-cyan text-white font-display font-semibold text-sm tracking-wider uppercase shadow-neon-pink cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Launch System
          </button>
          
          <button
            onClick={() => {
              const el = document.getElementById('about');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-display font-semibold text-sm tracking-wider uppercase hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>Learn More</span>
            <ArrowDown className="w-4 h-4 text-cosmic-cyan" />
          </button>
        </div>

        {/* Astronaut telemetry note */}
        <div className="pt-8 text-center max-w-md mx-auto hidden sm:block">
          <p className="text-[11px] text-gray-500 font-mono tracking-wide uppercase">
            🚀 Dynamic Star Field telemetry responsive to mouse parallax & scrolling
          </p>
          <p className="text-[9px] text-cosmic-purple font-mono italic mt-1">
            Fact: {fact}
          </p>
        </div>

      </div>

      {/* Floating stars accents */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce flex flex-col items-center cursor-pointer opacity-70" onClick={onExplore}>
        <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase mb-1">Scroll Space Flight</span>
        <ArrowDown className="w-4 h-4 text-cosmic-pink" />
      </div>

    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { User, Compass, Server, Calendar, Cpu, Sparkles, Terminal } from 'lucide-react';

export const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bio' | 'timeline' | 'metrics'>('bio');
  const [typingText, setTypingText] = useState('');
  const [typedIndex, setTypedIndex] = useState(0);
  
  const fullSummary = "I am a Full Stack Developer and BCA Student specializing in AI & Data Science. I bridge the gap between elegant UI/UX frontends and robust, secure, production-grade backends. My code focuses on modularity, clean architecture, and fluid performance.";

  useEffect(() => {
    if (activeTab === 'bio') {
      setTypingText('');
      setTypedIndex(0);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'bio' && typedIndex < fullSummary.length) {
      const timeout = setTimeout(() => {
        setTypingText((prev) => prev + fullSummary.charAt(typedIndex));
        setTypedIndex((prev) => prev + 1);
      }, 15);
      return () => clearTimeout(timeout);
    }
  }, [activeTab, typedIndex]);

  const milestones = [
    { year: "2024", title: "BCA Core Launch", role: "AI & Data Science Student", desc: "Initiated rigorous studies in advanced databases, object-oriented Java algorithms, and Python data structures." },
    { year: "2025", title: "GDSC Core Team", role: "AI & Full Stack Lead", desc: "Led workshop sessions on model prompt optimization and scaled full stack Express servers." },
    { year: "2025", title: "Software Intern", role: "Full-Stack Development", desc: "Developed highly responsive dashboard grids and mapped database joins, reducing processing times." },
    { year: "2026", title: "Interactive Portfolio", role: "Next Gen Flight Deck", desc: "Constructed this immersive 3D Three.js orbit platform with modular REST APIs." }
  ];

  const counters = [
    { label: "Active Project Systems", val: "24+", desc: "Node & React builds" },
    { label: "Java & Python Scripts", val: "80+", desc: "Data pipelines & scrapers" },
    { label: "LeetCode Submissions", val: "180+", desc: "Problem solving challenges" },
    { label: "AI Integrations", val: "12+", desc: "Gemini models mapped" }
  ];

  return (
    <section id="about" className="relative min-h-screen py-24 px-4 md:px-8 bg-cosmic-dark/30 z-10 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full space-y-12">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
            ORBITAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-purple to-cosmic-pink">COMMAND STATION</span>
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-cosmic-cyan mx-auto rounded-full shadow-[0_0_8px_#ec4899]" />
          <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mt-2">Space-Station Cockpit view / Bio & Mission Log</p>
        </div>

        {/* Space Station Control Frame */}
        <div className="glass-panel-heavy p-6 md:p-8 border border-white/10 shadow-glass relative grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
          
          {/* Cyber accents decor */}
          <div className="absolute top-2 right-2 flex space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>

          {/* LEFT COLUMN: Profile Holo-Avatar / Status Deck */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-6 border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
            
            {/* Holographic avatar frame */}
            <div className="relative w-44 h-44 rounded-full flex items-center justify-center border-2 border-dashed border-cosmic-cyan p-2 animate-spin-slow">
              <div className="absolute inset-0 bg-cosmic-cyan/5 rounded-full filter blur-md" />
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-cosmic-purple via-cosmic-deep to-cosmic-pink flex items-center justify-center border border-white/10">
                <User className="w-20 h-20 text-white/80" />
              </div>
              <div className="absolute -top-1 -right-1 p-1 bg-cosmic-pink rounded-full text-white text-[9px] font-mono font-bold uppercase tracking-wider animate-bounce">
                Holo-On
              </div>
            </div>

            {/* Astronaut Name & Role */}
            <div className="text-center space-y-1">
              <h3 className="font-display font-bold text-xl text-white tracking-wide">Tamanna Malik</h3>
              <p className="font-mono text-xs text-cosmic-cyan font-semibold tracking-wider uppercase">Full Stack Developer</p>
              <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">BCA (AI & Data Science)</p>
            </div>

            {/* Dashboard Selector Menu */}
            <div className="w-full space-y-2">
              <button
                onClick={() => setActiveTab('bio')}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl border font-mono text-xs tracking-wider uppercase transition-all duration-300 ${
                  activeTab === 'bio'
                    ? 'bg-cosmic-purple/20 border-cosmic-purple text-white shadow-neon-purple'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Compass className="w-4 h-4 text-cosmic-pink" />
                <span>Command Bio</span>
              </button>

              <button
                onClick={() => setActiveTab('timeline')}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl border font-mono text-xs tracking-wider uppercase transition-all duration-300 ${
                  activeTab === 'timeline'
                    ? 'bg-cosmic-pink/20 border-cosmic-pink text-white shadow-neon-pink'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4 text-cosmic-purple" />
                <span>Mission Log</span>
              </button>

              <button
                onClick={() => setActiveTab('metrics')}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl border font-mono text-xs tracking-wider uppercase transition-all duration-300 ${
                  activeTab === 'metrics'
                    ? 'bg-cosmic-cyan/20 border-cosmic-cyan text-white shadow-neon-blue'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Server className="w-4 h-4 text-cosmic-cyan" />
                <span>Station Core</span>
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive Screen View */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
            
            {/* Holographic visualizer stats bar */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cosmic-pink animate-pulse" />
                <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">ACTIVE DIAGNOSTIC SCREEN: {activeTab.toUpperCase()}</span>
              </div>
              <div className="font-mono text-[10px] text-cosmic-cyan">STATION_TEMP: 22°C (STABLE)</div>
            </div>

            {/* TAB CONTENT: Command Bio */}
            {activeTab === 'bio' && (
              <div className="space-y-6 flex-grow">
                <div className="space-y-2">
                  <h4 className="font-display font-semibold text-lg text-white flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-cosmic-pink" />
                    <span>SYSTEM PROTOCOL SUMMARY</span>
                  </h4>
                  <div className="min-h-24 font-mono text-sm text-gray-300 bg-black/40 p-4 rounded-xl border border-white/5 leading-relaxed relative">
                    <span className="text-cosmic-cyan mr-1">$</span>
                    {typingText}
                    <span className="w-1.5 h-4 bg-cosmic-pink inline-block animate-pulse ml-0.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="text-[10px] text-gray-500 font-mono uppercase">Primary Focus</div>
                    <div className="text-xs text-white font-semibold mt-1 flex items-center space-x-1.5">
                      <Cpu className="w-3.5 h-3.5 text-cosmic-cyan" />
                      <span>AI Model Mappings</span>
                    </div>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="text-[10px] text-gray-500 font-mono uppercase">Database Hubs</div>
                    <div className="text-xs text-white font-semibold mt-1 flex items-center space-x-1.5">
                      <Server className="w-3.5 h-3.5 text-cosmic-purple" />
                      <span>MySQL, Mongo, SQLite</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Mission Log (Timeline) */}
            {activeTab === 'timeline' && (
              <div className="space-y-4 flex-grow overflow-y-auto max-h-[300px] pr-2">
                {milestones.map((milestone, idx) => (
                  <div key={idx} className="relative pl-6 border-l border-white/10 space-y-1">
                    {/* Ring timeline anchor */}
                    <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-cosmic-pink border border-white/20 shadow-[0_0_8px_#ec4899]" />
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cosmic-cyan bg-cosmic-cyan/10 px-2 py-0.5 rounded-full">{milestone.year}</span>
                      <span className="font-mono text-[10px] text-gray-500 uppercase">{milestone.role}</span>
                    </div>
                    <h5 className="font-sans font-semibold text-sm text-white">{milestone.title}</h5>
                    <p className="text-xs text-gray-400 font-normal leading-relaxed">{milestone.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: Station Core (Metrics) */}
            {activeTab === 'metrics' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
                {counters.map((item, idx) => (
                  <div key={idx} className="bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 hover:border-cosmic-cyan/20 transition-all duration-300 flex items-start space-x-3 group">
                    <div className="p-2.5 rounded-lg bg-cosmic-cyan/10 text-cosmic-cyan group-hover:bg-cosmic-cyan/20 transition-colors shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-2xl text-white group-hover:text-cosmic-cyan transition-colors">{item.val}</div>
                      <div className="font-sans font-semibold text-xs text-gray-300 mt-0.5">{item.label}</div>
                      <div className="font-mono text-[9px] text-gray-500 uppercase mt-1">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Cockpit Info Readout */}
            <div className="flex flex-wrap items-center justify-between border-t border-white/5 pt-3 font-mono text-[10px] text-gray-500">
              <div>ENGINE_CORE: DEEP-SPACE / QUANTUM_GATEWAY_V1</div>
              <div>COORDINATES: SEC-2026.07 / LOC-IN</div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

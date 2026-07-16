import React, { useEffect, useState, useRef } from 'react';
import { SpaceCanvas } from './components/SpaceCanvas';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Certificates } from './components/Certificates';
import { Services } from './components/Services';
import { Contact } from './components/Contact';
import { ResumeSection } from './components/ResumeSection';
import { AdminPanel } from './components/AdminPanel';
import { PortfolioData } from './types';
import { Sparkles, Terminal, Volume2, Shield } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);

  // Web Audio Synth state
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<any[]>([]);

  // Fetch all portfolio database telemetry
  const fetchTelemetry = () => {
    fetch('/api/portfolio-data')
      .then((res) => res.json())
      .then((data) => {
        setPortfolioData(data);
      })
      .catch((err) => console.error('Error fetching backend data:', err));
  };

  useEffect(() => {
    fetchTelemetry();

    // Simulated high-tech loading screen sequence
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + 4;
      });
    }, 45);

    // Track scroll values for Space Canvas flight speed
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.pageYOffset / docHeight : 0;
      setScrollProgress(progress);

      // Dynamically detect active scroll section
      const sections = ['home', 'about', 'skills', 'projects', 'certificates', 'services', 'contact', 'admin'];
      for (const section of sections) {
        const el = document.getElementById(section === 'certificates' ? 'certificates' : section === 'contact' ? 'contact' : section === 'about' ? 'about' : section === 'skills' ? 'skills' : section === 'projects' ? 'projects' : section === 'services' ? 'services' : section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top >= -200 && rect.top <= window.innerHeight * 0.4) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
      stopSpaceSynth();
    };
  }, []);

  // Web Audio Procedural Space Synth Drone Generator
  const toggleSpaceSynth = () => {
    if (isMusicPlaying) {
      stopSpaceSynth();
    } else {
      startSpaceSynth();
    }
  };

  const startSpaceSynth = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Master volume
      const masterVolume = ctx.createGain();
      masterVolume.gain.setValueAtTime(0.08, ctx.currentTime);
      masterVolume.connect(ctx.destination);

      // Low-pass filter to make it sound warm and deep
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      filter.connect(masterVolume);

      // Create three overlapping low frequencies representing a deep spaceship thruster engine hum
      const frequencies = [65.41, 98.00, 130.81]; // C2, G2, C3 chords
      const oscillators = frequencies.map((freq) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Slow breathing gain oscillator to make the sound wave move
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        
        osc.connect(gainNode);
        gainNode.connect(filter);
        
        osc.start();
        return { osc, gainNode };
      });

      // LFO modulation to create a slow sweeping outer-space effect
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.08, ctx.currentTime); // Slow sweep
      lfoGain.gain.setValueAtTime(80, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      oscillatorsRef.current = [...oscillators, { osc: lfo, gainNode: lfoGain }];
      setIsMusicPlaying(true);
    } catch (e) {
      console.error('Failed to initialize Web Audio space synth:', e);
    }
  };

  const stopSpaceSynth = () => {
    if (oscillatorsRef.current.length > 0) {
      oscillatorsRef.current.forEach(({ osc }) => {
        try {
          osc.stop();
        } catch (e) {}
      });
      oscillatorsRef.current = [];
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setIsMusicPlaying(false);
  };

  // Safe navigation anchor scrolling
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const targetId = 
        sectionId === 'certificates' ? 'certificates' : 
        sectionId === 'contact' ? 'contact' : 
        sectionId === 'admin' ? 'admin-deck-anchor' : 
        sectionId;
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-cosmic-dark font-sans select-none overflow-x-hidden">
      
      {/* 1. HIGH-TECH INITIAL COCKPIT LOADING SCREEN */}
      {loading && (
        <div className="fixed inset-0 bg-cosmic-dark z-[100] flex flex-col items-center justify-center p-6 space-y-6">
          <div className="relative w-24 h-24 flex items-center justify-center border-4 border-dashed border-cosmic-pink rounded-full p-2 animate-spin-slow">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-cosmic-purple via-cosmic-deep to-cosmic-pink flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>

          <div className="text-center space-y-2 max-w-xs">
            <h2 className="font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-cosmic-cyan tracking-widest text-lg">
              COSMIC FLIGHT DECK
            </h2>
            <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden p-[1px] border border-white/15">
              <div 
                className="h-full bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-cosmic-cyan rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="font-mono text-[9px] text-gray-500 uppercase tracking-widest flex items-center justify-between">
              <span>DEPLOYING_NODES...</span>
              <span>{loadingProgress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. THE THREE.JS INTERACTIVE SPACE CANVA FLIGHT PATH */}
      <SpaceCanvas scrollProgress={scrollProgress} />

      {/* 3. TRANSPARENT NAV DECK PANEL */}
      <Navbar 
        activeSection={activeSection} 
        onNavigate={handleNavigate}
        isMusicPlaying={isMusicPlaying}
        toggleMusic={toggleSpaceSynth}
      />

      {/* 4. MAIN FLIGHT ROUTE PAGES */}
      <div className="relative z-10 w-full">
        
        {/* Sections boundaries */}
        <div id="home">
          <Hero onExplore={() => handleNavigate('about')} />
        </div>

        {portfolioData && (
          <>
            <About />
            
            <Skills skills={portfolioData.skills} />
            
            <Projects projects={portfolioData.projects} />
            
            <Certificates certificates={portfolioData.certificates} />
            
            <Services />
            
            <ResumeSection resume={portfolioData.resume} />
            
            <Contact />

            {/* Anchor coordinate for Admin control viewport */}
            <div id="admin-deck-anchor" className="w-full h-[1px] pointer-events-none" />
            <div id="admin">
              <AdminPanel portfolioData={portfolioData} onRefreshData={fetchTelemetry} />
            </div>
          </>
        )}

      </div>

      {/* 5. GLOWING SCI-FI PANEL FOOTER */}
      <footer className="relative py-12 px-4 border-t border-white/5 bg-cosmic-black text-center z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] text-gray-500 uppercase tracking-wider">
          <div className="flex items-center space-x-1.5">
            <Volume2 className="w-4 h-4 text-cosmic-pink animate-pulse" />
            <span>Telemetry online • Orbital Node India</span>
          </div>
          <div>© 2026 Tamanna Malik • All Systems Stable</div>
          <div className="flex items-center space-x-1">
            <Shield className="w-3.5 h-3.5 text-cosmic-cyan" />
            <span>Command level 4 authorized</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

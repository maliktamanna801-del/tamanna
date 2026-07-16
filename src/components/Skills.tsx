import React, { useState } from 'react';
import { Database, Layout, Flame, Codepen, Globe, Code2, Award, Zap } from 'lucide-react';
import { Skill } from '../types';

interface SkillsProps {
  skills: Skill[];
}

export const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(skills[0] || null);

  // Custom visual definitions for planetary representations to blow recruiters away
  const planetThemes: Record<string, { bg: string, border: string, ring: string, glow: string, icon: any }> = {
    'Java': { 
      bg: 'from-amber-600 via-red-600 to-black', 
      border: 'border-red-500/40', 
      ring: 'border-red-500/20', 
      glow: 'shadow-[0_0_25px_rgba(239,68,68,0.5)]',
      icon: Flame
    },
    'React': { 
      bg: 'from-cyan-500 via-blue-600 to-indigo-900', 
      border: 'border-cyan-400/40', 
      ring: 'border-cyan-400/25', 
      glow: 'shadow-[0_0_25px_rgba(6,182,212,0.5)]',
      icon: Codepen
    },
    'HTML': { 
      bg: 'from-orange-500 via-amber-600 to-black', 
      border: 'border-orange-400/40', 
      ring: 'border-orange-400/20', 
      glow: 'shadow-[0_0_20px_rgba(249,115,22,0.4)]',
      icon: Globe
    },
    'CSS': { 
      bg: 'from-pink-500 via-purple-600 to-violet-950', 
      border: 'border-pink-400/40', 
      ring: 'border-pink-400/20', 
      glow: 'shadow-[0_0_20px_rgba(236,72,153,0.4)]',
      icon: Layout
    },
    'JavaScript': { 
      bg: 'from-yellow-400 via-amber-500 to-slate-900', 
      border: 'border-yellow-400/40', 
      ring: 'border-yellow-400/20', 
      glow: 'shadow-[0_0_25px_rgba(234,179,8,0.5)]',
      icon: Code2
    },
    'Python': { 
      bg: 'from-emerald-500 via-teal-600 to-blue-950', 
      border: 'border-emerald-400/40', 
      ring: 'border-emerald-400/20', 
      glow: 'shadow-[0_0_25px_rgba(16,185,129,0.4)]',
      icon: Database
    },
    'PHP': { 
      bg: 'from-violet-600 via-indigo-700 to-black', 
      border: 'border-violet-400/40', 
      ring: 'border-violet-400/20', 
      glow: 'shadow-[0_0_20px_rgba(139,92,246,0.4)]',
      icon: Code2
    },
    'MySQL': { 
      bg: 'from-sky-500 via-blue-600 to-indigo-950', 
      border: 'border-sky-400/40', 
      ring: 'border-sky-400/20', 
      glow: 'shadow-[0_0_25px_rgba(14,165,233,0.4)]',
      icon: Database
    },
    '.NET': { 
      bg: 'from-purple-600 via-fuchsia-800 to-slate-950', 
      border: 'border-purple-400/40', 
      ring: 'border-purple-400/20', 
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]',
      icon: Code2
    }
  };

  const getPlanetTheme = (name: string) => {
    return planetThemes[name] || {
      bg: 'from-gray-600 via-slate-700 to-black',
      border: 'border-white/20',
      ring: 'border-white/5',
      glow: 'shadow-none',
      icon: Code2
    };
  };

  return (
    <section id="skills" className="relative min-h-screen py-24 px-4 md:px-8 bg-cosmic-dark/40 z-10 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full space-y-12">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
            COSMIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-purple to-cosmic-cyan">PLANETARY SKILLS</span>
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-cosmic-cyan mx-auto rounded-full shadow-[0_0_8px_#ec4899]" />
          <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mt-2">Interactive system: click a planet to extract telemetry diagnostics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT SIDE: FLOATING PLANET GRID (8 cols) */}
          <div className="lg:col-span-7 grid grid-cols-3 gap-6 sm:gap-10 p-6 glass-panel border border-white/5 shadow-glass relative">
            
            {/* Ambient system wireframe orbits */}
            <div className="absolute inset-0 scrolling-grid opacity-10 rounded-2xl pointer-events-none" />

            {skills.map((skill) => {
              const theme = getPlanetTheme(skill.name);
              const SkillIcon = theme.icon;
              const isSelected = selectedSkill?.id === skill.id;

              return (
                <div 
                  key={skill.id}
                  onClick={() => setSelectedSkill(skill)}
                  className="flex flex-col items-center justify-center cursor-pointer group relative"
                >
                  {/* Planetary Orbit Ring */}
                  <div className={`absolute w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 border-dashed transition-all duration-700 ${
                    isSelected ? 'border-cosmic-cyan/40 scale-110 rotate-45' : 'border-white/5 group-hover:border-white/10 group-hover:scale-105'
                  }`} />

                  {/* Planet Sphere */}
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr ${theme.bg} ${theme.glow} border ${
                    isSelected ? 'border-white scale-110' : theme.border + ' group-hover:scale-105'
                  } transition-all duration-300 flex items-center justify-center relative shadow-inner overflow-hidden animate-pulse`}>
                    
                    {/* Shadow crescent line overlay for planetary dimension */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                    
                    <SkillIcon className={`w-5 h-5 sm:w-7 sm:h-7 ${
                      isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    } transition-colors`} />
                  </div>

                  {/* Planet Title Label */}
                  <span className={`mt-3 font-display text-xs sm:text-sm font-semibold transition-colors ${
                    isSelected ? 'text-cosmic-cyan text-shadow-glow' : 'text-gray-400 group-hover:text-gray-200'
                  }`}>
                    {skill.name}
                  </span>

                  {/* Level percentage small hud */}
                  <span className="font-mono text-[9px] text-gray-500 mt-0.5">
                    SYS-LVL: {skill.level}%
                  </span>
                </div>
              );
            })}

          </div>

          {/* RIGHT SIDE: PLANETARY TELEMETRY DIAGNOSTICS DETAILED PANEL (5 cols) */}
          <div className="lg:col-span-5">
            {selectedSkill ? (
              <div className="glass-panel-heavy p-6 md:p-8 border border-cosmic-cyan/20 glow-blue animate-in fade-in slide-in-from-right-4 duration-500 relative overflow-hidden">
                
                {/* Tech scan grid lines decoration */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-cosmic-cyan/30 rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-cosmic-cyan/30 rounded-bl-2xl" />

                {/* Planet name & visual tag */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-wide">
                      {selectedSkill.name}
                    </h3>
                    <p className="font-mono text-[10px] text-cosmic-cyan uppercase tracking-widest mt-1">Class: {selectedSkill.category.toUpperCase()} NODE</p>
                  </div>
                  
                  {/* Planet core representation color bar */}
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${getPlanetTheme(selectedSkill.name).bg} border border-white/10 shadow-lg`} />
                </div>

                {/* Progress telemetry meter bars */}
                <div className="space-y-6 py-6">
                  
                  {/* Operational skill efficiency */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-gray-400 uppercase tracking-wider">Skill Level Capacity</span>
                      <span className="text-white font-bold">{selectedSkill.level}%</span>
                    </div>
                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden p-[1px] border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-cosmic-purple to-cosmic-cyan rounded-full shadow-[0_0_8px_#06b6d4]"
                        style={{ width: `${selectedSkill.level}%` }}
                      />
                    </div>
                  </div>

                  {/* Leaning progress */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-gray-400 uppercase tracking-wider">Telemetry Progress</span>
                      <span className="text-cosmic-pink font-bold">{selectedSkill.learningProgress}</span>
                    </div>
                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden p-[1px] border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-cosmic-purple to-cosmic-pink rounded-full shadow-[0_0_8px_#ec4899]"
                        style={{ width: `${selectedSkill.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Diagnostic details grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/25 p-3 rounded-xl border border-white/5">
                      <span className="text-[9px] text-gray-500 font-mono uppercase block">Active Systems Map</span>
                      <span className="text-xs text-white font-bold block mt-1">{selectedSkill.projectsCount} Project Platforms</span>
                    </div>

                    <div className="bg-black/25 p-3 rounded-xl border border-white/5">
                      <span className="text-[9px] text-gray-500 font-mono uppercase block">Space flight exposure</span>
                      <span className="text-xs text-white font-bold block mt-1">{selectedSkill.experience} Experience</span>
                    </div>
                  </div>

                  {/* Core summary */}
                  <div className="space-y-2">
                    <h4 className="font-mono text-[10px] text-gray-400 uppercase tracking-wider flex items-center space-x-1">
                      <Award className="w-3.5 h-3.5 text-cosmic-pink" />
                      <span>Diagnostic summary</span>
                    </h4>
                    <p className="text-xs text-gray-300 font-normal leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
                      {selectedSkill.description}
                    </p>
                  </div>

                </div>

                {/* Bottom sensor bar */}
                <div className="flex items-center space-x-2 text-[10px] text-gray-500 font-mono border-t border-white/5 pt-3">
                  <Zap className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                  <span>TRANSMISSION_SPEED: 100% (STABLE)</span>
                </div>

              </div>
            ) : (
              <div className="glass-panel p-8 text-center text-gray-500">
                Select a planet to extract skill telemetry.
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

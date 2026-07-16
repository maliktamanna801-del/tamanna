import React from 'react';
import { Layers, Monitor, Server, Smartphone, Cpu, Database, Sparkles } from 'lucide-react';

export const Services: React.FC = () => {
  const serviceCards = [
    {
      title: "Web Development",
      icon: Layers,
      desc: "Architecting responsive, fast, and secure modular web platforms using cutting-edge full-stack tech stacks.",
      color: "text-cosmic-purple bg-cosmic-purple/10 border-cosmic-purple/30 shadow-neon-purple"
    },
    {
      title: "Frontend Development",
      icon: Monitor,
      desc: "Creating high-fidelity, interactive user interfaces with fluid typography, custom scroll paths, and clean React 19 architecture.",
      color: "text-cosmic-pink bg-cosmic-pink/10 border-cosmic-pink/30 shadow-neon-pink"
    },
    {
      title: "Backend Development",
      icon: Server,
      desc: "Developing fast node routing engines, middleware checks, and structured secure operations under heavy throughput.",
      color: "text-cosmic-cyan bg-cosmic-cyan/10 border-cosmic-cyan/30 shadow-neon-blue"
    },
    {
      title: "Responsive Layouts",
      icon: Smartphone,
      desc: "Mapping responsive viewport queries so that applications render beautifully on any display, from massive visual walls to mobile screens.",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/30 shadow-none"
    },
    {
      title: "API Development",
      icon: Cpu,
      desc: "Structuring clean, versioned RESTful APIs with input sanitizations, secure JWT checks, and complete analytics monitoring.",
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30 shadow-none"
    },
    {
      title: "Database Design",
      icon: Database,
      desc: "Engineering secure databases (relational MySQL & document MongoDB), index maps, structured queries, and persistent file backups.",
      color: "text-blue-500 bg-blue-500/10 border-blue-500/30 shadow-none"
    }
  ];

  return (
    <section id="services" className="relative min-h-screen py-24 px-4 md:px-8 bg-cosmic-dark/30 z-10 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full space-y-12">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
            SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-purple to-cosmic-cyan">SERVICES DEPLOYED</span>
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-cosmic-cyan mx-auto rounded-full shadow-[0_0_8px_#ec4899]" />
          <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mt-2">Available functional modules for deployment integration</p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceCards.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="glass-panel hover:glass-panel-heavy p-6 border border-white/5 hover:border-white/15 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] flex flex-col justify-between group"
              >
                
                {/* Visual Accent */}
                <div className="space-y-4">
                  <div className={`p-3 rounded-xl border w-12 h-12 flex items-center justify-center transition-all ${srv.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-cosmic-cyan transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-normal">
                      {srv.desc}
                    </p>
                  </div>
                </div>

                {/* Operations Tag */}
                <div className="flex items-center space-x-1 font-mono text-[9px] text-gray-600 uppercase tracking-widest pt-5 border-t border-white/5 mt-5">
                  <Sparkles className="w-3.5 h-3.5 text-cosmic-pink animate-pulse" />
                  <span>Module active for launch</span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { FileText, Download, Briefcase, GraduationCap, MapPin, Mail, Phone, Globe, ExternalLink } from 'lucide-react';
import { ResumeData } from '../types';

interface ResumeSectionProps {
  resume: ResumeData;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({ resume }) => {
  const handleDownload = () => {
    alert("Resume download triggered! [Placeholder file initiated for Tamanna Malik]");
  };

  return (
    <section id="resume-section" className="relative py-24 px-4 md:px-8 bg-cosmic-dark/30 z-10 flex flex-col justify-center">
      <div className="max-w-5xl mx-auto w-full space-y-12">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
            SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-purple to-cosmic-cyan">CURRICULUM VITAE</span>
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-cosmic-cyan mx-auto rounded-full shadow-[0_0_8px_#ec4899]" />
          <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mt-2">Professional experience and academic parameters</p>
        </div>

        {/* Outer glass panel frame resembling a paper printout inside a computer console */}
        <div className="glass-panel p-6 md:p-10 border border-white/5 shadow-glass space-y-8 relative overflow-hidden">
          
          {/* Cyber scanner lines decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-cosmic-cyan opacity-80" />
          
          {/* Top profile banner */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 border-b border-white/5 pb-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-wide">{resume.name}</h3>
              <p className="font-mono text-xs text-cosmic-cyan font-bold uppercase tracking-wider">{resume.role}</p>
              <p className="text-xs text-gray-400 font-normal leading-relaxed max-w-xl">
                {resume.summary}
              </p>
            </div>

            {/* Contact links console block */}
            <div className="shrink-0 font-mono text-[10px] text-gray-400 space-y-1.5 bg-black/40 p-4 rounded-xl border border-white/5">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-cosmic-pink" />
                <span>Location: {resume.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-cosmic-purple" />
                <span>Email: {resume.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-cosmic-cyan" />
                <span>Phone: {resume.phone}</span>
              </div>
              <div className="flex items-center space-x-2 pt-1 border-t border-white/5 mt-1.5">
                <Globe className="w-3.5 h-3.5 text-gray-500" />
                <a href={resume.github} target="_blank" rel="noopener" className="hover:text-white transition-colors">GitHub Profile</a>
              </div>
            </div>
          </div>

          {/* Academic and Career timeline structures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left side: Professional Experience */}
            <div className="space-y-6">
              <h4 className="font-display font-bold text-lg text-white flex items-center space-x-2.5 border-b border-white/5 pb-2">
                <Briefcase className="w-5 h-5 text-cosmic-pink" />
                <span>PROFESSIONAL MISSION LOG</span>
              </h4>

              <div className="space-y-6 pl-4 border-l border-white/5">
                {resume.experience.map((exp, idx) => (
                  <div key={idx} className="relative space-y-2">
                    {/* Ring timeline anchor */}
                    <span className="absolute -left-5.5 top-1.5 w-2.5 h-2.5 rounded-full bg-cosmic-pink" />
                    <div>
                      <h5 className="font-sans font-bold text-sm sm:text-base text-white">{exp.role}</h5>
                      <div className="flex items-center justify-between font-mono text-[10px] text-cosmic-cyan mt-0.5">
                        <span className="font-bold">{exp.company}</span>
                        <span>{exp.period}</span>
                      </div>
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-gray-400 font-normal leading-relaxed">
                      {exp.description.map((item, id) => (
                        <li key={id}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Academic Parameters */}
            <div className="space-y-6">
              <h4 className="font-display font-bold text-lg text-white flex items-center space-x-2.5 border-b border-white/5 pb-2">
                <GraduationCap className="w-5 h-5 text-cosmic-cyan" />
                <span>ACADEMIC DEGREES</span>
              </h4>

              <div className="space-y-6 pl-4 border-l border-white/5">
                {resume.education.map((edu, idx) => (
                  <div key={idx} className="relative space-y-2">
                    {/* Ring timeline anchor */}
                    <span className="absolute -left-5.5 top-1.5 w-2.5 h-2.5 rounded-full bg-cosmic-cyan" />
                    <div>
                      <h5 className="font-sans font-bold text-sm sm:text-base text-white leading-snug">{edu.degree}</h5>
                      <div className="flex items-center justify-between font-mono text-[10px] text-gray-400 mt-1">
                        <span className="text-gray-500 font-semibold">{edu.institution}</span>
                        <span className="text-cosmic-cyan font-bold">{edu.period}</span>
                      </div>
                    </div>
                    <div className="text-xs font-mono text-cosmic-pink font-semibold bg-white/5 px-2 py-1 rounded border border-white/5 inline-block">
                      {edu.score}
                    </div>
                  </div>
                ))}
              </div>

              {/* Verified Badge decoration */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 font-mono text-[10px] text-gray-500 flex items-start space-x-3 leading-relaxed">
                <FileText className="w-5 h-5 text-cosmic-purple shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-300 font-semibold uppercase block">Verified telemetry log</span>
                  All above credential listings correspond exactly to certified academic parameters recorded in the Central Command database.
                </div>
              </div>

            </div>

          </div>

          {/* Action Download console */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-6">
            <span className="font-mono text-[9px] text-gray-600 uppercase">SYSTEM_SPECIFICATION_DOCUMENT: ENCRYPTED_VER_1.4</span>
            
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-neon-pink cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download System Resume</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

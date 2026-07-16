import React, { useState } from 'react';
import { Award, Eye, Download, Search, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { Certificate } from '../types';

interface CertificatesProps {
  certificates: Certificate[];
}

export const Certificates: React.FC<CertificatesProps> = ({ certificates }) => {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCertificates = certificates.filter(cert => 
    cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.issuer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (cert: Certificate) => {
    alert(`Downloading ${cert.title} Certificate! [Placeholder file initiated]`);
  };

  return (
    <section id="certificates" className="relative min-h-screen py-24 px-4 md:px-8 bg-cosmic-dark/40 z-10 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full space-y-12">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
            ORBITAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-purple to-cosmic-cyan">VERIFICATIONS</span>
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-cosmic-cyan mx-auto rounded-full shadow-[0_0_8px_#ec4899]" />
          <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mt-2">Credential wall and professional certifications</p>
        </div>

        {/* Search verification bar */}
        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            placeholder="Search credentials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-xs text-white font-mono focus:outline-none focus:border-cosmic-cyan/60 transition-colors placeholder:text-gray-600"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
        </div>

        {/* Certificate Wall Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCertificates.map((cert) => (
            <div
              key={cert.id}
              className="glass-panel hover:glass-panel-heavy p-5 border border-white/5 hover:border-cosmic-cyan/20 rounded-2xl flex flex-col sm:flex-row gap-5 items-center transition-all duration-300 transform hover:-translate-y-1 group"
            >
              
              {/* Thumbnail preview */}
              <div className="relative w-full sm:w-36 h-28 rounded-lg overflow-hidden bg-black/40 shrink-0 border border-white/5">
                <img
                  src={cert.imageUrl}
                  alt={cert.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="p-2 rounded-full bg-cosmic-cyan text-black hover:scale-110 transition-all cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Text content details */}
              <div className="flex-grow space-y-3 text-center sm:text-left">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-cosmic-cyan uppercase tracking-wider flex items-center justify-center sm:justify-start space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Credential</span>
                  </span>
                  <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-cosmic-cyan transition-colors leading-snug">
                    {cert.title}
                  </h3>
                  <p className="font-sans text-xs text-gray-400 font-semibold">{cert.issuer} • <span className="text-gray-500">{cert.date}</span></p>
                </div>

                <div className="font-mono text-[9px] text-gray-600 bg-black/30 px-2 py-1 rounded border border-white/5 truncate max-w-full">
                  ID: {cert.credentialId}
                </div>

                {/* Operations links */}
                <div className="flex items-center justify-center sm:justify-start space-x-4 pt-1">
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="flex items-center space-x-1.5 text-xs font-mono text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-cosmic-pink" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => handleDownload(cert)}
                    className="flex items-center space-x-1.5 text-xs font-mono text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-cosmic-cyan" />
                    <span>Download</span>
                  </button>

                  <a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-xs font-mono text-gray-400 hover:text-white transition-colors"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

              </div>

            </div>
          ))}
        </div>

        {filteredCertificates.length === 0 && (
          <div className="text-center py-10 text-gray-500 font-mono text-xs">
            No certificates match search parameters.
          </div>
        )}

      </div>

      {/* ZOOM LIGHTBOX PREVIEW */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl glass-panel-heavy border border-cosmic-cyan/20 rounded-2xl p-4 sm:p-6 space-y-4">
            
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-all cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <span className="font-mono text-[9px] text-cosmic-cyan uppercase tracking-widest">{selectedCert.issuer} verified module</span>
              <h4 className="font-display font-bold text-lg text-white leading-snug">{selectedCert.title}</h4>
            </div>

            {/* Expansive Image view */}
            <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-black/40">
              <img
                src={selectedCert.imageUrl}
                alt={selectedCert.title}
                className="w-full h-auto max-h-[60vh] object-contain mx-auto"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Info and download triggers */}
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <span className="font-mono text-[10px] text-gray-500">CREDENTIAL_ID: {selectedCert.credentialId}</span>
              <button
                onClick={() => handleDownload(selectedCert)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-neon-pink cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Save Credential</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

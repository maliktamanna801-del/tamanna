import React, { useState, useEffect, useRef } from 'react';
import { Send, Terminal, Shield, Sparkles, MessageSquare, RefreshCw, Cpu, Star, Radio } from 'lucide-react';

export const Contact: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', text: string }>({ type: 'idle', text: '' });

  // AI Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai', text: string }>>([
    { sender: 'ai', text: "Systems online. I am Cosmic-AI, Tamanna's portfolio assistant clone. Ask me about her skills, projects, background or how to hire her!" }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Cockpit light toggling state
  const [alertLevel, setAlertLevel] = useState<'normal' | 'caution' | 'critical'>('normal');

  // Visitor telemetry counters
  const [visitorStats, setVisitorStats] = useState({ count: 512, quote: 'Loading motivation quote...', origin: 'India' });

  useEffect(() => {
    // Fire analytics visit increment
    fetch('/api/analytics/visitor', { method: 'POST' }).catch(() => {});
    fetch('/api/analytics/section', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'contact' })
    }).catch(() => {});

    // Fetch motivation quote
    fetch('/api/quote')
      .then(res => res.json())
      .then(data => {
        if (data.q) setVisitorStats(prev => ({ ...prev, quote: `"${data.q}" — ${data.a}` }));
      })
      .catch(() => {});

    // Fetch simulated total visitor count
    fetch('/api/portfolio-data')
      .then(res => res.json())
      .then(data => {
        if (data.analytics) {
          setVisitorStats(prev => ({ ...prev, count: data.analytics.visitors }));
        }
      })
      .catch(() => {});
  }, []);

  // Handle contact form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFormStatus({ type: 'error', text: 'All cockpit authorization fields are required!' });
      return;
    }

    setFormStatus({ type: 'loading', text: 'Engaging deep-space telemetry pipeline...' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok) {
        setFormStatus({ type: 'success', text: data.message || 'Transmission dispatched successfully!' });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setAlertLevel('normal');
      } else {
        setFormStatus({ type: 'error', text: data.error || 'Uplink transmission rejected by server.' });
        setAlertLevel('caution');
      }
    } catch (err) {
      setFormStatus({ type: 'error', text: 'Telemetry pipeline disconnected. Ensure backend is running.' });
      setAlertLevel('critical');
    }
  };

  // Handle AI Chat submission
  const handleAiChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setIsAiLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, chatHistory })
      });
      const data = await response.json();

      setChatHistory(prev => [...prev, { sender: 'ai', text: data.reply }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { sender: 'ai', text: "Stardust interference detected in the relay channel... please try re-initializing." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <section id="contact" className="relative min-h-screen py-24 px-4 md:px-8 bg-cosmic-dark/30 z-10 flex flex-col justify-center overflow-hidden">
      
      {/* Background stardust stars animation accents */}
      <div className="absolute inset-0 scrolling-grid opacity-5 pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full space-y-12">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
            SPACESHIP <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-cosmic-cyan">COCKPIT PANEL</span>
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-cosmic-cyan mx-auto rounded-full shadow-[0_0_8px_#ec4899]" />
          <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mt-2">Futuristic terminal integration for messages and AI chats</p>
        </div>

        {/* Cockpit Shell layout */}
        <div className={`glass-panel-heavy p-6 md:p-8 border rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 shadow-glass relative transition-all duration-700 ${
          alertLevel === 'critical' ? 'border-red-500/40 shadow-[inset_0_0_40px_rgba(239,68,68,0.2)]' :
          alertLevel === 'caution' ? 'border-amber-500/40 shadow-[inset_0_0_40px_rgba(245,158,11,0.2)]' :
          'border-cosmic-purple/15'
        }`}>
          
          {/* Cockpit Status indicator bars */}
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 flex space-x-12 font-mono text-[9px] text-gray-500 uppercase tracking-widest hidden sm:flex">
            <div className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${
                alertLevel === 'critical' ? 'bg-red-500 animate-ping' :
                alertLevel === 'caution' ? 'bg-amber-500 animate-pulse' :
                'bg-green-500'
              }`} />
              <span>ALARM_LVL: {alertLevel}</span>
            </div>
            <div>SHIELDS: 100% (CHARGED)</div>
            <div>SECTOR_COMMS: SECURE</div>
          </div>

          {/* LEFT PANEL (7 cols): Holographic Cockpit Computer (AI Chat & Telemetry Monitor) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Holographic central diagnostic computer screen */}
            <div className="bg-black/60 rounded-2xl border border-white/5 p-4 flex flex-col justify-between h-[360px] relative shadow-inner">
              
              {/* Telemetry stream scan lines */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_4px,3px_100%] rounded-2xl pointer-events-none" />

              {/* Chat messages viewport */}
              <div className="flex-grow overflow-y-auto space-y-3.5 pr-2 max-h-[300px] scrollbar-thin scrollbar-thumb-indigo-900 scrollbar-track-transparent">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs font-mono border leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-cosmic-purple/20 border-cosmic-purple/40 text-white rounded-br-none'
                        : 'bg-black/50 border-white/5 text-cosmic-cyan rounded-bl-none'
                    }`}>
                      <div className="font-bold text-[9px] text-gray-500 mb-1">
                        {msg.sender === 'user' ? '$ COGNITIVE_USER' : '$ COSMIC_AI_SYSTEM'}
                      </div>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}

                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-black/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-cosmic-pink font-mono flex items-center space-x-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Decoupling quantum variables...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input form inside cockpit deck */}
              <form onSubmit={handleAiChatSubmit} className="mt-4 flex items-center space-x-2 border-t border-white/5 pt-3 shrink-0">
                <input
                  type="text"
                  placeholder="Ask Cosmic-AI something..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-grow bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-cosmic-cyan/60"
                />
                <button
                  type="submit"
                  disabled={isAiLoading || !chatInput.trim()}
                  className="p-2 rounded-xl bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white font-mono text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>

            {/* Simulated Cockpit HUD Dashboard controls, sliders & click buttons */}
            <div className="grid grid-cols-3 gap-4">
              
              {/* Control 1: Alert level toggle */}
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center space-y-2">
                <div className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Cabin Alert Mode</div>
                <div className="flex justify-center space-x-1.5">
                  <button 
                    onClick={() => setAlertLevel('normal')}
                    className={`w-4 h-4 rounded-full bg-green-500 ${alertLevel === 'normal' ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-40'} cursor-pointer`}
                    title="Normal Mode"
                  />
                  <button 
                    onClick={() => setAlertLevel('caution')}
                    className={`w-4 h-4 rounded-full bg-amber-500 ${alertLevel === 'caution' ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-40'} cursor-pointer`}
                    title="Caution Mode"
                  />
                  <button 
                    onClick={() => setAlertLevel('critical')}
                    className={`w-4 h-4 rounded-full bg-red-500 ${alertLevel === 'critical' ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-40'} cursor-pointer`}
                    title="Critical Alarm Mode"
                  />
                </div>
              </div>

              {/* Control 2: Visitor Log indicator */}
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center flex flex-col justify-center">
                <div className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Uplink Visitors</div>
                <div className="text-lg font-display font-extrabold text-cosmic-cyan mt-1">{visitorStats.count}</div>
                <div className="text-[8px] text-gray-600 font-mono">SECTOR_VISIT_COUNT</div>
              </div>

              {/* Control 3: Sector origin coordinate */}
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center flex flex-col justify-center">
                <div className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">Telemetry Relay</div>
                <div className="text-xs font-mono text-cosmic-pink font-bold mt-1 flex items-center justify-center space-x-1">
                  <Radio className="w-3.5 h-3.5 text-cosmic-pink animate-pulse" />
                  <span>{visitorStats.origin}</span>
                </div>
                <div className="text-[8px] text-gray-600 font-mono">NODE_LOCATION</div>
              </div>

            </div>

            {/* Daily stardust thought line */}
            <p className="text-[10px] text-gray-500 font-mono italic text-center leading-relaxed">
              * Active Solar Flare Fact: {visitorStats.quote}
            </p>

          </div>

          {/* RIGHT PANEL (5 cols): Space Cockpit Contact Form */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="border-b border-white/5 pb-3">
                <h3 className="font-display font-bold text-lg text-white flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-cosmic-pink" />
                  <span>TRANSMIT DISPATCH TELEMETRY</span>
                </h3>
                <p className="text-[10px] text-gray-400 font-mono">Input secure credentials for solar-grid verification</p>
              </div>

              {/* Input field: Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Commander Name</label>
                <input
                  type="text"
                  placeholder="Identify yourself..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cosmic-pink/60 transition-colors"
                />
              </div>

              {/* Input field: Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Galactic Email Relay</label>
                <input
                  type="email"
                  placeholder="Relay address..."
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cosmic-pink/60 transition-colors"
                />
              </div>

              {/* Input field: Subject */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Subject Code</label>
                <input
                  type="text"
                  placeholder="Mission query subject..."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cosmic-pink/60 transition-colors"
                />
              </div>

              {/* Input field: Message */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Payload Message Log</label>
                <textarea
                  rows={4}
                  placeholder="Record transmission log details..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cosmic-pink/60 transition-colors resize-none"
                />
              </div>

              {/* Status response toast inside form */}
              {formStatus.type !== 'idle' && (
                <div className={`p-3 rounded-xl text-xs font-mono border ${
                  formStatus.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  formStatus.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  'bg-cosmic-purple/10 text-cosmic-purple border-cosmic-purple/20'
                }`}>
                  {formStatus.text}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={formStatus.type === 'loading'}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-cosmic-cyan text-white font-mono text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-neon-pink cursor-pointer active:scale-95 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
                <span>Launch Telemetry Dispatch</span>
              </button>

            </form>
          </div>

        </div>

      </div>
    </section>
  );
};

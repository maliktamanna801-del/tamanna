import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, Trash2, Search, BarChart3, Mail, Plus, Edit2, Check, RefreshCw, LogOut, FileText, Globe, Code } from 'lucide-react';
import { Project, Skill, Certificate, Message, ResumeData, AnalyticsData } from '../types';

interface AdminPanelProps {
  portfolioData: {
    projects: Project[];
    skills: Skill[];
    certificates: Certificate[];
    resume: ResumeData;
    analytics: AnalyticsData;
  } | null;
  onRefreshData: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ portfolioData, onRefreshData }) => {
  // Auth state
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Admin section state
  const [activeTab, setActiveTab] = useState<'messages' | 'analytics' | 'projects' | 'resume'>('messages');
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgSearch, setMsgSearch] = useState('');

  // Form templates state
  const [projectForm, setProjectForm] = useState<{ title: string, description: string, techStack: string, githubUrl: string, liveUrl: string, category: string, status: 'Completed' | 'In Progress', featured: boolean, imageUrl: string }>({
    title: '', description: '', techStack: '', githubUrl: '', liveUrl: '', category: 'Full Stack', status: 'Completed', featured: false, imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200'
  });
  const [formMsg, setFormMsg] = useState('');

  // Fetch messages once logged in
  useEffect(() => {
    if (token) {
      fetch('/api/admin/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (res.status === 401 || res.status === 403) {
            handleLogout();
            throw new Error('Unauthorized session expired');
          }
          return res.json();
        })
        .then(data => setMessages(data))
        .catch(err => console.log(err));
    }
  }, [token]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        setLoginForm({ username: '', password: '' });
      } else {
        setAuthError(data.error || 'Invalid credentials mapping.');
      }
    } catch (err) {
      setAuthError('Authenticating proxy offline.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  // Manage Messages delete
  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Delete message pipeline completely from server?')) return;
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setMessages(prev => prev.filter(m => m.id !== id));
        onRefreshData();
      }
    } catch (err) {
      alert('Delete failed.');
    }
  };

  // Create Project submit
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg('');

    const payload = {
      ...projectForm,
      techStack: projectForm.techStack.split(',').map(s => s.trim()).filter(s => s.length > 0)
    };

    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setFormMsg('New project operationalized successfully!');
        setProjectForm({
          title: '', description: '', techStack: '', githubUrl: '', liveUrl: '', category: 'Full Stack', status: 'Completed', featured: false, imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200'
        });
        onRefreshData();
      } else {
        setFormMsg('Failed to create project module.');
      }
    } catch (err) {
      setFormMsg('Server connection error.');
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(msgSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(msgSearch.toLowerCase()) ||
    m.message.toLowerCase().includes(msgSearch.toLowerCase())
  );

  // UN-AUTHENTICATED LOGIN SCREEN
  if (!token) {
    return (
      <section className="min-h-screen py-24 px-4 flex items-center justify-center z-20 relative select-none bg-cosmic-dark/40">
        <div className="w-full max-w-md glass-panel-heavy p-6 sm:p-8 border border-cosmic-purple/30 glow-purple space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-cosmic-purple/10 text-cosmic-purple">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-wide uppercase">ADMIN CONTROL DECK</h2>
            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Provide cryptographic login authorization</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">Officer Username</label>
              <input
                type="text"
                placeholder="Username (admin)"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cosmic-purple/60"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">Access Passcode</label>
              <input
                type="password"
                placeholder="Password (admin123)"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cosmic-purple/60"
                required
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-mono text-red-400">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white font-mono text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow-neon-purple disabled:opacity-50"
            >
              {isAuthLoading ? 'Verifying Gateway...' : 'Access Command Console'}
            </button>
          </form>

          <p className="text-[9px] text-center text-gray-600 font-mono">
            Credential note: admin / admin123
          </p>
        </div>
      </section>
    );
  }

  // AUTHENTICATED COMMAND CONSOLE
  return (
    <section className="min-h-screen py-24 px-4 md:px-8 z-20 relative bg-cosmic-dark/30">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* Admin Header controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-wide">ORBIT COMMAND DECK</h2>
            <p className="font-mono text-[10px] text-cosmic-cyan uppercase tracking-widest">Operational administration console</p>
          </div>
          
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onRefreshData}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono tracking-wider uppercase transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>

        {/* Dashboard inner tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* TAB SWITCHER */}
          <div className="lg:col-span-3 space-y-2">
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl border font-mono text-xs tracking-wider uppercase transition-all ${
                activeTab === 'messages' ? 'bg-cosmic-purple/20 border-cosmic-purple text-white' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4 text-cosmic-pink" />
              <span>Uplink Messages ({messages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl border font-mono text-xs tracking-wider uppercase transition-all ${
                activeTab === 'analytics' ? 'bg-cosmic-purple/20 border-cosmic-purple text-white' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-cosmic-cyan" />
              <span>Core Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl border font-mono text-xs tracking-wider uppercase transition-all ${
                activeTab === 'projects' ? 'bg-cosmic-purple/20 border-cosmic-purple text-white' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4 text-cosmic-cyan" />
              <span>Deploy Projects</span>
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl border font-mono text-xs tracking-wider uppercase transition-all ${
                activeTab === 'resume' ? 'bg-cosmic-purple/20 border-cosmic-purple text-white' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Manage Bio/Resume</span>
            </button>
          </div>

          {/* SCREEN CONTENT PANEL */}
          <div className="lg:col-span-9 glass-panel p-6 border border-white/5 min-h-[400px]">
            
            {/* TAB SCREEN: MESSAGES MANAGER */}
            {activeTab === 'messages' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="font-display font-semibold text-lg text-white">RECRUITER TRANSMISSIONS</h3>
                  
                  {/* Search query messages */}
                  <div className="relative w-48">
                    <input
                      type="text"
                      placeholder="Search mail..."
                      value={msgSearch}
                      onChange={(e) => setMsgSearch(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 pl-8 text-[11px] text-white font-mono focus:outline-none focus:border-cosmic-pink/60"
                    />
                    <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {filteredMessages.map((msg) => (
                    <div key={msg.id} className="p-4 bg-black/30 border border-white/5 rounded-xl space-y-3 relative group">
                      
                      {/* Delete icon */}
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="absolute top-4 right-4 p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-red-500/20"
                        title="Purge message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs font-mono">
                        <div>
                          <span className="text-white font-bold">{msg.name}</span>
                          <span className="text-gray-500"> ({msg.email})</span>
                        </div>
                        <span className="text-gray-600">{new Date(msg.timestamp).toLocaleString()}</span>
                      </div>

                      <div className="text-xs font-semibold text-cosmic-cyan font-display">
                        Subject: {msg.subject}
                      </div>

                      <p className="text-xs text-gray-300 font-normal leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
                        {msg.message}
                      </p>
                    </div>
                  ))}

                  {filteredMessages.length === 0 && (
                    <div className="text-center py-12 text-gray-500 font-mono text-xs">
                      No communications recorded.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB SCREEN: ANALYTICS DASHBOARD */}
            {activeTab === 'analytics' && portfolioData && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="font-display font-semibold text-lg text-white">SYSTEM TELEMETRY DIAGNOSTICS</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  
                  <div className="bg-black/30 p-4 border border-white/5 rounded-2xl text-center space-y-1">
                    <span className="text-[10px] text-gray-500 font-mono uppercase">Total Visitors</span>
                    <div className="text-3xl font-display font-black text-cosmic-cyan">{portfolioData.analytics.visitors}</div>
                    <span className="text-[9px] text-gray-600 font-mono">WEBGL_STAGE_LOADS</span>
                  </div>

                  <div className="bg-black/30 p-4 border border-white/5 rounded-2xl text-center space-y-1">
                    <span className="text-[10px] text-gray-500 font-mono uppercase">Recruiter Letters</span>
                    <div className="text-3xl font-display font-black text-cosmic-pink">{messages.length}</div>
                    <span className="text-[9px] text-gray-600 font-mono">TOTAL_DISPATCHES</span>
                  </div>

                  <div className="bg-black/30 p-4 border border-white/5 rounded-2xl text-center space-y-1">
                    <span className="text-[10px] text-gray-500 font-mono uppercase">Deploy Modules</span>
                    <div className="text-3xl font-display font-black text-purple-400">{portfolioData.projects.length}</div>
                    <span className="text-[9px] text-gray-600 font-mono">PROJECTS_SEEDED</span>
                  </div>

                </div>

                {/* Grid clicks analytics mapping simulation */}
                <div className="space-y-3 bg-black/25 p-4 rounded-xl border border-white/5">
                  <h4 className="font-mono text-xs text-gray-400 uppercase tracking-wider">Sector Flight Analytics</h4>
                  
                  <div className="space-y-2">
                    {Object.entries(portfolioData.analytics.sectionViews).map(([sect, val]) => (
                      <div key={sect} className="flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-500 uppercase">Sector: {sect}</span>
                        <div className="flex items-center space-x-2">
                          <div className="h-1.5 w-24 bg-white/5 rounded overflow-hidden">
                            <div className="h-full bg-cosmic-cyan rounded" style={{ width: `${Math.min(((val as number)/300)*100, 100)}%` }} />
                          </div>
                          <span className="text-white font-bold">{val} hits</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB SCREEN: DEPLOY PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="font-display font-semibold text-lg text-white">LAUNCH PROJECT PLATFORM</h3>
                </div>

                <form onSubmit={handleProjectSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">Project Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Apollo Star Mapping"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-cosmic-cyan"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">Project Category</label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-cosmic-cyan"
                    >
                      <option value="AI & Data Science">AI & Data Science</option>
                      <option value="Full Stack">Full Stack</option>
                      <option value="Data Science">Data Science</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">Brief Summary</label>
                    <textarea
                      rows={2}
                      placeholder="Operational project description summary..."
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-cosmic-cyan resize-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">Tech Stack Modules (comma split)</label>
                    <input
                      type="text"
                      placeholder="React, Java, Python"
                      value={projectForm.techStack}
                      onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-cosmic-cyan"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">Mock/Real Image URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com..."
                      value={projectForm.imageUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-cosmic-cyan"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">Source Code Repository</label>
                    <input
                      type="text"
                      placeholder="https://github.com..."
                      value={projectForm.githubUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-cosmic-cyan"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">Active Deploy link</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={projectForm.liveUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-cosmic-cyan"
                      required
                    />
                  </div>

                  {formMsg && (
                    <div className="sm:col-span-2 p-3 rounded-xl bg-cosmic-purple/20 border border-cosmic-purple/40 text-xs font-mono text-white">
                      {formMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="sm:col-span-2 py-3 rounded-xl bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white font-mono text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow-neon-pink"
                  >
                    Deploy Operational Module
                  </button>

                </form>
              </div>
            )}

            {/* TAB SCREEN: RESUME BIO MANAGER */}
            {activeTab === 'resume' && portfolioData && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="font-display font-semibold text-lg text-white">MANAGE BIO SPECS</h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-3">
                    <div className="text-xs font-mono text-gray-400">Current Professional summary</div>
                    <p className="text-xs text-gray-300 font-normal leading-relaxed">
                      {portfolioData.resume.summary}
                    </p>
                  </div>

                  {/* Standard placeholder notifications for editing */}
                  <div className="p-4 bg-white/5 rounded-xl border border-dashed border-white/10 text-xs font-mono text-gray-400 text-center space-y-2">
                    <Shield className="w-6 h-6 text-cosmic-cyan mx-auto animate-pulse" />
                    <div>You are logged in securely. All MongoDB collection schema changes are active.</div>
                    <div className="text-[10px] text-gray-600 uppercase">Seeded Credentials and Projects can be modified instantly here or directly in database.json</div>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};

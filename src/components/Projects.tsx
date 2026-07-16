import React, { useState } from 'react';
import { Search, Filter, ExternalLink, Github, Layers, PlayCircle, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Project } from '../types';

interface ProjectsProps {
  projects: Project[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const itemsPerPage = 3;

  // Categories extraction
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  // Filtering & Searching logic
  const filteredProjects = projects.filter(project => {
    const matchesCategory = filter === 'All' || project.category === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openProjectModal = (proj: Project) => {
    setSelectedProject(proj);
    setActiveImageIndex(0);
  };

  return (
    <section id="projects" className="relative min-h-screen py-24 px-4 md:px-8 bg-cosmic-dark/30 z-10 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full space-y-10">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
            ORBITAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-cosmic-cyan">PROJECT GRID</span>
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-cosmic-purple via-cosmic-pink to-cosmic-cyan mx-auto rounded-full shadow-[0_0_8px_#ec4899]" />
          <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mt-2">Space-grade glass panels representing active deployments</p>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-panel p-4 border border-white/5 shadow-glass flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setFilter(cat); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wide transition-all ${
                  filter === cat
                    ? 'bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white font-semibold'
                    : 'bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search telemetry..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 pl-10 text-xs text-white font-mono focus:outline-none focus:border-cosmic-pink/60 transition-colors placeholder:text-gray-600"
            />
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          </div>

        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedProjects.map((project) => (
            <div
              key={project.id}
              className="glass-panel hover:glass-panel-heavy border border-white/5 hover:border-cosmic-pink/20 rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.01] hover:shadow-neon-pink group relative flex flex-col justify-between min-h-[460px]"
            >
              
              {/* Featured Badge */}
              {project.featured && (
                <span className="absolute top-3 left-3 bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full z-10 animate-pulse shadow-md">
                  Featured Launch
                </span>
              )}

              {/* Status Badge */}
              <span className={`absolute top-3 right-3 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full z-10 border shadow-md ${
                project.status === 'Completed' 
                  ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                  : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
              }`}>
                {project.status}
              </span>

              {/* Project Image */}
              <div className="relative h-48 overflow-hidden bg-black/40">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cosmic-dark via-transparent to-transparent opacity-90" />
                
                {/* Overlay hover eye button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
                  <button 
                    onClick={() => openProjectModal(project)}
                    className="p-3 rounded-full bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white hover:scale-110 transition-transform flex items-center justify-center cursor-pointer"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                
                <div className="space-y-2">
                  <span className="font-mono text-[9px] text-cosmic-cyan uppercase tracking-widest block">{project.category}</span>
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-cosmic-pink transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-normal line-clamp-3">
                    {project.description}
                  </p>
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-white/5 border border-white/5 font-mono text-[9px] text-gray-500"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <button
                    onClick={() => openProjectModal(project)}
                    className="flex items-center space-x-1.5 text-xs font-mono text-gray-300 hover:text-white transition-colors"
                  >
                    <Eye className="w-4 h-4 text-cosmic-pink" />
                    <span>Diagnostics</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-all"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white transition-all shadow-md active:scale-95"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <Layers className="w-12 h-12 text-gray-600 mx-auto mb-2 animate-bounce" />
            <p className="font-mono text-sm text-gray-400">No telemetry records match your parameters.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4 pt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs text-gray-400">
              ORBITAL: <span className="text-white font-bold">{currentPage}</span> / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* DETAILED PROJECT INFO DIALOG MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-3xl glass-panel-heavy border border-cosmic-pink/20 glow-pink rounded-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-all cursor-pointer z-25"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Title */}
            <div>
              <span className="font-mono text-[10px] text-cosmic-pink uppercase tracking-widest">{selectedProject.category} System</span>
              <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-wide mt-1">{selectedProject.title}</h3>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                  selectedProject.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                }`}>
                  {selectedProject.status}
                </span>
                {selectedProject.featured && <span className="bg-cosmic-purple/10 text-cosmic-purple border border-cosmic-purple/25 text-[10px] font-mono uppercase px-2 py-0.5 rounded">Featured Project</span>}
              </div>
            </div>

            {/* Core Image / Gallery Panel */}
            <div className="space-y-3">
              <div className="h-64 sm:h-80 w-full rounded-xl overflow-hidden border border-white/10 bg-black/50">
                <img
                  src={selectedProject.gallery && selectedProject.gallery[activeImageIndex] ? selectedProject.gallery[activeImageIndex] : selectedProject.imageUrl}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Gallery Thumbnails */}
              {selectedProject.gallery && selectedProject.gallery.length > 0 && (
                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                  {/* Thumbnail 1: main image */}
                  <div 
                    onClick={() => setActiveImageIndex(0)}
                    className={`w-16 h-12 rounded border cursor-pointer overflow-hidden transition-all ${
                      activeImageIndex === 0 ? 'border-cosmic-pink scale-105' : 'border-white/5 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={selectedProject.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  {/* Thumbnails 2+: gallery */}
                  {selectedProject.gallery.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveImageIndex(idx + 1)}
                      className={`w-16 h-12 rounded border cursor-pointer overflow-hidden transition-all ${
                        activeImageIndex === idx + 1 ? 'border-cosmic-pink scale-105' : 'border-white/5 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Detailed Description */}
            <div className="space-y-3 bg-black/30 p-4 rounded-xl border border-white/5">
              <h4 className="font-mono text-xs text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-cosmic-pink" />
                <span>Operational Specifications</span>
              </h4>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                {selectedProject.longDescription || selectedProject.description}
              </p>
            </div>

            {/* Technology Stack Grid */}
            <div className="space-y-2">
              <h4 className="font-mono text-xs text-gray-400 uppercase tracking-wider">Targeted Tech Modules</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-cosmic-cyan"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 border-t border-white/5 pt-5">
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-mono tracking-wider uppercase transition-all"
              >
                <Github className="w-4 h-4" />
                <span>Source Code</span>
              </a>

              <a
                href={selectedProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cosmic-purple to-cosmic-pink text-white font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-neon-pink cursor-pointer active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Access Live Link</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

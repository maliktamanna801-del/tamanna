import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'database.json');

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  category: string;
  status: 'Completed' | 'In Progress' | 'Beta';
  featured: boolean;
  imageUrl: string;
  gallery?: string[];
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  imageUrl: string;
  verificationUrl: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'language' | 'other';
  level: number; // 0-100
  progress: number; // 0-100
  experience: string; // e.g. "2 years"
  projectsCount: number;
  learningProgress: string; // "Advanced", "Intermediate", "Learning"
  description: string;
  logo: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'unread' | 'read' | 'flagged';
}

export interface ResumeData {
  name: string;
  role: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  education: Array<{
    institution: string;
    degree: string;
    period: string;
    score: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    period: string;
    description: string[];
  }>;
}

export interface AnalyticsData {
  visitors: number;
  sectionViews: Record<string, number>;
  messageCount: number;
}

export interface DatabaseSchema {
  projects: Project[];
  certificates: Certificate[];
  skills: Skill[];
  messages: Message[];
  resume: ResumeData;
  analytics: AnalyticsData;
}

const DEFAULT_RESUME: ResumeData = {
  name: "Tamanna Malik",
  role: "Full Stack Developer",
  summary: "Full Stack Developer & BCA Student specializing in AI & Data Science. Passioned for building immersive web applications, AI-powered systems, and beautiful futuristic user experiences. Skilled in Java, React, Python, PHP, and modern backend integrations.",
  email: "maliktamanna801@gmail.com",
  phone: "[Placeholder: Your Phone Number]",
  location: "India",
  github: "https://github.com/maliktamanna",
  linkedin: "https://linkedin.com/in/maliktamanna",
  education: [
    {
      institution: "Your BCA College Name",
      degree: "Bachelor of Computer Applications (BCA) - AI & Data Science Specialist",
      period: "2024 - 2027",
      score: "CGPA: 9.2 (Current)"
    }
  ],
  experience: [
    {
      company: "Google Developer Student Clubs (GDSC)",
      role: "AI & Full Stack Lead / Core Member",
      period: "2025 - Present",
      description: [
        "Developing full-stack web solutions and conducting workshops on AI models and data science basics.",
        "Created an automated portfolio platform and customized server solutions using Node.js and TypeScript."
      ]
    },
    {
      company: "Software Developer Intern",
      role: "Frontend & API Specialist",
      period: "June 2025 - August 2025",
      description: [
        "Built responsive dashboards with React and integrated external REST APIs, enhancing telemetry analysis."
      ]
    }
  ]
};

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Cosmos AI Exploration Station",
    description: "A futuristic orbital dashboard integrating server-side Gemini AI for celestial telemetry and autonomous satellite tracking.",
    longDescription: "An advanced portal mimicking a spacecraft telemetry panel. Integrates the Gemini 3.5 API to provide deep analyses of planetary orbits, satellite health forecasts, and simulated neural engine logs. Styled with deep glow panels, custom particle shields, and glassmorphism headers.",
    techStack: ["React 19", "Three.js", "Express", "Gemini API", "Tailwind CSS"],
    githubUrl: "https://github.com/maliktamanna/cosmos-ai",
    liveUrl: "#",
    category: "AI & Data Science",
    status: "Completed",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600",
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600"
    ]
  },
  {
    id: "2",
    title: "Quantum Neural Grid",
    description: "Real-time visual node architecture and code compiler with high performance web interfaces.",
    longDescription: "Designed for computational modeling. Features an interactive 3D node editor using canvas shaders, reactive states for graph manipulation, and an Express compiler backend. Tracks real-time compute load and database queries.",
    techStack: ["Java", "Spring Boot", "React", "Three.js", "MongoDB"],
    githubUrl: "https://github.com/maliktamanna/quantum-neural-grid",
    liveUrl: "#",
    category: "Full Stack",
    status: "Completed",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=600",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600"
    ]
  },
  {
    id: "3",
    title: "Orion Data Harvester",
    description: "Data pipeline and scraper monitoring web console designed for hyper-scale analysis.",
    longDescription: "A Python-based distributed ETL dashboard that parses scientific telemetry. Features real-time charts powered by Recharts, automated query alerts, and modular schema adjustments from the central control deck.",
    techStack: ["Python", "PHP", "MySQL", "Tailwind CSS", "Recharts"],
    githubUrl: "https://github.com/maliktamanna/orion-data",
    liveUrl: "#",
    category: "Data Science",
    status: "Completed",
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200"
  },
  {
    id: "4",
    title: "Helios Solar Flare Prediction",
    description: "A machine learning analytical tool checking coronal mass ejection probabilities.",
    longDescription: "Built with Python scikit-learn and backed by a robust Express API. Computes dynamic solar spot index factors and exposes beautiful historical analysis grids for astrophysics research.",
    techStack: ["Python", "Flask", "React", "D3.js", "Tailwind CSS"],
    githubUrl: "https://github.com/maliktamanna/helios-prediction",
    liveUrl: "#",
    category: "AI & Data Science",
    status: "In Progress",
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200"
  }
];

const DEFAULT_SKILLS: Skill[] = [
  { id: "1", name: "Java", category: "language", level: 90, progress: 90, experience: "2 Years", projectsCount: 6, learningProgress: "Advanced", description: "Object-oriented software architectures, algorithms, and modular enterprise servers.", logo: "Coffee" },
  { id: "2", name: "React", category: "frontend", level: 95, progress: 95, experience: "2 Years", projectsCount: 12, learningProgress: "Advanced", description: "State hooks, Fiber, context routing, Drei physics, motion layers, and custom Canvas bridges.", logo: "Cpu" },
  { id: "3", name: "HTML", category: "frontend", level: 95, progress: 95, experience: "3 Years", projectsCount: 20, learningProgress: "Advanced", description: "Semantic markup, SEO optimization structures, accessible ARIA hierarchies.", logo: "FileCode" },
  { id: "4", name: "CSS", category: "frontend", level: 90, progress: 90, experience: "3 Years", projectsCount: 20, learningProgress: "Advanced", description: "Flexbox, Grid systems, animations, Tailwind utility layers, glass effects, and glowing shades.", logo: "Palette" },
  { id: "5", name: "JavaScript", category: "language", level: 95, progress: 95, experience: "3 Years", projectsCount: 18, learningProgress: "Advanced", description: "ES6+, Event execution, DOM control, asynchronous fetch routines, and modular engines.", logo: "Flame" },
  { id: "6", name: "Python", category: "language", level: 85, progress: 85, experience: "1.5 Years", projectsCount: 5, learningProgress: "Advanced", description: "Scientific analysis, data manipulation, Pandas, scikit-learn, and API backend routes.", logo: "Terminal" },
  { id: "7", name: "PHP", category: "language", level: 75, progress: 75, experience: "1 Year", projectsCount: 4, learningProgress: "Intermediate", description: "Server templates, database connectors, and classical server routing configurations.", logo: "Database" },
  { id: "8", name: "MySQL", category: "database", level: 85, progress: 85, experience: "2 Years", projectsCount: 8, learningProgress: "Advanced", description: "Relational query modeling, schema joins, transactional indexes, and safe injections filters.", logo: "DatabaseBackup" },
  { id: "9", name: ".NET", category: "backend", level: 70, progress: 70, experience: "1 Year", projectsCount: 3, learningProgress: "Intermediate", description: "C# backend microservices, MVC architectures, and clean database controllers.", logo: "Layers" }
];

const DEFAULT_CERTIFICATES: Certificate[] = [
  {
    id: "1",
    title: "Google Cloud Professional Developer",
    issuer: "Google Cloud",
    date: "May 2025",
    credentialId: "GCP-PRO-8893",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600",
    verificationUrl: "#"
  },
  {
    id: "2",
    title: "AI & Data Science Professional Certificate",
    issuer: "IBM & Coursera",
    date: "February 2025",
    credentialId: "IBM-AI-DS-2025",
    imageUrl: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=600",
    verificationUrl: "#"
  }
];

class FileDatabase {
  private data!: DatabaseSchema;

  constructor() {
    this.load();
  }

  private load() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
        // Guarantee everything is in shape
        if (!this.data.projects) this.data.projects = DEFAULT_PROJECTS;
        if (!this.data.skills) this.data.skills = DEFAULT_SKILLS;
        if (!this.data.certificates) this.data.certificates = DEFAULT_CERTIFICATES;
        if (!this.data.messages) this.data.messages = [];
        if (!this.data.resume) this.data.resume = DEFAULT_RESUME;
        if (!this.data.analytics) {
          this.data.analytics = { visitors: 420, sectionViews: { home: 120, about: 95, skills: 80, projects: 70, certificates: 35, contact: 20 }, messageCount: 0 };
        }
      } catch (err) {
        console.error('Error parsing database.json, resetting to defaults:', err);
        this.reset();
      }
    } else {
      this.reset();
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving database.json:', err);
    }
  }

  private reset() {
    this.data = {
      projects: DEFAULT_PROJECTS,
      certificates: DEFAULT_CERTIFICATES,
      skills: DEFAULT_SKILLS,
      messages: [],
      resume: DEFAULT_RESUME,
      analytics: {
        visitors: 512,
        sectionViews: {
          home: 180,
          about: 142,
          skills: 110,
          projects: 92,
          certificates: 56,
          contact: 45
        },
        messageCount: 0
      }
    };
    this.save();
  }

  // Projects CRUD
  getProjects() { return this.data.projects; }
  addProject(proj: Omit<Project, 'id'>) {
    const id = Date.now().toString();
    const newProj: Project = { id, ...proj };
    this.data.projects.push(newProj);
    this.save();
    return newProj;
  }
  updateProject(id: string, updates: Partial<Project>) {
    const idx = this.data.projects.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.projects[idx] = { ...this.data.projects[idx], ...updates };
      this.save();
      return this.data.projects[idx];
    }
    return null;
  }
  deleteProject(id: string) {
    const originalLength = this.data.projects.length;
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    if (this.data.projects.length !== originalLength) {
      this.save();
      return true;
    }
    return false;
  }

  // Skills CRUD
  getSkills() { return this.data.skills; }
  addSkill(skill: Omit<Skill, 'id'>) {
    const id = Date.now().toString();
    const newSkill: Skill = { id, ...skill };
    this.data.skills.push(newSkill);
    this.save();
    return newSkill;
  }
  updateSkill(id: string, updates: Partial<Skill>) {
    const idx = this.data.skills.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.data.skills[idx] = { ...this.data.skills[idx], ...updates };
      this.save();
      return this.data.skills[idx];
    }
    return null;
  }
  deleteSkill(id: string) {
    const originalLength = this.data.skills.length;
    this.data.skills = this.data.skills.filter(s => s.id !== id);
    if (this.data.skills.length !== originalLength) {
      this.save();
      return true;
    }
    return false;
  }

  // Certificates CRUD
  getCertificates() { return this.data.certificates; }
  addCertificate(cert: Omit<Certificate, 'id'>) {
    const id = Date.now().toString();
    const newCert: Certificate = { id, ...cert };
    this.data.certificates.push(newCert);
    this.save();
    return newCert;
  }
  updateCertificate(id: string, updates: Partial<Certificate>) {
    const idx = this.data.certificates.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.data.certificates[idx] = { ...this.data.certificates[idx], ...updates };
      this.save();
      return this.data.certificates[idx];
    }
    return null;
  }
  deleteCertificate(id: string) {
    const originalLength = this.data.certificates.length;
    this.data.certificates = this.data.certificates.filter(c => c.id !== id);
    if (this.data.certificates.length !== originalLength) {
      this.save();
      return true;
    }
    return false;
  }

  // Messages
  getMessages() { return this.data.messages; }
  addMessage(msg: Omit<Message, 'id' | 'timestamp' | 'status'>) {
    const id = Date.now().toString();
    const newMsg: Message = {
      id,
      ...msg,
      timestamp: new Date().toISOString(),
      status: 'unread'
    };
    this.data.messages.push(newMsg);
    this.data.analytics.messageCount = this.data.messages.length;
    this.save();
    return newMsg;
  }
  updateMessageStatus(id: string, status: Message['status']) {
    const idx = this.data.messages.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.data.messages[idx].status = status;
      this.save();
      return this.data.messages[idx];
    }
    return null;
  }
  deleteMessage(id: string) {
    const originalLength = this.data.messages.length;
    this.data.messages = this.data.messages.filter(m => m.id !== id);
    if (this.data.messages.length !== originalLength) {
      this.data.analytics.messageCount = this.data.messages.length;
      this.save();
      return true;
    }
    return false;
  }

  // Resume
  getResume() { return this.data.resume; }
  updateResume(updates: Partial<ResumeData>) {
    this.data.resume = { ...this.data.resume, ...updates };
    this.save();
    return this.data.resume;
  }

  // Analytics
  getAnalytics() { return this.data.analytics; }
  incrementVisitor() {
    this.data.analytics.visitors += 1;
    this.save();
    return this.data.analytics.visitors;
  }
  incrementSectionView(section: string) {
    if (!this.data.analytics.sectionViews[section]) {
      this.data.analytics.sectionViews[section] = 0;
    }
    this.data.analytics.sectionViews[section] += 1;
    this.save();
    return this.data.analytics.sectionViews[section];
  }
}

export const db = new FileDatabase();

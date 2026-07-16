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
  level: number;
  progress: number;
  experience: string;
  projectsCount: number;
  learningProgress: string;
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

export interface PortfolioData {
  projects: Project[];
  skills: Skill[];
  certificates: Certificate[];
  resume: ResumeData;
  analytics: AnalyticsData;
}

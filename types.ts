
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  github: string;
}

export interface Skill {
  name: string;
  category: string;
  level: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface UserCredentials {
  username: string;
  passwordHash: string;
  recoveryEmail: string;
  recoveryPhone: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  profileImage: string;
  backgroundImage: string;
  cvUrl?: string;
  about: string;
  projects: Project[];
  skills: Skill[];
  skillCategories: string[];
  experience: Experience[];
  messages: ContactMessage[];
  email: string;
  github: string;
  linkedin: string;
  facebook?: string;
  whatsapp?: string;
  auth?: UserCredentials; // Persistent security credentials
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

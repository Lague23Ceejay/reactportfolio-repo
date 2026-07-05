// src/types/portfolio.ts

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  stack: string[];      
  liveUrl: string;      
  githubUrl: string;    
  featured: boolean;    
  deploymentUrl?: string;     
  sourceCodeUrl?: string;     
  frameworksArray?: string[]; 
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

// 🎓 EXPORTED ALIGNMENT: Extracted from inline to standalone named interface
export interface GraduationData {
  isEnabled: boolean;
  badgeText: string;
  title: string;
  subtitle: string;
  message: string;
  gcashUrl: string;
}

export interface PortfolioData {
  hero: { name: string; title: string; tagline: string; profileImage: string; profileImageSecondary?: string; };
  graduation?: GraduationData;
  about: { bio: string; skills: { name: string; iconCode: string; description?: string; }[] };
  projects: ProjectItem[];
  gallery: GalleryItem[];
  contact: { email: string; github: string; linkedin: string; upwork: string; websiteUrl: string; resumeUrl?: string; resumeLabel?: string };
  settings: {
    theme: string;
    pinHash: string;
    audioTracks?: {
      cosmic?: string;
      creamy?: string;
      arctic?: string;
      [key: string]: string | undefined;
    };
  };
}


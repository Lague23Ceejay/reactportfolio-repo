// src/types/portfolio.ts

export interface StackItem {
  name: string;
  level: number;
  color?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  stack: StackItem[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  deploymentUrl?: string;
  sourceCodeUrl?: string;
  frameworksArray?: string[];
}

/** Gallery item used across Admin, Gallery, Lightbox and store */
export interface GalleryItem {
  id: string | number;
  title?: string;
  subtitle?: string;
  category?: string;
  imageUrl: string;
}

/** Exported graduation data */
export interface GraduationData {
  isEnabled: boolean;
  badgeText: string;
  title: string;
  subtitle: string;
  message: string;
  gcashUrl: string;
}

export interface PortfolioData {
  hero: {
    name: string;
    title: string;
    tagline: string;
    profileImage: string;
    profileImageSecondary?: string;
  };
  graduation?: GraduationData;
  about: {
    bio: string;
    skills: { name: string; iconCode: string; description?: string }[];
  };
  projects: ProjectItem[];
  gallery: GalleryItem[];
  contact: {
    email: string;
    github: string;
    linkedin: string;
    upwork: string;
    websiteUrl: string;
    resumeUrl?: string;
    resumeLabel?: string;
  };
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

// src/types/portfolio.ts

export type GraduationData = {
  isEnabled?: boolean;
  badgeText?: string;
  title?: string;
  subtitle?: string;
  message?: string;
  gcashUrl?: string;
  // legacy fields, kept optional for backwards compatibility
  school?: string;
  degree?: string;
  year?: string;
};

export type GalleryItem = {
  id?: string | number; // optional to allow temporary items before persisted id
  imageUrl: string;
  title?: string;
  subtitle?: string;
  category?: string;
};

export type StackItem = {
  name: string;
  level: number;
};

export type Project = {
  id?: string | number;
  title: string;
  description?: string;
  longDescription?: string;
  screenshots?: string[];
  videoUrl?: string;
  url?: string;
  repo?: string;
  tags?: string[];
  stack?: StackItem[];
  githubUrl?: string;
  liveUrl?: string;
  deploymentUrl?: string;
  sourceCodeUrl?: string;
  featured?: boolean;
  frameworksArray?: string[];
};

export type SkillItem = {
  name: string;
  iconCode: string;
  description?: string;
};

export type PortfolioData = {
  hero: {
    name: string;
    title: string;
    tagline: string;
    profileImage: string;
    profileImageSecondary?: string;
  };
  about: {
    bio: string;
    skills: SkillItem[];
  };
  projects: Project[];
  gallery: GalleryItem[];
  categories: string[]; // <-- categories are now part of the data model
  contact: {
    email?: string;
    github?: string;
    linkedin?: string;
    upwork?: string;
    websiteUrl?: string;
    resumeUrl?: string;
  };
  graduation?: GraduationData;
  settings: {
    theme: string;
    pinHash?: string;
    audioTracks?: {
      cosmic?: string;
      arctic?: string;
      creamy?: string;
    };
  };
};
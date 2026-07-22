// src/types/portfolio.ts

export type GraduationData = {
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

export type Project = {
  id?: string | number;
  title: string;
  description?: string;
  url?: string;
  repo?: string;
  tags?: string[];
};

export type PortfolioData = {
  hero: {
    name: string;
    title: string;
    tagline: string;
    profileImage: string;
  };
  about: {
    bio: string;
    skills: string[];
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
  };
  settings: {
    theme: string;
    pinHash?: string;
  };
};

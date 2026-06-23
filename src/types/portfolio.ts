export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  stack: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string; // Base64 encoded string
}

export interface PortfolioData {
  hero: {
    name: string;
    title: string;
    tagline: string;
    profileImage: string; // Base64 encoded string
  };
  about: {
    bio: string;
    skills: string[];
  };
  projects: ProjectItem[];
  gallery: GalleryItem[];
  contact: {
    email: string;
    github: string;
    linkedin: string;
    websiteUrl: string;
  };
  settings: {
    theme: string;
    pinHash: string; // SHA-256 string for the admin overlay gate
  };
}

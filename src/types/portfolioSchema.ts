// src/types/portfolioSchema.ts
import { z } from "zod";

export const PortfolioSchema = z.object({
  hero: z.object({
    name: z.string(),
    title: z.string(),
    tagline: z.string(),
    profileImage: z.string().url(),
  }),
  about: z.object({
    bio: z.string(),
    skills: z.array(z.object({
      name: z.string(),
      iconCode: z.string(),
    })),
  }),
  projects: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    stack: z.array(z.string()),
    liveUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    featured: z.boolean(),
    deploymentUrl: z.string().url().optional(),
  })),
  gallery: z.array(z.object({
    id: z.string(),
    url: z.string().url(),
    category: z.string().optional(),
  })),
  settings: z.object({
    theme: z.string(),
    pinHash: z.string(),
    audioTracks: z.array(z.string()).optional(),
  }),
  graduation: z.object({
    isEnabled: z.boolean(),
    badgeText: z.string(),
    title: z.string(),
    subtitle: z.string(),
    message: z.string(),
    gcashUrl: z.string().optional(),
  }),
});

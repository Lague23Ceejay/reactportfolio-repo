// src/types/portfolioSchema.ts
import { z } from 'zod';

const StackItem = z.object({
  name: z.string(),
  level: z.number().min(0).max(100),
});

export const PortfolioSchema = z.object({
  hero: z.object({
    name: z.string(),
    title: z.string(),
    tagline: z.string(),
    profileImage: z.string().url(),
    profileImageSecondary: z.string().optional(),
  }),
  about: z.object({
    bio: z.string(),
    skills: z.array(
      z.object({
        name: z.string(),
        iconCode: z.string(),
        description: z.string().optional(),
      })
    ),
  }),
  projects: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string(),
      description: z.string().optional(),
      longDescription: z.string().optional(),
      screenshots: z.array(z.string()).optional(),
      videoUrl: z.string().optional(),
      stack: z.array(StackItem).optional(),
      liveUrl: z.string().optional(),
      githubUrl: z.string().optional(),
      sourceCodeUrl: z.string().optional(),
      featured: z.boolean().optional(),
      deploymentUrl: z.string().optional(),
      frameworksArray: z.array(z.string()).optional(),
    })
  ),
  gallery: z.array(
    z.object({
      id: z.string().optional(),
      imageUrl: z.string().url(), // renamed from url -> imageUrl to match runtime types
      title: z.string().optional(),
      subtitle: z.string().optional(),
      category: z.string().optional(),
    })
  ),
  categories: z.array(z.string()).optional(),
  contact: z.object({
    email: z.string().optional(),
    github: z.string().optional(),
    indeed: z.string().optional(),
    facebook: z.string().optional(),
    websiteUrl: z.string().optional(),
    resumeUrl: z.string().optional(),
  }),
  settings: z.object({
    theme: z.string(),
    pinHash: z.string().optional(),
    audioTracks: z
      .object({
        cosmic: z.string().optional(),
        arctic: z.string().optional(),
        creamy: z.string().optional(),
      })
      .optional(),
  }),
  graduation: z
    .object({
      isEnabled: z.boolean().optional(),
      badgeText: z.string().optional(),
      title: z.string().optional(),
      subtitle: z.string().optional(),
      message: z.string().optional(),
      gcashUrl: z.string().optional(),
    })
    .optional(),
});

// Single source of truth going forward: infer the runtime type from the schema.
export type PortfolioSchemaType = z.infer<typeof PortfolioSchema>;
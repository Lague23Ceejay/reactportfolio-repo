# React Portfolio

A modern React + TypeScript portfolio site with animated sections, immersive theme transitions, and a lightweight admin workflow for updating content.

## Overview

This project is a single-page portfolio experience built with Vite and React. It includes:

- a polished landing experience with hero, graduation, about, projects, gallery, and contact sections
- three interactive dimension themes: Cosmic, Creamy, and Arctic
- a PIN-protected admin overlay for editing portfolio content in place
- serverless endpoints for saving content and uploading images on Vercel

## Features

- Responsive and animated UI with Framer Motion, GSAP, and custom visual effects
- Dynamic theming powered by Zustand in src/store/themeStore.ts
- Portfolio content loaded from public/data.json at runtime
- Lazy-loaded sections for smoother initial page rendering
- Vercel-ready API routes for content persistence and media uploads

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Framer Motion
- GSAP
- Three.js / OGL
- @vercel/blob
- @octokit/rest

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
api/
  save-content.ts      # Saves portfolio content updates to GitHub through a Vercel serverless endpoint
  upload-image.ts      # Uploads media files to Vercel Blob for portfolio assets

public/
  data.json            # Main portfolio content source loaded at runtime

src/
  main.tsx             # React entry point that mounts the app to the DOM
  App.tsx              # Main app shell, layout composition, and lazy-loaded sections
  index.css            # Global styles, theme helpers, and visual utility classes

  components/
    admin/
      AdminAboutManager.tsx      # Admin UI for editing the About section
      AdminGalleryManager.tsx    # Admin UI for managing gallery items
      AdminGraduationManager.tsx # Admin UI for graduation content
      AdminOverlay.tsx           # PIN-protected admin overlay wrapper
      AdminProjectsManager.tsx   # Admin UI for editing project entries
    layout/
      Navbar.tsx                 # Top navigation bar
      Footer.tsx                 # Footer content and links
    sections/
      Hero.tsx                   # Hero section with intro and profile content
      About.tsx                  # About section and skill highlights
      Projects.tsx               # Portfolio projects showcase
      Gallery.tsx                # Image gallery section
      Contact.tsx                # Contact details and social links
      GraduationFeature.tsx      # Graduation highlight section
    ui/
      AnimatedBackground.tsx     # Animated background visuals
      CardSwapDeck.tsx          # Interactive card deck UI
      CircularSwitcher.tsx      # Theme switcher UI
      DimensionCursor.tsx       # Custom cursor behavior
      MagicRings.tsx            # Decorative ring effect component
      MagnetEffect.tsx          # Hover/magnetic interaction effect
      Particles.tsx             # Particle background system
      PixelImageTransition.tsx  # Image transition effect
      ResumeEnvelope.tsx        # Resume/contact CTA component
      ScrollReveal.tsx          # Scroll-based reveal animation
      SnowParticles.tsx         # Snow-themed particle effect
      SpotlightCard.tsx         # Highlighted card component
      TargetCursor.tsx          # Target-style cursor effect
      ThemeAudioEngine.tsx      # Audio playback for theme changes

  hooks/
    usePortfolioData.ts         # Fetches and loads portfolio content from public/data.json
    useImageUpload.ts           # Handles client-side image upload requests

  store/
    portfolioStore.ts          # Zustand store for portfolio data state
    themeStore.ts              # Theme packs, dimension switching, and animation state

  types/
    portfolio.ts               # TypeScript interfaces for portfolio content
    theme.ts                   # Theme-related TypeScript types

  utils/
    imageOptimizer.ts          # Image compression and optimization helpers
    renderIconSVG.tsx          # Utility for rendering SVG icons
```

## Content and Admin

The portfolio content is driven by public/data.json. The app fetches this file at runtime and the admin overlay can be opened with the hash fragment #admin.

Key notes:

- Keep public/data.json valid JSON.
- The admin panel writes updates through api/save-content.ts.
- Image uploads are handled through api/upload-image.ts using Vercel Blob.

## Deployment

This app is designed to be deployed on Vercel.

Required environment variables for the content sync API:

- GITHUB_TOKEN
- GITHUB_OWNER
- GITHUB_REPO
- GITHUB_BRANCH

Media uploads also rely on your Vercel Blob configuration.

## Customization Points

- Theme packs and their colors live in src/store/themeStore.ts
- Section-specific UI is organized under src/components/sections
- Global visual styles are handled in src/index.css
- Content changes usually start in public/data.json

## Notes

- Audio is supported through the theme system and is muted by default until enabled in the UI.
- The app uses a custom cursor and layered background effects, so visual tweaks may be easiest in the theme store and UI component files.

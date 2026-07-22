# React Portfolio

A modern React + TypeScript portfolio site built with Vite and Tailwind CSS. It features animated sections, theme-based visuals, and a lightweight admin workflow for updating content.

## Overview

This project is a single-page portfolio experience with:

- Hero, graduation, about, projects, gallery, and contact sections
- Three dimension themes: Cosmic, Creamy, and Arctic
- PIN-protected admin overlay for live content updates
- Serverless API routes for saving content and uploading images

## Features

- Responsive animated UI with scroll reveals and custom cursor effects
- Dynamic theming and animation state managed with Zustand
- Runtime content loading from `public/data.json`
- Lazy-loaded work, gallery, and graduation sections for faster startup
- Vercel-compatible API endpoints for content persistence

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
  save-content.ts      # Saves portfolio content updates to GitHub via Vercel serverless function
  upload-image.ts      # Uploads image assets to Vercel Blob

public/
  data.json            # Runtime portfolio content source
  favicon.svg          # Favicon asset
  icons.svg            # Shared SVG icon sprite

src/
  main.tsx             # React entry point that mounts the app and imports global styles
  App.tsx              # App shell, layout, theming, and lazy-loaded sections
  index.css            # Global styles, Tailwind utilities, and theme CSS variables
  App.css              # App-specific CSS utilities and overrides

  components/
    admin/
      AdminAboutManager.tsx      # Admin editor UI for About section content
      AdminGalleryManager.tsx    # Admin editor UI for gallery items
      AdminGraduationManager.tsx # Admin editor UI for graduation feature data
      AdminOverlay.tsx           # PIN-protected admin overlay and save controls
      AdminProjectsManager.tsx   # Admin editor UI for project entries
    layout/
      Navbar.tsx                 # Top navigation bar with anchors and theme controls
      Footer.tsx                 # Footer section with links and credits
    sections/
      Hero.tsx                   # Landing section with intro text and profile
      About.tsx                  # About section with skills and biography
      Projects.tsx               # Projects showcase with cards and details
      Gallery.tsx                # Image gallery section with hover/preview effects
      Contact.tsx                # Contact form area and social links
      GraduationFeature.tsx      # Graduation highlight section with feature content
    ui/
      AnimatedBackground.tsx     # Background visuals for the Arctic theme
      CardSwapDeck.tsx           # Interactive card deck animation component
      CircularSwitcher.tsx       # Theme dimension switcher UI
      DimensionCursor.tsx        # Custom cursor layer for theme interactions
      MagicRings.tsx             # Decorative ring effect component
      MagnetEffect.tsx           # Magnetic hover interaction
      Particles.tsx              # Particle background system for Cosmic theme
      PixelImageTransition.tsx   # Pixelated image transition effect
      ResumeEnvelope.tsx         # Resume and contact CTA component
      ScrollReveal.tsx           # Scroll-triggered reveal animation wrapper
      SnowParticles.tsx          # Snow particle effect for Creamy theme
      SpotlightCard.tsx          # Highlight card component for featured content
      TargetCursor.tsx           # Target-style cursor accent
      ThemeAudioEngine.tsx       # Audio engine for theme sound effects

  hooks/
    usePortfolioData.ts         # Loads portfolio data and initializes store state
    useImageUpload.ts           # Handles image upload requests from the client

  store/
    portfolioStore.ts           # Zustand store for portfolio content and load state
    themeStore.ts               # Theme packs, dimension switching, and animation state

  types/
    portfolio.ts                # TypeScript interfaces for portfolio content schema
    portfolioSchema.ts          # Zod schema validation for portfolio data
    theme.ts                    # Theme and dimension TypeScript types

  utils/
    imageOptimizer.ts           # Image compression and optimization helper
    renderIconSVG.tsx           # Utility for rendering SVG icons in React

scripts/
  migrate-stack-format.ts        # Script to migrate the stack data format

eslint.config.js                 # ESLint configuration
tailwind.config.js               # Tailwind CSS configuration
tsconfig.json                    # TypeScript base configuration
tsconfig.app.json                # TypeScript config for the app bundle
tsconfig.node.json               # TypeScript config for Node/Vercel server code
vite.config.ts                   # Vite build configuration
package.json                     # Project dependencies and scripts
vercel.json                      # Vercel deployment settings
```

## Content and Admin

This app loads portfolio content from `public/data.json` at runtime. Open the admin overlay by visiting the site URL with `#admin` appended.

Key notes:

- Keep `public/data.json` valid JSON.
- Admin saves are handled by `api/save-content.ts`.
- Image uploads are handled by `api/upload-image.ts` with Vercel Blob.

## Deployment

This project is designed to deploy on Vercel.

Required environment variables for content sync:

- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`

Media uploads require Vercel Blob configuration.

## Customization Points

- Theme packs and dimension settings are defined in `src/store/themeStore.ts`
- Section layouts live in `src/components/sections`
- Global styling is controlled by `src/index.css`
- Portfolio content is sourced from `public/data.json`

## Notes

- Audio playback is available through the theme system and starts muted by default.
- Custom cursor and layered background effects are handled in themed UI components.

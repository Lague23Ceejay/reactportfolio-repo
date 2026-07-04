# React Portfolio

A modern React portfolio with a live admin editor, animated theme switching, custom cursor behavior, and Vercel-backed media/content persistence.

## Overview

This project is a personal portfolio website built with React, TypeScript, and Vite. It loads editable content from public/data.json and exposes a PIN-protected admin overlay for live updates.

## Current Features

- Hero section with editable profile details, tagline, and image assets
- Graduation feature section with optional GCash/QR support and admin editing
- About section with biography text and skill cards
- Projects section with project metadata, stack labels, external links, and featured status
- Gallery section with upload support and category-based organization
- Contact section with configurable email, website URL, and social links
- Hash-based admin entry via #admin and PIN authentication
- Theme/dimension switching across cosmic, creamy, and arctic packs
- Animated backgrounds, reveal transitions, particles, and cursor effects
- Vercel serverless endpoints for saving content and uploading media assets

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- GSAP
- Framer Motion
- Three.js / OGL
- React Icons
- @vercel/node
- @octokit/rest
- @vercel/blob

## Getting Started

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
.
├── api/
│   ├── save-content.ts      # Saves portfolio JSON to GitHub via Vercel
│   └── upload-image.ts      # Uploads images/audio to Vercel Blob
├── public/
│   ├── data.json            # Main portfolio content source
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.tsx              # App shell, theme wrapper, and overlay mounting
│   ├── main.tsx             # React entry point
│   ├── index.css            # Global styles and Tailwind setup
│   ├── App.css              # App-level overrides
│   ├── assets/              # Static images and other local assets
│   ├── components/
│   │   ├── admin/           # Admin overlay and section editors
│   │   │   ├── AdminAboutManager.tsx
│   │   │   ├── AdminGalleryManager.tsx
│   │   │   ├── AdminGraduationManager.tsx
│   │   │   ├── AdminOverlay.tsx
│   │   │   └── AdminProjectsManager.tsx
│   │   ├── layout/          # Shared layout components
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   ├── sections/        # Main page sections
│   │   │   ├── About.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Gallery.tsx
│   │   │   ├── GraduationFeature.tsx
│   │   │   ├── Hero.tsx
│   │   │   └── Projects.tsx
│   │   └── ui/              # UI helpers, animations, and cursors
│   │       ├── AnimatedBackground.tsx
│   │       ├── CardSwapDeck.tsx
│   │       ├── CircularSwitcher.tsx
│   │       ├── DimensionCursor.tsx
│   │       ├── MagicRings.tsx
│   │       ├── MagnetEffect.tsx
│   │       ├── Particles.tsx
│   │       ├── ScrollReveal.tsx
│   │       ├── SnowParticles.tsx
│   │       ├── SpotlightCard.tsx
│   │       └── TargetCursor.tsx
│   ├── hooks/
│   │   ├── useImageUpload.ts
│   │   ├── usePortfolioData.ts
│   │   └── usePortfolioData.ts
│   ├── store/
│   │   ├── portfolioStore.ts
│   │   └── themeStore.ts
│   ├── types/
│   │   ├── portfolio.ts
│   │   └── theme.ts
│   └── utils/
│       └── renderIconSVG.tsx
├── eslint.config.js
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vercel.json
├── vite.config.ts
└── README.md
```

## Core Modules

### Admin System

- src/components/admin/AdminOverlay.tsx
  - Opens on #admin and locks access behind a PIN gate
  - Manages draft state, save flow, and the admin shell
  - Renders the section-specific admin managers

- src/components/admin/AdminAboutManager.tsx
  - Edits about text and skill entries

- src/components/admin/AdminProjectsManager.tsx
  - Edits projects, links, stack labels, and featured flags

- src/components/admin/AdminGalleryManager.tsx
  - Manages gallery items and upload workflows

- src/components/admin/AdminGraduationManager.tsx
  - Edits graduation banner text and supporting media

### Rendering and UI

- src/components/sections/Hero.tsx
- src/components/sections/About.tsx
- src/components/sections/Projects.tsx
- src/components/sections/Gallery.tsx
- src/components/sections/Contact.tsx
- src/components/sections/GraduationFeature.tsx

### Data and Persistence

- public/data.json
  - Main source of truth for the portfolio content

- src/hooks/usePortfolioData.ts
  - Loads content from public/data.json on startup

- src/store/portfolioStore.ts
  - Stores live portfolio data and admin draft state

- api/save-content.ts
  - Persists the current draft back to GitHub via Vercel

- api/upload-image.ts
  - Handles image/audio uploads to Vercel Blob

## Notes

- The app uses theme packs defined in src/store/themeStore.ts for the cosmic, creamy, and arctic experiences.
- The main page cursor is theme-aware and uses the custom cursor logic in src/components/ui/DimensionCursor.tsx.
- The admin overlay uses the normal browser cursor while the main page keeps its custom cursor behavior.
- Skill icon rendering is centralized in src/utils/renderIconSVG.tsx and consumed by the main about/skill cards.

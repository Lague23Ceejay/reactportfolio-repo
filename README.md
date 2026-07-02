# React Portfolio

A modern React portfolio with a live admin editor, custom cursor effects, and Vercel-backed JSON persistence.

## Overview

This project is a personal portfolio website built with React, TypeScript, and Vite. It loads editable content from `public/data.json` and exposes a secure admin overlay for live updates.

Key features:

- Hero section with editable name, title, tagline, and profile image
- Graduation feature section with live banner content and optional GCash QR support
- About section with rich biography and skill cards
- Projects section with dynamic entries, status badges, stack labels, and external links
- Gallery section with grouped image categories and upload support
- Contact section with configurable email, URL, and social links
- Hash-based admin entry via `#admin` and PIN authentication
- Dedicated admin cursor and main page cursor separation
- Animated theme/dimension switching, particle effects, and reveal animations
- Vercel serverless endpoint for saving portfolio JSON data

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- GSAP
- framer-motion
- Three.js / OGL
- @vercel/node
- @octokit/rest
- React Icons

## Getting Started

Install dependencies:

```bash
npm install
```

Run in development:

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

```reactportfolio
.
├── api/
│   └── save-content.ts          # Vercel serverless endpoint to persist content changes
├── public/
│   ├── data.json                # Editable portfolio content source
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.tsx                  # Main app shell, theme wrapper, and overlay mount
│   ├── main.tsx                 # React entry point
│   ├── index.css                # Global CSS imports
│   ├── App.css                  # App-level styles and overrides
│   ├── assets/                  # Static asset files
│   ├── components/
│   │   ├── admin/               # Admin overlay and section editors
│   │   │   ├── AdminAboutManager.tsx
│   │   │   ├── AdminGalleryManager.tsx
│   │   │   ├── AdminGraduationManager.tsx
│   │   │   ├── AdminOverlay.tsx
│   │   │   └── AdminProjectsManager.tsx
│   │   ├── layout/              # Shared layout components
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   ├── sections/            # Page section components
│   │   │   ├── About.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Gallery.tsx
│   │   │   ├── GraduationFeature.tsx
│   │   │   ├── Hero.tsx
│   │   │   └── Projects.tsx
│   │   └── ui/                  # UI helpers, animations, and cursor components
│   │       ├── AdminCursor.tsx
│   │       ├── AnimatedBackground.tsx
│   │       ├── CardSwapDeck.tsx
│   │       ├── CircularSwitcher.tsx
│   │       ├── DimensionCursor.tsx
│   │       ├── MagicRings.tsx
│   │       ├── MagnetEffect.tsx
│   │       ├── Particles.tsx
│   │       ├── ScrollReveal.tsx
│   │       └── SpotlightCard.tsx
│   ├── hooks/
│   │   └── usePortfolioData.ts   # Loads `public/data.json` at startup
│   ├── store/
│   │   ├── portfolioStore.ts     # Zustand store for portfolio data and draft edits
│   │   └── themeStore.ts         # Theme/dimension state and cursor packs
│   └── types/
│       ├── portfolio.ts
│       └── theme.ts
├── eslint.config.js
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── vercel.json
```

## Core Modules

### Admin System

- `src/components/admin/AdminOverlay.tsx`
  - Opens on `#admin` hash and locks access behind a PIN gate
  - Manages draft state, content save flow, and overlay UI
  - Renders admin section editors and a dedicated admin cursor

- `src/components/admin/AdminAboutManager.tsx`
  - Edits about text and skills
  - Supports adding/removing badges and biography content

- `src/components/admin/AdminProjectsManager.tsx`
  - Edits projects with title, description, status, links, and stack labels
  - Supports featured projects and live project list updates

- `src/components/admin/AdminGalleryManager.tsx`
  - Manages gallery categories and image cards
  - Supports image upload and metadata editing

- `src/components/admin/AdminGraduationManager.tsx`
  - Updates graduation banner content, messaging, and image assets
  - Handles file upload and in-panel preview

### Rendering and UI

- `src/components/sections/Hero.tsx`
  - Hero introduction block with profile image and headline copy

- `src/components/sections/GraduationFeature.tsx`
  - Optional graduation banner render

- `src/components/sections/About.tsx`
  - Biography display with skill cards and text section

- `src/components/sections/Projects.tsx`
  - Portfolio project cards with status and link actions

- `src/components/sections/Gallery.tsx`
  - Responsive gallery grid for uploaded images

- `src/components/sections/Contact.tsx`
  - Contact call-to-action and links display

### Cursor and Animation

- `src/components/ui/DimensionCursor.tsx`
  - Custom main page cursor with theme-specific visuals
  - Hides when the admin overlay is active or on mobile

- `src/components/ui/AdminCursor.tsx`
  - Dedicated admin overlay cursor
  - Appears only in overlay mode

- `src/components/ui/ScrollReveal.tsx`
  - Entry animation wrapper for page sections

- `src/components/ui/Particles.tsx`
  - Particle background effect for the cosmic theme

- `src/components/ui/AnimatedBackground.tsx`
  - Animated layout effect for the arctic theme

## Data and Persistence

- `public/data.json`
  - Single source of truth for portfolio content
  - Contains hero, about, projects, gallery, contact, settings, and graduation data

- `src/hooks/usePortfolioData.ts`
  - Fetches `public/data.json` when the app starts
  - Hydrates Zustand store with content data

- `src/store/portfolioStore.ts`
  - Manages live content and admin draft edits

- `api/save-content.ts`
  - Accepts save requests from the admin UI
  - Persists dashboard updates to GitHub via Vercel

## Local Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

## Notes

- The admin overlay uses `#admin` in the URL and keeps the page locked behind a PIN.
- The app loads its editable content from `public/data.json`.
- The main cursor is disabled while the admin overlay is active, and a separate admin cursor is shown.
- `themeStore.ts` controls dimension theme definitions and cursor pack styles.

### Stage 3: Graduation feature and UI polish

- Added graduation section and admin manager
- Added animated UI components like `MagicRings`, `Particles`, `SpotlightCard`, and `ScrollReveal`
- Added dimension theme system for styling variations
- Added richer project metadata and gallery category controls

### Stage 4: Persistence and deployment

- Added `api/save-content.ts` GitHub sync endpoint
- Wired admin commit button to serverless save flow
- Prepared Vercel deployment configuration in `vercel.json`

## Important Files

- `src/App.tsx`
- `src/hooks/usePortfolioData.ts`
- `src/store/portfolioStore.ts`
- `src/store/themeStore.ts`
- `src/components/admin/AdminOverlay.tsx`
- `src/components/admin/AdminGraduationManager.tsx`
- `src/components/admin/AdminGalleryManager.tsx`
- `src/components/admin/AdminAboutManager.tsx`
- `src/components/admin/AdminProjectsManager.tsx`
- `src/components/sections/GraduationFeature.tsx`
- `src/components/sections/Projects.tsx`
- `src/components/sections/Gallery.tsx`
- `api/save-content.ts`
- `public/data.json`

## Notes

- This project is a CMS-style portfolio driven by base64 image uploads and a serverless save API.
- The admin overlay edits state in a draft object and persists it to `public/data.json`.
- The current update improves upload robustness and addresses the admin image upload issue.

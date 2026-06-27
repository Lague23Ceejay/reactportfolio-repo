# React Portfolio

A dynamic React portfolio built with TypeScript, Vite, Tailwind CSS, Zustand, GSAP, and a lightweight admin editor.

## Overview

This project is a personal portfolio website that loads its content from `public/data.json` and exposes an admin overlay for editing portfolio sections live. The app supports:

- Hero profile section with base64 profile image upload
- Graduation feature section with live image and message updates
- About section with rich-text biography and editable skill cards
- Projects section with dynamic project entries, status labels, and framework/URL inputs
- Gallery section for base64 image uploads grouped into categories
- Contact and settings panel for email, external link, and secure admin access
- Serverless save endpoint to persist data changes to GitHub via Vercel
- Animated interactive UI with dimension theme switching, particle effects, and spotlit cards

## Project Structure

```text
.
├── api/
│   └── save-content.ts             # Vercel serverless API endpoint for GitHub content sync
├── public/
│   ├── data.json                   # Live portfolio content source
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.tsx                     # Main app shell, section layout, and admin overlay mount
│   ├── main.tsx                    # React entry point
│   ├── index.css                   # Global CSS imports
│   ├── App.css                     # App-level styles and overrides
│   ├── assets/                     # Static asset directory
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminAboutManager.tsx
│   │   │   ├── AdminGalleryManager.tsx
│   │   │   ├── AdminGraduationManager.tsx
│   │   │   ├── AdminOverlay.tsx
│   │   │   └── AdminProjectsManager.tsx
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   ├── sections/
│   │   │   ├── About.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Gallery.tsx
│   │   │   ├── GraduationFeature.tsx
│   │   │   ├── Hero.tsx
│   │   │   └── Projects.tsx
│   │   └── ui/
│   │       ├── AnimatedBackground.tsx
│   │       ├── CardSwapDeck.tsx
│   │       ├── CircularSwitcher.tsx
│   │       ├── DimensionCursor.tsx
│   │       ├── MagicRings.tsx
│   │       ├── MagnetEffect.tsx
│   │       ├── Particles.tsx
│   │       ├── ScrollReveal.tsx
│   │       ├── SpotlightCard.tsx
│   │       └── ...
│   ├── hooks/
│   │   └── usePortfolioData.ts
│   ├── store/
│   │   ├── portfolioStore.ts
│   │   └── themeStore.ts
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

- `src/App.tsx` – main application shell and section mounts
- `src/hooks/usePortfolioData.ts` – fetches `public/data.json` at startup
- `src/store/portfolioStore.ts` – global Zustand state for live data and draft editing
- `src/store/themeStore.ts` – dimension theme state and styling pack definitions
- `src/components/admin/` – admin overlay and individual section managers
- `src/components/sections/` – hero, graduation, about, projects, gallery, contact renderers
- `src/components/ui/` – reusable interface components and animation helpers
- `api/save-content.ts` – Vercel serverless API that writes `public/data.json` to GitHub
- `public/data.json` – data source containing hero, about, projects, gallery, contact, settings, and graduation blocks

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

## Functional Modules

### Admin System

- `src/components/admin/AdminOverlay.tsx`
  - Unlocks admin mode via `#admin` hash and 4-digit PIN
  - Handles draft state editing and save trigger
  - Uploads base64 images for hero section
  - Coordinates `AdminGraduationManager`, `AdminAboutManager`, `AdminProjectsManager`, and `AdminGalleryManager`
  - Provides settings controls for email, website URL, PIN rotation, and QR export

- `src/components/admin/AdminGraduationManager.tsx`
  - Edits graduation banner state: enabled flag, badge text, title, subtitle, message
  - Handles image uploads via file input and compresses to base64 JPEG
  - Shows preview inside admin panel

- `src/components/admin/AdminGalleryManager.tsx`
  - Manages gallery categories and asset cards
  - Uploads images into gallery items as base64 strings
  - Allows creating categories, deleting grouped assets, and editing asset metadata

- `src/components/admin/AdminAboutManager.tsx`
  - Edits rich-text biography using `contentEditable`
  - Adds/removes skill badges and icon keywords
  - Updates live skill cards in the About section

- `src/components/admin/AdminProjectsManager.tsx`
  - Creates and edits project entries
  - Supports title, description, type, status, deployment URL, source URL, featured flag, and stack sliders
  - Renders dynamic progress bar and stack metadata

### Content Rendering

- `src/components/sections/Hero.tsx`
  - Displays the hero introduction and placeholder profile image
  - Uses `MagicRings` and theme-adaptive styling

- `src/components/sections/GraduationFeature.tsx`
  - Renders the graduation banner only when enabled
  - Displays `gcashUrl` base64 image if present
  - Uses theme-aware accent styling and responsive layout

- `src/components/sections/About.tsx`
  - Renders biography HTML from admin editable content
  - Displays rotating skill cards in a `CardSwap` deck

- `src/components/sections/Projects.tsx`
  - Renders project cards with status, featured badge, progress bars, and external URLs

- `src/components/sections/Gallery.tsx`
  - Renders uploaded gallery images in a responsive layout
  - Skips placeholder cards without images

- `src/components/sections/Contact.tsx`
  - Displays contact prompt and external links from app data

### Data Flow and Persistence

- `public/data.json`
  - Primary source of app content and portfolio configuration
  - Contains hero, about, projects, gallery, contact, settings, and optional graduation data

- `src/hooks/usePortfolioData.ts`
  - Fetches `data.json` on startup with cache-busting query params
  - Populates Zustand state from the fetched data

- `src/store/portfolioStore.ts`
  - Stores `data` (live content) and `draft` (admin edits)
  - Provides actions to update draft and replace live data after save

- `api/save-content.ts`
  - Receives a JSON `content` payload from the admin save button
  - Uses GitHub API to update `public/data.json` in the repo branch
  - Returns success or error for the UI

## Known issue: admin image upload

### Root cause

- Admin image upload relies on client-side `FileReader` and image loading.
- If the selected file is not an image or the reader fails, the image was not processed.
- Graduation state updates could fail if `draft.graduation` was missing or not preserved correctly.

### Fix applied

- Added MIME validation for uploaded files in `AdminOverlay`, `AdminGraduationManager`, and `AdminGalleryManager`
- Wrapped `FileReader` in a promise to catch read errors
- Added `img.onerror` handling for invalid image sources
- Preserved existing `draft.graduation` state during updates
- Ensured admin upload handlers only proceed with valid image data

### How to test

1. Open the app and navigate to `#admin`
2. Enter the admin PIN (or default bypass if enabled)
3. Open `Graduation CMS`
4. Upload an image and verify the preview appears
5. Save changes to verify the admin payload is accepted

### Troubleshooting

- Use a valid image file (`.jpg`, `.png`, `.webp`)
- Check browser console for `FileReader` or image load errors
- Confirm the admin session is authenticated before saving

## Development

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

Preview production build:

```bash
npm run preview
```

## Feature Stages

### Stage 1: Foundation

- Established React + Vite + TypeScript portfolio scaffold
- Added Tailwind CSS and responsive layout
- Built core sections: Hero, About, Projects, Gallery, Contact
- Implemented `data.json` content source and startup fetch hook

### Stage 2: Admin editor

- Added secure admin overlay with hash-based access
- Built editor panels for hero, about, projects, gallery, and settings
- Added CRUD flow for projects and gallery assets
- Added base64 image upload support for hero and gallery

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

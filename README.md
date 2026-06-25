# React Portfolio

A modern portfolio website built with React, TypeScript, Vite, Tailwind CSS, and a lightweight CMS-style admin interface.

## Project Overview

This repository is a portfolio application with dynamic content loaded from `public/data.json`, a live admin editor, and animated UI components.

The app includes:
- Hero, About, Projects, Gallery, and Contact sections
- A global admin overlay for managing portfolio content in real time
- A dynamic data sync API for saving edits to GitHub via Vercel serverless functions
- Smooth animated interactions with GSAP and framer-motion
- A responsive Tailwind CSS-based design

## Tech Stack

- React 18
- TypeScript 5
- Vite 5
- Tailwind CSS 4
- Zustand for state management
- GSAP for card stack animations
- Framer Motion for animation utilities
- React Icons for vector iconography
- @vercel/node for serverless API handler
- Octokit for GitHub content sync

## Dependencies

### Runtime dependencies

- `@octokit/rest` ^21.0.0
- `@vercel/node` ^3.0.0
- `framer-motion` ^11.0.0
- `gsap` ^3.12.5
- `qrcode.react` ^4.0.0
- `react` ^18.3.1
- `react-dom` ^18.3.1
- `react-icons` ^5.6.0
- `zustand` ^4.5.5

### Development dependencies

- `@tailwindcss/vite` ^4.0.0
- `@types/node` ^20.11.0
- `@types/react` ^18.3.3
- `@types/react-dom` ^18.3.0
- `@vitejs/plugin-react` ^4.3.1
- `autoprefixer` ^10.4.19
- `postcss` ^8.4.38
- `tailwindcss` ^4.0.0
- `typescript` ^5.2.2
- `vite` ^5.4.0

## Features

- Dynamic content loading from `public/data.json`
- Admin draft editing using Zustand state store
- Portfolio project management UI with add/remove/update controls
- Inline CSS/Tailwind-powered card animation deck
- URL, Git link, and framework input fields for project entries
- Serverless save endpoint for GitHub content updates
- Animated page reveal and background effects
- Responsive layout with modern dark theme styling

## Project Structure

```text
/
├── api/
│   └── save-content.ts         # Vercel serverless API to sync content via GitHub
├── public/
│   ├── data.json              # Portfolio data source loaded at runtime
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.tsx                # Main app shell with sections and overlay
│   ├── main.tsx               # React bootstrapping entry point
│   ├── index.css              # Global CSS import
│   ├── App.css                # Optional app-specific styles
│   ├── assets/                # Static asset directory
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminAboutManager.tsx
│   │   │   ├── AdminGalleryManager.tsx
│   │   │   ├── AdminOverlay.tsx
│   │   │   └── AdminProjectsManager.tsx
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   ├── sections/
│   │   │   ├── About.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Gallery.tsx
│   │   │   ├── Hero.tsx
│   │   │   └── Projects.tsx
│   │   └── ui/
│   │       ├── AnimatedBackground.tsx
│   │       ├── CardSwapDeck.tsx
│   │       ├── MagnetEffect.tsx
│   │       └── ScrollReveal.tsx
│   ├── hooks/
│   │   └── usePortfolioData.ts
│   ├── store/
│   │   └── portfolioStore.ts
│   └── types/
│       └── portfolio.ts
├── eslint.config.js
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── vercel.json
```

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

- Built for Vercel with a serverless API endpoint under `api/save-content.ts`
- Uses `public/data.json` as the live portfolio data source
- GitHub sync via `@octokit/rest` and `GITHUB_TOKEN` environment variable

## Notes

- The admin overlay edits a draft state in Zustand and writes changes back to `public/data.json`
- The app uses a data fetch hook to refresh content on each page load with cache-busting query params
- The project is designed with a dark, responsive portfolio aesthetic and interactive section transitions

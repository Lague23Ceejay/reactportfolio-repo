# React Portfolio

A polished React + TypeScript portfolio site with a live admin CMS, animated theme switching, immersive UI effects, and Vercel-backed content/media persistence.

## Overview

This project is a personal portfolio website built with Vite and React. The app loads content from public/data.json, renders the portfolio experience across multiple sections, and exposes a PIN-protected admin overlay for live editing.

## What this project includes

- A hero section for profile introduction and branding
- A graduation feature section with optional support content and media
- An about section with biography text and skill cards
- A projects section for featured work and external links
- A gallery section with category-based organization
- A contact section with social links and resume support
- A hash-based admin experience via #admin
- Three visual dimensions: cosmic, creamy, and arctic
- Animated effects such as particles, scroll reveals, cursor interactions, and theme transitions
- Serverless API routes for saving portfolio content and uploading media assets

## Tech stack

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

## Requirements

- Node.js 18+ (recommended)
- npm

## Getting started

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

## Admin workflow

The admin interface is opened with the hash route #admin.

Once open, the app prompts for a PIN. Authentication is verified against the hashed PIN stored in public/data.json, and the UI supports editing content in draft mode before saving changes.

### Saving changes

- The admin overlay updates a draft state locally
- The save action sends the portfolio JSON to the Vercel API route
- The app then refreshes the live data view

## Content and data model

The main portfolio content lives in public/data.json. This file acts as the primary source of truth for:

- hero content
- graduation data
- about section text and skills
- projects and gallery items
- contact details and admin settings

## Project structure

```text
.
├── api/
│   ├── save-content.ts      # Persists portfolio content to GitHub via Vercel
│   └── upload-image.ts      # Uploads images and media assets to Vercel Blob
├── public/
│   ├── data.json            # Main portfolio content source
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.tsx              # Main app shell and section composition
│   ├── main.tsx             # React entry point
│   ├── components/
│   │   ├── admin/           # Admin overlay and section editors
│   │   ├── layout/          # Shared layout components
│   │   ├── sections/        # Main page sections
│   │   └── ui/              # Interaction layers, theme UI, animations
│   ├── hooks/               # Data loading and upload hooks
│   ├── store/               # Zustand state for portfolio and theme data
│   ├── types/               # Type definitions for portfolio data
│   └── utils/               # Helper utilities
├── package.json
├── vercel.json
├── vite.config.ts
└── README.md
```

## Deployment notes

This app is designed to work well with Vercel.

For content persistence, the serverless endpoint in api/save-content.ts relies on GitHub-related environment variables such as:

- GITHUB_TOKEN
- GITHUB_OWNER
- GITHUB_REPO
- GITHUB_BRANCH

For media uploads, the upload route uses Vercel Blob and should be configured in your Vercel environment.

## Improvements identified during review

The README was expanded to better reflect the actual architecture and usage of the project, including:

- clearer local setup instructions
- a more accurate overview of the admin CMS workflow
- deployment and environment-variable context
- a concise project structure summary
- improved descriptions of the portfolio data flow and UI systems

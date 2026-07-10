# React Portfolio

A polished React + TypeScript portfolio site with a live admin CMS, animated theme switching, immersive UI effects, and Vercel-backed content/media persistence.

## Overview

This repo powers a single-page portfolio experience. Content is loaded from `public/data.json`; the app renders multiple sections and exposes a PIN-protected admin overlay (open with `#admin`) for live edits and content publishing.

## Quick start

Install and run locally:

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Where to change UI elements (buttons, cards, background)

If you need to adjust colors, sizes, spacing or behavior for the main interactive elements, edit these files:

- Buttons: update per-theme button styles in `src/store/themeStore.ts` (the `ThemePack` entries control `accent`, `accentBg`, `accentBorder`, `fontClass`, and `cardClass` used across components). Change visual defaults and add utility classes there.
- Generic button components and per-instance classes: `src/components/ui/ResumeEnvelope.tsx`, `src/components/layout/Navbar.tsx`, and section headers (e.g. `src/components/sections/About.tsx`) — edit the `className` strings for padding, font-size, rounded corners, and border.
- Cards (tech stack, projects, gallery):
	- Tech stack cards: `src/components/ui/CardSwapDeck.tsx` — adjust card width/height (`w-36 h-36`), border radius, and inner padding; the modal overlay sizing is also here.
	- Project cards: `src/components/sections/Projects.tsx` — modify card wrapper classes, `max-w` values, and the `cardClass` theme variable.
	- Gallery image cards: `src/components/sections/Gallery.tsx` — change thumbnail sizes and `object-contain` vs `object-cover` behavior.
- Background / theme visuals:
	- Theme variables and `bgClass` per dimension: `src/store/themeStore.ts` (preferred place to set `bg-neon-arctic` or other classes).
	- Global styles and helpers (radial gradients, colors): `src/index.css` — add or tune `.bg-neon-arctic` and other custom background classes.
	- Animated canvas-based backgrounds: `src/components/ui/AnimatedBackground.tsx` — change palette, particle counts, blur/shadow and gradient masking.

Notes about theming:
- `themeStore.ts` defines three dimension packs: `cosmic`, `creamy`, `arctic`. Each pack exposes `bgClass`, `textClass`, `accentClass`, `cardClass`, and `cursor` settings. Prefer changing values here so changes propagate consistently.
- If you tweak `bgClass` using Tailwind arbitrary classes (e.g. `bg-[radial-gradient(...)]`) prefer moving complex gradients into `src/index.css` as named classes (`.bg-neon-arctic`) — this is more stable across Tailwind/Vite builds.

## How to change a color or size example

- To change the tech-stack card size, edit `src/components/ui/CardSwapDeck.tsx`: replace `w-36 h-36` with `w-44 h-44` (or a responsive class list like `w-28 sm:w-36 md:w-44`).
- To change the primary accent color for the arctic theme, edit `src/store/themeStore.ts` and update the `accent` and `accentBg` values for the `arctic` pack. Example keys: `accent: '#B069DB'` and `accentBg: '#301959'`.
- To alter the neon background layers, prefer editing `src/index.css` and `.bg-neon-arctic` gradients rather than inlining in `themeStore.ts`.

## Admin & content model

The primary content file is `public/data.json`. Use the admin overlay (`#admin`) to make live edits; the admin UI tracks a draft state and posts changes to `api/save-content.ts` which persists to GitHub (requires GitHub tokens in Vercel env).

Keep `public/data.json` valid JSON — avoid merge conflict markers and BOMs. If JSON parsing errors occur, check for `<<<<<<<`/`>>>>>>>` or leading UTF-8 BOM bytes (`EF BB BF`).

## Deployment

The site is intended for Vercel. Environment variables used by serverless endpoints include:

- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`

Media uploads rely on Vercel Blob configuration.

## Troubleshooting tips

- If a modal or overlay appears misaligned when clicked from inside a transformed container (animated marquee, scaled parent), render the overlay with a portal to `document.body` (see `src/components/ui/CardSwapDeck.tsx` for the portal example).
- If cursor or pointer interactions block clicks, verify custom cursor elements use `pointer-events: none` and that overlay wrappers use `pointer-events-auto` when appropriate (see `src/components/ui/DimensionCursor.tsx`).
- Large build chunks: if bundles exceed 500 kB, consider dynamic imports or `build.rollupOptions.output.manualChunks` in `vite.config.ts`.

## Where to look for specific UI changes

- Buttons: `src/components/ui/ResumeEnvelope.tsx`, `src/components/layout/Navbar.tsx`, `src/components/ui/*`
- Cards: `src/components/ui/CardSwapDeck.tsx`, `src/components/sections/Projects.tsx`, `src/components/sections/Gallery.tsx`
- Backgrounds: `src/components/ui/AnimatedBackground.tsx`, `src/index.css`, `src/store/themeStore.ts`

## Project structure

Quick tree of the repository to help locate files mentioned above:

```
.
├── api/
│   ├── save-content.ts        # Persist content to GitHub (Vercel serverless)
│   └── upload-image.ts        # Upload media to Vercel Blob
├── public/
│   ├── data.json              # Main portfolio content source (primary data model)
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.tsx                # Main app shell and section composition
│   ├── main.tsx               # React entry point
│   ├── index.css              # Global CSS and custom background utilities
	│   ├── components/
│   │   │   ├── admin/         # Admin overlay and section editors
│   │   │   ├── layout/        # Shared layout components (Navbar, Footer)
│   │   │   ├── sections/      # Main page sections (Hero, About, Projects, Gallery)
│   │   │   └── ui/            # Interaction layers (CardSwapDeck, AnimatedBackground, Cursor)
│   ├── hooks/                 # Data loading and upload hooks
│   ├── store/                 # Zustand state for portfolio and theme data (themeStore.ts)
│   ├── types/                 # Type definitions for portfolio data
│   └── utils/                 # Helper utilities (image optimizer, icon renderer)
├── package.json
├── vercel.json
├── vite.config.ts
└── README.md
```

## Contributing

If you submit changes that affect visual themes, please:

1. Update `src/store/themeStore.ts` with any new theme variables.
2. Add or adjust a named CSS utility in `src/index.css` for complex backgrounds.
3. Run `npm run build` and verify no Tailwind or TypeScript warnings.

---

If you'd like, I can add a short section with exact class examples for mobile/desktop responsive sizes for the main buttons/cards and produce a PR-style diff to apply them. Tell me which components you want adjusted first and I'll implement them.

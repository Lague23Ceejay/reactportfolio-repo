// src/App.tsx
import React, { Suspense } from 'react';
import { usePortfolioData } from './hooks/usePortfolioData';
import { usePortfolioStore } from './store/portfolioStore';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Contact } from './components/sections/Contact';
import { AdminOverlay } from './components/admin/AdminOverlay';
import { AnimatedBackground } from './components/ui/AnimatedBackground';
import { ScrollReveal } from './components/ui/ScrollReveal';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { Particles } from './components/ui/Particles';
import { useThemeStore, dimensionPacks } from './store/themeStore';
import { DimensionCursor } from './components/ui/DimensionCursor';
import { CircularSwitcher } from './components/ui/CircularSwitcher';
import { SnowParticles } from './components/ui/SnowParticles';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy-load heavy sections (map named exports to default)
const Projects = React.lazy(() =>
  import('./components/sections/Projects').then((mod) => {
    // If the module exports a named `Projects`, use it; otherwise fall back to default
    return { default: (mod as any).Projects ?? (mod as any).default };
  })
);

const Gallery = React.lazy(() =>
  import('./components/sections/Gallery').then((mod) => {
    return { default: (mod as any).Gallery ?? (mod as any).default };
  })
);

const GraduationFeature = React.lazy(() =>
  import('./components/sections/GraduationFeature').then((mod) => {
    return { default: (mod as any).GraduationFeature ?? (mod as any).default };
  })
);

export default function App() {
  usePortfolioData();
  const { isLoading, error } = usePortfolioStore();
  const { currentDimension, isTransitioning } = useThemeStore();
  const pack = dimensionPacks[currentDimension];

  const cssVars: React.CSSProperties = {
    ['--accent' as any]: pack.accent,
    ['--accent-bg' as any]: pack.accentBg,
    ['--accent-border' as any]: pack.accentBorder,
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 text-red-400">
        <p>Initialization Error: {error}</p>
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden transition-all duration-500 ease-in-out ${pack.bgClass} ${pack.fontClass} ${pack.textPrimary}`}
      style={{
        ...cssVars,
      }}
    >
      {currentDimension === 'cosmic' && (
        <Particles
          particleColors={['#ffffff', '#ffffff', '#f8fafc', '#cbd5e1']}
          particleCount={160}
          particleSpread={15}
          speed={0.03}
          particleBaseSize={12}
          sizeRandomness={3.5}
          moveParticlesOnHover={true}
          particleHoverFactor={1.5}
          alphaParticles={true}
          disableRotation={false}
          pixelRatio={1}
        />
      )}

      {currentDimension === 'creamy' && <SnowParticles />}

      <ErrorBoundary>
        <div
          className="w-full min-h-screen transition-all transform-3d will-change-[transform,filter,opacity] relative z-10"
          style={{
            transitionDuration: `${pack.motionSpeed * 600}ms`,
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            filter: isTransitioning ? 'blur(12px)' : 'blur(0px)',
            opacity: isTransitioning ? 0.25 : 1,
            transform: isTransitioning ? 'scale(0.97)' : 'scale(1)',
          }}
        >
          <Navbar />
          {currentDimension === 'arctic' && <AnimatedBackground />}

          <main className="relative z-10 max-w-6xl mx-auto px-4 space-y-40 py-32">
            <ScrollReveal>
              <div id="hero">
                <Hero />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div id="graduation">
                <Suspense fallback={<div className="h-40 flex items-center justify-center text-sm opacity-60">Loading feature…</div>}>
                  <GraduationFeature />
                </Suspense>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div id="about">
                <About />
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div id="work">
                <Suspense fallback={<div className="h-40 flex items-center justify-center text-sm opacity-60">Loading projects…</div>}>
                  <Projects />
                </Suspense>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div id="sandbox">
                <Suspense fallback={<div className="h-40 flex items-center justify-center text-sm opacity-60">Loading gallery…</div>}>
                  <Gallery />
                </Suspense>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div id="contact">
                <Contact />
              </div>
            </ScrollReveal>
          </main>

          <Footer />
        </div>
      </ErrorBoundary>

      <CircularSwitcher />
      <DimensionCursor />
      <AdminOverlay />
    </div>
  );
}

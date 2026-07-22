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
import { Navbar }  from './components/layout/Navbar';
import { Particles } from './components/ui/Particles';
import { useThemeStore, dimensionPacks } from './store/themeStore';
import { DimensionCursor } from './components/ui/DimensionCursor';
import { CircularSwitcher } from './components/ui/CircularSwitcher';
import { SnowParticles } from './components/ui/SnowParticles';
import { ErrorBoundary } from './components/ErrorBoundary';
import LoadingScreen from './components/ui/LoadingScreen';

// ✅ Lazy imports
const Projects = React.lazy(() =>
  import('./components/sections/Projects').then(mod => ({ default: mod.Projects }))
);

const Gallery = React.lazy(() =>
  import('./components/sections/Gallery').then(mod => ({ default: mod.Gallery }))
);

const GraduationFeature = React.lazy(() =>
  import('./components/sections/GraduationFeature').then(mod => ({ default: mod.GraduationFeature }))
);

export default function App() {
  usePortfolioData();
  const { isLoading } = usePortfolioStore();
  const { currentDimension, isTransitioning } = useThemeStore();
  const pack = dimensionPacks[currentDimension];

  // root theme class: keep pack classes but also add explicit theme class for CSS variables
  const themeClass = currentDimension === 'arctic' ? 'theme-arctic' : currentDimension === 'creamy' ? 'theme-creamy' : 'theme-cosmic';

  return (
    <div className={`${themeClass} relative min-h-screen overflow-x-hidden ${pack.bgClass} ${pack.fontClass} ${pack.textPrimary}`}>
      {/* Loading overlay shown while initial data loads */}
      {isLoading && <LoadingScreen />}

      {/* Particles only for cosmic (kept tuned) */}
      {currentDimension === 'cosmic' && (
        <Particles
          particleColors={['#ffffff', '#f8fafc', '#cbd5e1']}
          particleCount={80}
          particleSpread={25}
          speed={0.03}
          particleBaseSize={10}
          sizeRandomness={3.5}
          moveParticlesOnHover={true}
          particleHoverFactor={1.5}
          alphaParticles={true}
          disableRotation={false}
          pixelRatio={1}
        />
      )}

      {currentDimension === 'creamy' && <SnowParticles />}

      <Navbar />
      <ErrorBoundary>
        <div
          className="w-full min-h-screen transition-all transform-3d will-change-[transform,filter,opacity] relative z-10"
          style={{
            filter: isTransitioning ? 'blur(12px)' : 'blur(0px)',
            opacity: isTransitioning ? 0.25 : 1,
            transform: isTransitioning ? 'scale(0.97)' : 'scale(1)',
          }}
        >
          {currentDimension === 'arctic' && <AnimatedBackground />}

          <main className="relative z-10 max-w-6xl mx-auto px-4 space-y-40 pt-12">
            <ScrollReveal><div id="hero"><Hero /></div></ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div id="graduation">
                <Suspense fallback={<div>Loading graduation…</div>}>
                  <GraduationFeature />
                </Suspense>
              </div>
            </ScrollReveal>

            <ScrollReveal><div id="about"><About /></div></ScrollReveal>

            <ScrollReveal>
              <div id="work">
                <Suspense fallback={<div>Loading projects…</div>}>
                  <Projects />
                </Suspense>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div id="sandbox">
                <Suspense fallback={<div>Loading gallery…</div>}>
                  <Gallery />
                </Suspense>
              </div>
            </ScrollReveal>

            <ScrollReveal><div id="contact"><Contact /></div></ScrollReveal>
          </main>

          <Footer />
        </div>
      </ErrorBoundary>

      <CircularSwitcher />
      {/* Single cursor manager: DimensionCursor controls which cursor variant is rendered */}
      <DimensionCursor />
      <AdminOverlay />
    </div>
  );
}

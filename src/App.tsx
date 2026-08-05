// src/App.tsx
import { usePortfolioData } from './hooks/usePortfolioData';
import { usePortfolioStore } from './store/portfolioStore';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Contact } from './components/sections/Contact';
import { Projects } from './components/sections/Projects';
import { Gallery } from './components/sections/Gallery';
import { GraduationFeature } from './components/sections/GraduationFeature';
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

// Note: Projects, Gallery, and GraduationFeature used to be React.lazy()-loaded
// behind a <Suspense> fallback. They're small (a few KB each) so the bundle-size
// savings were negligible, but the fallback's tiny placeholder height meant the
// page was much shorter than its real height for a moment after load. Anchor
// links (#work, #contact, etc.) clicked during that window would jump to a
// pixel position based on the *temporary* short layout — then, once the real
// content mounted and the page grew taller, everything below shifted down
// without the browser re-correcting the scroll position, landing the user on
// the wrong section entirely. Importing them normally avoids that layout shift.

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
                <GraduationFeature />
              </div>
            </ScrollReveal>

            {/* About, Projects ("work"), Gallery, and Contact each set their own
                id on their root <section>, so no wrapper id is added here —
                that previously created duplicate ids in the DOM (invalid HTML
                and unreliable for anchor navigation / getElementById lookups). */}
            <ScrollReveal><About /></ScrollReveal>

            <ScrollReveal><Projects /></ScrollReveal>

            <ScrollReveal><Gallery /></ScrollReveal>

            <ScrollReveal><Contact /></ScrollReveal>
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
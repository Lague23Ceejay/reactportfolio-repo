import { usePortfolioData } from './hooks/usePortfolioData';
import { usePortfolioStore } from './store/portfolioStore';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Projects } from './components/sections/Projects';
import { Gallery } from './components/sections/Gallery';
import { Contact } from './components/sections/Contact';
import { AdminOverlay } from './components/admin/AdminOverlay';
import { AnimatedBackground } from './components/ui/AnimatedBackground';
import { ScrollReveal } from './components/ui/ScrollReveal';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { Particles } from './components/ui/Particles';

// DIMENSION HOP SYSTEM IMPORTS
import { useThemeStore, dimensionPacks } from './store/themeStore';
import { DimensionCursor } from './components/ui/DimensionCursor';
import { CircularSwitcher } from './components/ui/CircularSwitcher';

export default function App() {
  usePortfolioData();
  const { isLoading, error } = usePortfolioStore();
  
  // Bind the global dimension state hooks
  const { currentDimension, isTransitioning } = useThemeStore();
  const pack = dimensionPacks[currentDimension];

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
    /* 
      SENIOR DEV HOOK: Active dimensional layout wrapper layer container view.
      The transition handling guarantees background tones and typography weights shift dynamically.
    */
    <div className={`relative min-h-screen overflow-x-hidden transition-all duration-500 ease-in-out ${pack.bgClass} ${pack.fontClass}`}>
      
     {/* 
        SENIOR CELESTIAL CONFIGURATION:
        - particleBaseSize set to 12.0 so stars pop elegantly to the naked eye.
        - sizeRandomness set to 3.5 to create distinct organic size variations (micro specks to full moons).
        - particleHoverFactor set to 1.5 for a controlled, immersive parallax tilt rate.
      */}
      {currentDimension === 'cosmic' && (
        <Particles
          particleColors={["#ffffff", "#ffffff", "#f8fafc", "#cbd5e1"]}
          particleCount={160}         // Perfectly balances starry distribution density
          particleSpread={15}         // Deep-space frame layout size
          speed={0.03}                // Majestic, slow-motion orbital drift
          particleBaseSize={12}       // FIX: Upscaled base to reveal stars cleanly to the naked eye
          sizeRandomness={3.5}        // FIX: High variation to generate distinct mixed sizing nodes
          moveParticlesOnHover={true} // Camera tracking parallax active
          particleHoverFactor={1.5}   // Controlled slide speed in the opposite direction
          alphaParticles={true}       // Crisp round anti-aliasing edges
          disableRotation={false}     // Keeps background rotation alive
          pixelRatio={1}
        />
      )}

      {/* 
        SENIOR DEV FIX: Pushed content matrix up to transparent layering z-10 index.
        This isolates your section graphics without clipping the fixed viewport canvas background.
      */}
      <div 
        className="w-full min-h-screen transition-all transform-3d will-change-[transform,filter,opacity] relative z-10"
        style={{ 
          // Applies your speed modifier (Cosmic = snappy, Creamy = floaty, Arctic = ultra-fast)
          transitionDuration: `${pack.motionSpeed * 600}ms`,
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          filter: isTransitioning ? 'blur(12px)' : 'blur(0px)',
          opacity: isTransitioning ? 0.25 : 1,
          transform: isTransitioning ? 'scale(0.97)' : 'scale(1)'
        }}
      >
        <Navbar />
        
        {/* The pixel matrix grid now mounts strictly inside the Neon Arctic view layout context */}
        {currentDimension === 'arctic' && <AnimatedBackground />}

        <main className="relative z-10 max-w-6xl mx-auto px-4 space-y-40 py-32">
          <ScrollReveal>
            <div id="hero">
              <Hero />
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.1}>
            <div id="about">
              <About />
            </div>
          </ScrollReveal>
          
          <ScrollReveal>
            <div id="work">
              <Projects />
            </div>
          </ScrollReveal>
          
          <ScrollReveal>
            <div id="sandbox">
              <Gallery />
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

      {/* Global Interactive HUD Elements Mount Point */}
      <CircularSwitcher />
      <DimensionCursor />

      <AdminOverlay />
    </div>
  );
}

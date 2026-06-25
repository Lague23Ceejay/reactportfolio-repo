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
      SENIOR DEV HOOK: Dimensional layout wrapper layer.
      The transition handling guarantees background tones and typography weights shift dynamically.
    */
    <div className={`relative min-h-screen overflow-x-hidden transition-all duration-500 ease-in-out ${pack.bgClass} ${pack.fontClass}`}>
      
      {/* 
        SENIOR DEV FIX: Explicit absolute stacking layout layer.
        By placing this wrapper at z-10 on top of the bgClass but below the z-20 content tree,
        the particles are guaranteed to shine through cleanly without getting hidden.
      */}
      {currentDimension === 'cosmic' && (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden opacity-90">
          <Particles
            particleColors={["#10b981", "#34d399", "#ffffff", "#059669"]}
            particleCount={360}         // High-density space star counts
            particleSpread={12}         // Spatial coordinate depth limit
            speed={0.12}                // Slower majestic drifting velocity
            particleBaseSize={22}       // CRITICAL SENIOR FIX: Sized down into crisp, tiny little balls
            sizeRandomness={0.85}       // Mix of pinpricks and bright spheres
            moveParticlesOnHover={true} // Enabled mouse interactive physics tracking
            particleHoverFactor={1.4}   // Interactive cursor parallax response
            alphaParticles={true}       // Activates smooth alpha transparency blending
            disableRotation={false}
            pixelRatio={1}              // Forces clean explicit WebGL pixel mapping
          />
        </div>
      )}

      {/* 
        SENIOR DEV FIX: Pushed the layout stack up to relative z-20 
        so that text and section elements float neatly over the WebGL background layer.
      */}
      <div 
        className="w-full min-h-screen transition-all transform-3d will-change-[transform,filter,opacity] relative z-20"
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

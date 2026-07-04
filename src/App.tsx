// src/App.tsx

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
import { GraduationFeature } from './components/sections/GraduationFeature';

// DIMENSION HOP SYSTEM IMPORTS
import { useThemeStore, dimensionPacks } from './store/themeStore';
import { DimensionCursor } from './components/ui/DimensionCursor';
import { CircularSwitcher } from './components/ui/CircularSwitcher';

// 🚀 SENIOR DEV INJECTION: Import our dedicated hardware-accelerated canvas snow engine
import { SnowParticles } from './components/ui/SnowParticles';

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
    <div className={`relative min-h-screen overflow-x-hidden transition-all duration-500 ease-in-out ${pack.bgClass} ${pack.fontClass} ${pack.textPrimary}`}>
      
      {/* ==========================================================================
         A. PORTAL BACKGROUND ANIMATION ENGINES
         ========================================================================== */}
      
      {/* DIMENSION 1: COSMIC (Starfield Simulation Matrix) */}
      {currentDimension === 'cosmic' && (
        <Particles
          particleColors={["#ffffff", "#ffffff", "#f8fafc", "#cbd5e1"]}
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

      {/* 🚀 DIMENSION 2: CREAMY STUDIO (Hardware Accelerated Snow Particles)
          This layer mounts and renders soft, drifting web-safe canvas flakes 
          only when the visitor activates your pastel light mode studio portal. */}
      {currentDimension === 'creamy' && <SnowParticles />}

      {/* ==========================================================================
         B. CORE CONTENT INTERFACE CONTAINER MATRIX
         ========================================================================== */}
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
        
        {/* DIMENSION 3: ARCTIC (The pixel grid matrix mounts strictly inside the Neon Arctic layout context) */}
        {currentDimension === 'arctic' && <AnimatedBackground />}

        <main className="relative z-10 max-w-6xl mx-auto px-4 space-y-40 py-32">
          {/* Main Introduction Block */}
          <ScrollReveal>
            <div id="hero">
              <Hero />
            </div>
          </ScrollReveal>
          
          {/* GRADUATION SPECIAL FEATURE ROW BLOCK */}
          <ScrollReveal delay={0.15}>
            <div id="graduation">
              <GraduationFeature />
            </div>
          </ScrollReveal>
          
          {/* Professional Bio Info Narrative Section */}
          <ScrollReveal delay={0.1}>
            <div id="about">
              <About />
            </div>
          </ScrollReveal>
          
          {/* Selected Work Repositories and Progress Metrics */}
          <ScrollReveal>
            <div id="work">
              <Projects />
            </div>
          </ScrollReveal>
          
          {/* Experimental Sandbox Visual Asset Galleries */}
          <ScrollReveal>
            <div id="sandbox">
              <Gallery />
            </div>
          </ScrollReveal>
          
          {/* Communication and External Media Links Row */}
          <ScrollReveal>
            <div id="contact">
              <Contact />
            </div>
          </ScrollReveal>
        </main>
        
        <Footer />
      </div>

      {/* ==========================================================================
         C. GLOBAL HEADS-UP DISPLAY & EXECUTIVE OPERATIVE OVERLAYS
         ========================================================================== */}
      <CircularSwitcher />

<DimensionCursor />

{/* Mount admin overlay */}
<AdminOverlay />

    </div>
  );
}

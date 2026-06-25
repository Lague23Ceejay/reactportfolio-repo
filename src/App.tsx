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

// 1. Import your newly created Navbar component here
import { Navbar } from './components/layout/Navbar';

export default function App() {
  usePortfolioData();
  const { isLoading, error } = usePortfolioStore();

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

  // PASTE IT HERE: This replaces your old return statement completely
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-50 overflow-x-hidden selection:bg-emerald-500 selection:text-black">
      {/* Mounted globally at the root layout container view */}
      <Navbar />
      <AnimatedBackground />

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
      
      <AdminOverlay />
    </div>
  );
}

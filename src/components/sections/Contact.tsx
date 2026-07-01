// src/components/sections/Contact.tsx

import { usePortfolioStore } from '../../store/portfolioStore';
import { useThemeStore, dimensionPacks } from '../../store/themeStore'; // 🚀 LIGHTWEIGHT UTILITY CONNECTION

export function Contact() {
  /* ==========================================================================
     1. GLOBAL STATE & THEME CONFIGURATION SUBSCRIPTIONS
     ========================================================================== */
  const data = usePortfolioStore((state) => state.data?.contact);
  const { currentDimension } = useThemeStore();
  
  // Extract your current contrast utility style pack classes dynamically
  const pack = dimensionPacks[currentDimension];

  // Failsafe exit layer if database records haven't finished compiling
  if (!data) return null;

  /* ==========================================================================
     2. ADAPTIVE CONTAINER CARD STYLING MATRICES
     ========================================================================== */
  const cardLayoutClass = currentDimension === 'creamy'
    ? 'bg-white border-stone-200/80 text-stone-900 shadow-md'
    : 'bg-zinc-900/20 border-zinc-800 text-zinc-100 shadow-2xl';

  return (
    <section className="space-y-8 py-10" id="contact">
      
      {/* SECTION HEADER BLOCK */}
      <div className="flex items-center gap-4">
        {/* 🚀 FIXED: Dynamic heading contrast color system tracker */}
        <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight transition-colors duration-500 ${pack.textPrimary}`}>
          Get In Touch
        </h2>
        <div className={`h-[1px] flex-1 transition-colors duration-500 ${currentDimension === 'creamy' ? 'bg-stone-400/40' : 'bg-zinc-800'}`} />
      </div>

      {/* CORE INTERACTIVE CONTACT BANNER WRAPPER CONTAINER */}
      {/* 🚀 FIXED: Replaced dark-only background and borders with our adaptive class variables */}
      <div className={`p-8 sm:p-12 rounded-3xl max-w-3xl mx-auto text-center space-y-8 border transition-all duration-500 ${cardLayoutClass}`}>
        
        {/* UPPER DESCRIPTIVE HEADLINE PARAGRAPH */}
        <div className="space-y-4 max-w-xl mx-auto">
          {/* 🚀 FIXED: Lifted up from text-zinc-400 to track high-visibility paragraph typography layout structures */}
          <p className={`text-lg font-normal leading-relaxed transition-colors duration-500 ${pack.textSecondary}`}>
            Let's create something functional and beautiful together. Feel free to check my public profiles or connect directly via email.
          </p>
        </div>

        {/* BOTTOM EXTERNAL NETWORKS REDIRECT MATRIX */}
        <div className={`flex flex-col sm:flex-row justify-center items-center gap-6 font-mono text-sm pt-4 border-t transition-colors duration-500 ${
          currentDimension === 'creamy' ? 'border-stone-200' : 'border-zinc-900'
        }`}>
          {/* 🚀 FIXED: Direct email links map smoothly to our soft pastel rose or sharp emerald accent keys */}
          <a 
            href={`mailto:${data.email}`} 
            className={`font-bold transition-all ${
              currentDimension === 'creamy' ? 'text-rose-600 hover:text-rose-700 underline' : 'text-emerald-400 hover:underline'
            }`}
          >
            ↳ {data.email}
          </a>
          
          {/* 🚀 FIXED: Social navigation nodes tracking correct dark slate variations inside the Creamy Studio portal */}
          {data.github && (
            <a 
              href={data.github} 
              target="_blank" 
              rel="noreferrer" 
              className={`transition-colors font-medium ${
                currentDimension === 'creamy' ? 'text-stone-600 hover:text-stone-900' : 'text-zinc-300 hover:text-white'
              }`}
            >
              ↳ GitHub
            </a>
          )}
          
          {data.linkedin && (
            <a 
              href={data.linkedin} 
              target="_blank" 
              rel="noreferrer" 
              className={`transition-colors font-medium ${
                currentDimension === 'creamy' ? 'text-stone-600 hover:text-stone-900' : 'text-zinc-300 hover:text-white'
              }`}
            >
              ↳ LinkedIn
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

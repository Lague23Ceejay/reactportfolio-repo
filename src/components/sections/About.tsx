// src/components/sections/About.tsx

import { usePortfolioStore } from '../../store/portfolioStore';
import { useThemeStore, dimensionPacks } from '../../store/themeStore'; // 🚀 LIGHTWEIGHT UTILITY CONNECTION

// Clean named imports for your CardSwap layout primitives
import { CardSwap, Card, renderIconSVG } from '../ui/CardSwapDeck';

export function About() {
  /* ==========================================================================
     1. WORKSPACE STATE & THEME PROPERTY SUBSCRIPTIONS
     ========================================================================== */
  const data = usePortfolioStore((state) => state.data?.about);
  const { currentDimension } = useThemeStore();
  
  // Extract your current contrast utility style pack classes dynamically
  const pack = dimensionPacks[currentDimension];

  // Failsafe exit block if no background database values exist
  if (!data) return null;

  return (
    <section className="space-y-8 py-10" id="about">
      
      {/* SECTION HEADER BLOCK */}
      <div className="flex items-center gap-4">
        {/* 🚀 FIXED: Title dynamically tracks primary text rules (stone-900 on Creamy, zinc-100 on Dark) */}
        <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight transition-colors duration-500 ${pack.textPrimary}`}>
          About Me
        </h2>
        {/* 🚀 FIXED: Line tracker color maps perfectly to active border variables */}
        <div className={`h-px flex-1 transition-colors duration-500 ${currentDimension === 'creamy' ? 'bg-stone-400/40' : 'bg-zinc-800'}`} />
      </div>
      
      {/* GRID DISPLAY LAYOUT LAYER */}
      <div className="grid md:grid-cols-5 gap-12 items-center">
        
        {/* RICH-TEXT BIOGRAPHY CONTAINER */}
        {/* 🚀 FIXED: Swapped out hardcoded text-zinc-400 for highly-legible secondary theme text parameters */}
        <div 
          dangerouslySetInnerHTML={{ __html: data.bio }}
          className={`md:col-span-3 leading-relaxed text-base sm:text-lg font-normal space-y-4 transition-colors duration-500 ${pack.textSecondary}`}
        />
        
        {/* INTERACTIVE COMPONENT ROTATING CARD DECK SANDBOX */}
        <div className="md:col-span-2 flex items-center justify-center min-h-65 relative pt-10">
          <CardSwap width={220} height={260} delay={3800} easing="elastic">
            {data.skills.map((skill, idx) => (
              /* 🚀 FIXED: Card container now maps onto your system 'cardClass' variable token */
              <Card 
                key={idx} 
                className={`flex flex-col items-center justify-center gap-4 text-center select-none p-5 rounded-2xl border transition-all duration-500 ${
                  currentDimension === 'creamy' 
                    ? 'bg-white border-stone-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)]' 
                    : 'bg-zinc-950 border-zinc-800/80 text-zinc-100'
                }`}
              >
                {/* UPPER METADATA SLIP SLOT */}
                  <div className="space-y-1 z-10 flex flex-col items-center justify-center">
                  {/* 🚀 FIXED: Skill titles follow primary theme typography contracts */}
                  {/* 🚀 THE FIXED TITLE HOOK: Explicitly forces high-visibility dark text on the Creamy theme layout view */}
                  <h4 className={`text-xs font-mono font-black tracking-tight transition-colors duration-300 ${
                    currentDimension === 'creamy' 
                      ? 'text-stone-900 drop-shadow-xs' 
                      : 'text-zinc-100'
                  }`}>
                    {skill.name}
                  </h4>
                  {/* 🚀 THE FIXED SUB-BADGE HOOK: Bold red/rose accent matching your soft color palette */}
                    <p className={`text-[9px] font-mono uppercase tracking-widest font-extrabold ${
                      currentDimension === 'creamy' ? 'text-rose-600' : 'text-emerald-500'
                    }`}>
                      Core Stack
                    </p>
                  </div>
                
                {/* ICON VECTOR BOX PLATFORM FRAME */}
                {/* CENTRAL ICON FRAME VISUALIZER */}
                {/* 🚀 FIXED: Swapped out the dark-only background container for an adaptive theme box layout */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-inner border transition-colors duration-300 ${
                  currentDimension === 'creamy' 
                    ? 'bg-stone-50 border-stone-200 text-stone-800' 
                    : 'bg-zinc-900 border-zinc-800/60 text-zinc-300'
                }`}>
                  {renderIconSVG(skill.iconCode)}
                </div>
              </Card>
            ))}
          </CardSwap>
        </div>
      </div>
    </section>
  );
}

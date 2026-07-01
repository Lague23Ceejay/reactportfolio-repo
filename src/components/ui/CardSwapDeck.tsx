// src/components/ui/CardSwapDeck.tsx

import React, { useState, forwardRef } from 'react';
import { useThemeStore, dimensionPacks } from '../../store/themeStore';
import { 
  SiReact, SiTypescript, SiTailwindcss, SiJavascript, 
  SiNodedotjs, SiHtml5, SiCss, SiGit
} from 'react-icons/si';

interface SkillItem {
  name: string;
  iconCode: string;
  description?: string;
}

interface HorizontalTickerProps {
  skills: SkillItem[];
}

/* ==========================================================================
   1. HIGH-PERFORMANCE DEVICON VECTOR MAP
   ========================================================================== */
export const renderIconSVG = (code: string) => {
  const clean = (code || '').toLowerCase().trim();
  const iconClass = "text-4xl block mx-auto transition-transform duration-300 group-hover:scale-110";
  
  if (clean === 'react') return <SiReact className={`${iconClass} text-[#61DAFB]`} />;
  if (clean === 'ts' || clean === 'typescript') return <SiTypescript className={`${iconClass} text-[#3178C6]`} />;
  if (clean === 'tailwind' || clean === 'tailwindcss') return <SiTailwindcss className={`${iconClass} text-[#06B6D4]`} />;
  if (clean === 'js' || clean === 'javascript') return <SiJavascript className={`${iconClass} text-[#F7DF1E]`} />;
  if (clean === 'node' || clean === 'nodejs') return <SiNodedotjs className={`${iconClass} text-[#339933]`} />;
  if (clean === 'html' || clean === 'html5') return <SiHtml5 className={`${iconClass} text-[#E34F26]`} />;
  if (clean === 'css' || clean === 'css3') return <SiCss className={`${iconClass} text-[#1572B6]`} />;
  if (clean === 'git') return <SiGit className={`${iconClass} text-[#F05032]`} />;

  return (
    <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded font-mono font-bold flex items-center justify-center text-[10px] uppercase">
      {clean.substring(0, 4)}
    </div>
  );
};
/* ==========================================================================
   2. REWIRED TICKER LOOP LAYOUT MARQUEE (PURE CSS STRIPPED MATRIX)
   ========================================================================== */
export const CardSwap: React.FC<HorizontalTickerProps> = ({ skills = [] }) => {
  const { currentDimension } = useThemeStore();
  const pack = dimensionPacks[currentDimension];
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(null);

  const fallbackInfo = "Core engineering baseline structure integrated inside our secure multi-dimensional web architecture frameworks loops.";

  if (!skills.length) return null;

  // Triplicate array tracking entries to give the running track infinite scrolling space
  const marqueeItems = [...skills, ...skills, ...skills];

  // Isolated card template map generator function
  const renderCardList = () => {
    return marqueeItems.map((skill, index) => {
      const cardThemeClass = currentDimension === 'creamy'
        ? 'bg-white border-stone-200 text-stone-900 hover:border-rose-400 hover:shadow-xl'
        : 'bg-zinc-900 border-zinc-800/80 text-zinc-100 hover:border-emerald-500/40 hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)]';

      return (
        <div
          key={`${skill.iconCode}-${index}`}
          onClick={() => setActiveSkill(skill)}
          /* 🚀 THE IMMERSIVE TRANSITION: 
             Cards float 12px upwards (`hover:-translate-y-3`) smoothly when hovered or touched, 
             while the underlying lane track keeps moving seamlessly in the background! */
          className={`flex-shrink-0 w-36 h-36 border rounded-2xl flex flex-col items-center justify-center p-4 gap-3 text-center transition-all duration-300 select-none transform-3d hover:scale-105 hover:-translate-y-3 cursor-pointer ${cardThemeClass}`}
        >
          <div className={`p-3 rounded-xl border transition-colors duration-300 ${
            currentDimension === 'creamy' ? 'bg-stone-50 border-stone-200' : 'bg-zinc-950 border-zinc-800'
          }`}>
            {renderIconSVG(skill.iconCode)}
          </div>
          <span className="text-[11px] font-mono font-bold truncate max-w-full block">
            {skill.name}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="w-full space-y-6 relative overflow-hidden group/marquee">
      
      {/* ⚙️ ISOLATED MARQUEE HARDWARE COMPOSITOR ENGINE STYLE SHEET
          By moving 100% of the movement onto a dedicated CSS keyframe animation 
          using translate3d, the browser processes this on the GPU. It can never 
          freeze, lock up, or break after 3-4 seconds! */}
      <style>{`
        @keyframes marqueeSlidingEngine {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.3333%, 0, 0); }
        }
        .animate-marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeSlidingEngine 22s linear infinite !important;
          will-change: transform !important;
        }
        /* 🛑 HOLD TO PAUSE INTERCEPTION: 
           The entire row freezes cleanly in place while you hold click or touch down 
           so visitors can tap the cards easily without missing them. */
        .group\\/marquee:active .animate-marquee-track {
          animation-play-state: paused !important;
        }
      `}</style>
      {/* COMPOSITOR-DRIVEN ENDLESS SCROLLING LENS CHANNEL */}
      <div 
        className="w-full overflow-hidden py-6 flex select-none relative" 
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="animate-marquee-track gap-6">
          {renderCardList()}
        </div>
      </div>

      {/* ==========================================================================
         3. DYNAMIC INTERACTIVE INFORMATION OVERLAY MODAL
         ========================================================================== */}
      {activeSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="absolute inset-0" onClick={() => setActiveSkill(null)} />
          
          <div className={`relative z-10 w-full max-w-md border p-6 rounded-2xl flex flex-col items-center gap-4 text-center shadow-2xl ${
            currentDimension === 'creamy' ? 'bg-white border-stone-300 text-stone-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
          }`}>
            <button 
              type="button"
              onClick={() => setActiveSkill(null)}
              className="absolute top-4 right-4 text-xs font-mono opacity-50 hover:opacity-100 cursor-pointer"
            >
              ✕ Close
            </button>

            <div className={`p-4 rounded-2xl border ${
              currentDimension === 'creamy' ? 'bg-stone-50 border-stone-200' : 'bg-zinc-950 border-zinc-800'
            }`}>
              {renderIconSVG(activeSkill.iconCode)}
            </div>

            <div className="space-y-2 w-full">
              <h3 className={`text-lg font-bold tracking-tight ${pack.textPrimary}`}>
                {activeSkill.name}
              </h3>
              <p className={`text-xs uppercase tracking-widest font-mono font-bold ${
                currentDimension === 'creamy' ? 'text-rose-600' : 'text-emerald-500'
              }`}>
                Technology Infrastructure Record
              </p>
            </div>

            <p className={`text-sm leading-relaxed whitespace-pre-wrap font-light py-2 ${pack.textSecondary}`}>
              {activeSkill.description || fallbackInfo}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   4. BACKWARD RE-EXPORT COMPATIBILITY LAYER FOR REUSE SEGMENTS
   ========================================================================== */
export const CardSwapDeck: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
export const Card = forwardRef(() => null);

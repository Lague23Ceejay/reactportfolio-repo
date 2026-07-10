import React, { useState, useEffect, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { useThemeStore, dimensionPacks } from '../../store/themeStore';
import { renderIconSVG } from '../../utils/renderIconSVG';

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
const renderCardIcon = (code: string) => {
  const iconClass = "text-4xl block mx-auto transition-transform duration-300 group-hover:scale-110";
  const icon = renderIconSVG(code);

  if (React.isValidElement<{ className?: string }>(icon)) {
    return React.cloneElement(icon, {
      className: `${icon.props.className ?? ''} ${iconClass}`.trim()
    });
  }

  return icon;
};

/* ==========================================================================
   2. REWIRED TICKER LOOP LAYOUT MARQUEE (PURE CSS STRIPPED MATRIX)
   ========================================================================== */
export const CardSwap: React.FC<HorizontalTickerProps> = ({ skills = [] }) => {
  const { currentDimension } = useThemeStore();
  const pack = dimensionPacks[currentDimension];
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(null);

  // 🚀 BACKGROUND SCROLL LOCKER EFFECT
  useEffect(() => {
    const body = document.body;
    if (activeSkill) {
      body.style.overflow = 'hidden';
      body.style.overscrollBehavior = 'none';
    } else {
      body.style.overflow = '';
      body.style.overscrollBehavior = '';
    }

    return () => {
      body.style.overflow = '';
      body.style.overscrollBehavior = '';
    };
  }, [activeSkill]);

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
          onClick={(e) => {
            e.stopPropagation(); // 🚀 Prevent event bubbling conflicts
            setActiveSkill(skill);
          }}
          className={`shrink-0 w-36 h-36 border rounded-2xl flex flex-col items-center justify-center p-4 gap-3 text-center transition-all duration-300 select-none transform-3d hover:scale-105 hover:-translate-y-3 cursor-pointer ${cardThemeClass}`}
        >
          <div className={`p-3 rounded-xl border transition-colors duration-300 ${
            currentDimension === 'creamy' ? 'bg-stone-50 border-stone-200' : 'bg-zinc-950 border-zinc-800'
          }`}>
            {renderCardIcon(skill.iconCode)}
          </div>
          <span className="text-[11px] font-mono font-bold truncate max-w-full block">
            {skill.name}
          </span>
        </div>
      );
    });
  };
  return (
    /* 🚀 FIX: Forced isolate stack with pointer-events-auto to bypass pointer capturing from custom cursors */
    <div className="w-full space-y-6 relative overflow-hidden group/marquee isolate pointer-events-auto">
      
      {/* ⚙️ ISOLATED MARQUEE HARDWARE COMPOSITOR ENGINE STYLE SHEET */}
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
        .group\\/marquee:active .animate-marquee-track {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* COMPOSITOR-DRIVEN ENDLESS SCROLLING LENS CHANNEL */}
      <div 
        className="w-full overflow-hidden py-6 flex select-none relative pointer-events-auto" 
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="animate-marquee-track gap-6 pointer-events-auto">
          {renderCardList()}
        </div>
      </div>

      {/* ==========================================================================
         3. DYNAMIC INTERACTIVE INFORMATION OVERLAY MODAL
         ========================================================================== */}
      {activeSkill && (typeof document !== 'undefined' ? createPortal(
        /* 🚀 Portal modal: renders at document.body to avoid transformed ancestor containing blocks */
        (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn left-0 top-0 pointer-events-auto">
            <div className="absolute inset-0 cursor-pointer" onClick={() => setActiveSkill(null)} />

            <div className={`relative z-10 w-full max-w-[min(100%,28rem)] border p-6 rounded-[2rem] flex flex-col items-center gap-4 text-center shadow-2xl max-h-[85vh] overflow-y-auto custom-scrollbar pointer-events-auto ${
              currentDimension === 'creamy' ? 'bg-white border-stone-300 text-stone-900' : 'bg-zinc-950 border-zinc-800 text-zinc-100'
            }`}>
              <button 
                type="button"
                onClick={() => setActiveSkill(null)}
                className="absolute top-4 right-4 text-xs font-mono opacity-50 hover:opacity-100 cursor-pointer"
              >
                ✕ Close
              </button>

              <div className={`p-4 rounded-2xl border shrink-0 ${
                currentDimension === 'creamy' ? 'bg-stone-50 border-stone-200' : 'bg-zinc-950 border-zinc-800'
              }`}>
                {renderCardIcon(activeSkill.iconCode)}
              </div>

              <div className="space-y-2 w-full shrink-0">
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
        ), document.body as Element
      ) : null)}
    </div>
  );
};

/* ==========================================================================
   4. BACKWARD RE-EXPORT COMPATIBILITY LAYER FOR REUSE SEGMENTS
   ========================================================================== */
export const CardSwapDeck: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
export const Card = forwardRef(() => null);

// src/components/sections/About.tsx

import { usePortfolioStore } from '../../store/portfolioStore';
import { useThemeStore, dimensionPacks } from '../../store/themeStore'; 
import { CardSwap } from '../ui/CardSwapDeck'; // Clean ticker link path

export function About() {
  const data = usePortfolioStore((state) => state.data?.about);
  const { currentDimension } = useThemeStore();
  const pack = dimensionPacks[currentDimension];

  if (!data) return null;

  return (
    <section className={`space-y-8 py-10 rounded-3xl px-4 sm:px-6 transition-colors duration-500 ${currentDimension === 'creamy' ? 'bg-[#FFF7C2]/40' : currentDimension === 'arctic' ? 'bg-[#20133A]/50' : 'bg-zinc-900/20'}`} id="about">
      {/* SECTION HEADER BLOCK */}
      <div className="flex items-center gap-4">
        <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight transition-colors duration-500 ${pack.textPrimary}`}>
          About Me
        </h2>
        <div className={`h-px flex-1 transition-colors duration-500 ${currentDimension === 'creamy' ? 'bg-stone-400/40' : 'bg-zinc-800'}`} />
      </div>
      
      {/* GRID DISPLAY BIOGRAPHY LAYOUT LAYER */}
      <div className="grid md:grid-cols-5 gap-8 items-start">
        <div 
          dangerouslySetInnerHTML={{ __html: data.bio }}
          className={`md:col-span-5 leading-relaxed text-base sm:text-lg font-normal space-y-4 transition-colors duration-500 ${pack.textSecondary}`}
        />
      </div>

      {/* 🚀 FIXED HORIZONTAL LOOP CHANNEL BLOCK */}
      {/* Spreads your full width skills track nicely across mobile and desktop identical views */}
      <div className="w-full pt-4 relative">
        <span className="text-[10px] font-mono tracking-widest uppercase opacity-40 mb-2 block">
          🫳 • Click stack to extract data profiles
        </span>
        <CardSwap skills={data.skills || []} />
      </div>
    </section>
  );
}

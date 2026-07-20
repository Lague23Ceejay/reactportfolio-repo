//src/components/layout/Footer.tsx
import { usePortfolioStore } from '../../store/portfolioStore';
import { useThemeStore, dimensionPacks } from '../../store/themeStore';

export function Footer() {
  const name = usePortfolioStore((state) => state.data?.hero.name || 'Developer');
  const { currentDimension } = useThemeStore();
  const pack = dimensionPacks[currentDimension];

  return (
    <footer className={`w-full border-t py-8 mt-20 relative z-10 ${currentDimension === 'creamy' ? 'border-stone-200/60 bg-[#FFF7C2]/70' : 'border-zinc-900 bg-zinc-950/20'}`}>
      <div className={`max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs font-mono ${pack.textSecondary}`}>
        
        {/* Left Hand Column: Branding Signature */}
        <div>
          <p className={pack.textPrimary}>© {new Date().getFullYear()} {name}. All rights reserved.</p>
          <p className={`text-[10px] font-light mt-0.5 ${pack.textSecondary}`}>Built with React, TypeScript, & Tailwind v4</p>
        </div>

        {/* Right Hand Column: System Terminal Status Token Line */}
        <div className={`flex items-center gap-2 border px-3 py-1.5 rounded-xl ${currentDimension === 'creamy' ? 'bg-white/70 border-stone-200' : 'bg-zinc-950 border-zinc-900'}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${currentDimension === 'creamy' ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`} />
          <span className={`text-[10px] uppercase font-semibold tracking-wider ${pack.textSecondary}`}>
            Console Terminal Status: Operational
          </span>
        </div>

      </div>
    </footer>
  );
}

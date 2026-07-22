// src/components/layout/Footer.tsx
import { usePortfolioStore } from '../../store/portfolioStore';
import { useThemeStore, dimensionPacks } from '../../store/themeStore';

export function Footer() {
  const name = usePortfolioStore((state) => state.data?.hero.name || 'Developer');
  const { currentDimension } = useThemeStore();
  const pack = dimensionPacks[currentDimension];

  return (
    <footer
      className={`w-full border-t py-10 mt-24 relative z-10 ${
        currentDimension === 'creamy'
          ? 'border-stone-200/60 bg-[#FFF7C2]/70'
          : 'border-zinc-900 bg-zinc-950/20'
      }`}
    >
      <div
        className={`max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left text-sm font-mono leading-relaxed ${pack.textSecondary}`}
      >
        {/* Left Hand Column: Branding Signature */}
        <div>
          <p className={`text-base font-semibold ${pack.textPrimary}`}>
            © {new Date().getFullYear()} {name}. All rights reserved.
          </p>
          <p
            className={`text-xs sm:text-sm font-light mt-1 ${pack.textSecondary}`}
          >
            Built with React, TypeScript, & Tailwind v4 — credits to the developers of Reactbits.dev
          </p>
        </div>

        {/* Right Hand Column: System Terminal Status Token Line */}
        <div
          className={`flex items-center gap-2 border px-4 py-2 rounded-xl ${
            currentDimension === 'creamy'
              ? 'bg-white/70 border-stone-200'
              : 'bg-zinc-950 border-zinc-900'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              currentDimension === 'creamy' ? 'bg-rose-500' : 'bg-emerald-500'
            } animate-pulse`}
          />
          <span
            className={`text-xs sm:text-sm uppercase font-semibold tracking-wider ${pack.textSecondary}`}
          >
            Console Terminal Status: Operational
          </span>
        </div>
      </div>
    </footer>
  );
}

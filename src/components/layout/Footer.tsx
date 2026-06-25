import { usePortfolioStore } from '../../store/portfolioStore';

export function Footer() {
  const name = usePortfolioStore((state) => state.data?.hero.name || 'Developer');

  return (
    <footer className="w-full border-t border-zinc-900 bg-zinc-950/20 py-8 mt-20 relative z-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs font-mono text-zinc-500">
        
        {/* Left Hand Column: Branding Signature */}
        <div>
          <p>© {new Date().getFullYear()} {name}. All rights reserved.</p>
          <p className="text-[10px] text-zinc-600 font-light mt-0.5">Built with React, TypeScript, & Tailwind v4</p>
        </div>

        {/* Right Hand Column: System Terminal Status Token Line */}
        <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-900 px-3 py-1.5 rounded-xl">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-400">
            Console Terminal Status: Operational
          </span>
        </div>

      </div>
    </footer>
  );
}

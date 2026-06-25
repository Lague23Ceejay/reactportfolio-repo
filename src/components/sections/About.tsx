import { usePortfolioStore } from '../../store/portfolioStore';
import { CardSwapDeck } from '../ui/CardSwapDeck';

export function About() {
  const data = usePortfolioStore((state) => state.data?.about);
  if (!data) return null;

  return (
    <section className="space-y-8" id="about">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">About Me</h2>
        <div className="h-[1px] bg-zinc-800 flex-1" />
      </div>
      <div className="grid md:grid-cols-3 gap-8 items-center">
        {/* Rich Text Bio Narrative */}
        <div 
          dangerouslySetInnerHTML={{ __html: data.bio }}
          className="md:col-span-2 text-zinc-400 leading-relaxed text-base sm:text-lg font-light space-y-4 font-sans"
        />
        
        {/* 3D Swap Deck Wrapper Frame */}
        <div className="bg-zinc-900/20 border border-zinc-800/80 rounded-3xl p-4 shadow-xl flex items-center justify-center min-h-[220px]">
          <CardSwapDeck skills={data.skills || []} />
        </div>
      </div>
    </section>
  );
}

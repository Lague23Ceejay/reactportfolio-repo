import { usePortfolioStore } from '../../store/portfolioStore';

// FIX: Added clear named imports for your CardSwap layout primitives
import { CardSwap, Card, renderIconSVG } from '../ui/CardSwapDeck';

export function About() {
  const data = usePortfolioStore((state) => state.data?.about);
  if (!data) return null;

  return (
    <section className="space-y-8 py-10" id="about">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">About Me</h2>
        {/* FIX: Optimized h-[1px] shorthand configuration parameter */}
        <div className="h-px bg-zinc-800 flex-1" />
      </div>
      
      <div className="grid md:grid-cols-5 gap-12 items-center">
        <div 
          dangerouslySetInnerHTML={{ __html: data.bio }}
          className="md:col-span-3 text-zinc-400 leading-relaxed text-base sm:text-lg font-light space-y-4"
        />
        
        {/* FIX: Optimized min-h-[260px] shorthand configuration parameter */}
        <div className="md:col-span-2 flex items-center justify-center min-h-65 relative pt-10">
          <CardSwap width={220} height={260} delay={3800} easing="elastic">
            {data.skills.map((skill, idx) => (
              <Card key={idx} className="flex flex-col items-center justify-center gap-4 text-center select-none">
                <div className="w-14 h-14 bg-zinc-900 border border-zinc-800/80 rounded-xl flex items-center justify-center shadow-inner">
                  {renderIconSVG(skill.iconCode)}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold text-zinc-200 tracking-tight">{skill.name}</h4>
                  <p className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest font-medium">Core Stack</p>
                </div>
              </Card>
            ))}
          </CardSwap>
        </div>
      </div>
    </section>
  );
}

import { usePortfolioStore } from '../../store/portfolioStore';

export function About() {
  const data = usePortfolioStore((state) => state.data?.about);
  if (!data) return null;

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">About Me</h2>
        <div className="h-[1px] bg-zinc-800 flex-1" />
      </div>
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 text-zinc-400 leading-relaxed text-base sm:text-lg whitespace-pre-line font-light">{data.bio}</div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-widest">Technical Toolkit</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-zinc-800 border border-zinc-700/50 text-zinc-300 text-sm rounded-lg font-medium">{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

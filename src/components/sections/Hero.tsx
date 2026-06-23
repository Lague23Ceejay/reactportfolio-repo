import { usePortfolioStore } from '../../store/portfolioStore';

export function Hero() {
  const data = usePortfolioStore((state) => state.data?.hero);
  if (!data) return null;

  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 min-h-[70vh] pt-12">
      <div className="flex-1 space-y-6 text-center md:text-left">
        <h2 className="text-emerald-400 font-mono tracking-wider text-sm md:text-base font-semibold uppercase">{data.title}</h2>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight">{data.name}</h1>
        <p className="text-lg md:text-xl text-zinc-400 max-w-xl font-light leading-relaxed">{data.tagline}</p>
      </div>
      <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden border-2 border-emerald-500/30 shadow-2xl shadow-emerald-500/10 shrink-0 bg-zinc-900 flex items-center justify-center">
        {data.profileImage ? (
          <img src={data.profileImage} alt={data.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-zinc-600 font-mono text-xs">No Image Loaded</span>
        )}
      </div>
    </section>
  );
}

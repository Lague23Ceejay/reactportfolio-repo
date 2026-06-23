import { usePortfolioStore } from '../../store/portfolioStore';

export function Gallery() {
  const gallery = usePortfolioStore((state) => state.data?.gallery || []);

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Visual Sandbox</h2>
        <div className="h-[1px] bg-zinc-800 flex-1" />
      </div>
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {gallery.map((item) => (
          <div key={item.id} className="break-inside-avoid relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 group">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="h-40 w-full flex items-center justify-center bg-zinc-900 text-zinc-600 font-mono text-xs">Missing Media</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
              <span className="text-[10px] font-mono font-semibold tracking-wider text-emerald-400 uppercase">{item.category}</span>
              <h4 className="text-sm font-bold text-white mt-1">{item.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import { usePortfolioStore } from '../../store/portfolioStore';
import { useThemeStore, dimensionPacks } from '../../store/themeStore';

export function Gallery() {
  const gallery = usePortfolioStore((state) => state.data?.gallery || []);
  const { currentDimension } = useThemeStore();
  const pack = dimensionPacks[currentDimension];

  return (
    <section className={`space-y-8 rounded-3xl px-4 sm:px-6 py-8 transition-colors duration-500 ${currentDimension === 'creamy' ? 'bg-[#FFF7C2]/40' : currentDimension === 'arctic' ? 'bg-[#20133A]/50' : 'bg-zinc-900/20'}`} id="sandbox">
      {/* Updated Semantic Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight cursor-target ${pack.textPrimary}`}>Memories & Milestones</h2>
          <div className={`h-[1px] flex-1 ${currentDimension === 'creamy' ? 'bg-stone-400/40' : 'bg-zinc-800'}`} />
        </div>
        <p className={`text-sm font-light max-w-xl leading-relaxed ${pack.textSecondary}`}>
          A visual archive of the moments that shaped my college experience.
        </p>
      </div>

      {/* Masonry Presentation Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4 pt-4">
        {gallery.map((item) => (
          // Skip placeholder categories that don't have images loaded yet
          item.imageUrl && (
            <div key={item.id} className="break-inside-avoid relative rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-900 group">
              <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                <span className={`text-[10px] font-mono font-semibold tracking-wider uppercase ${currentDimension === 'creamy' ? 'text-rose-500' : currentDimension === 'arctic' ? 'text-cyan-400' : 'text-emerald-400'}`}>{item.category}</span>
                <h4 className={`text-sm font-bold mt-1 ${pack.textPrimary}`}>{item.title}</h4>
              </div>
            </div>
          )
        ))}
      </div>
    </section>
  );
}

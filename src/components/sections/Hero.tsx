import { useThemeStore, dimensionPacks } from '../../store/themeStore';

export function Hero() {
  const { currentDimension } = useThemeStore();
  const pack = dimensionPacks[currentDimension];

  return (
    <section className="flex flex-col items-start justify-center min-h-[60vh]">
      <span className="text-xs font-bold tracking-widest text-emerald-500 uppercase font-mono mb-4">
        Bachelor of Science in Information Systems
      </span>
      
      {/* 🚀 FIXED CONTRAST TITLE: Automatically flips between text-zinc-100 and text-stone-900 */}
      <h1 className={`text-4xl md:text-6xl font-extrabold tracking-tight mb-6 ${pack.textPrimary}`}>
        Christian John K. Lague
      </h1>
      
      {/* 🚀 FIXED CONTRAST SUBTITLE: Automatically flips between text-zinc-400 and text-stone-600 */}
      <p className={`text-lg md:text-xl max-w-2xl font-normal leading-relaxed ${pack.textSecondary}`}>
        Building responsive, modern, and interactive digital ecosystems.
      </p>
    </section>
  );
}

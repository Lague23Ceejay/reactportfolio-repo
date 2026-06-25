import { useThemeStore, dimensionPacks } from '../../store/themeStore';
import MagicRings from '../ui/MagicRings';

export function Hero() {
  const { currentDimension } = useThemeStore();
  const pack = dimensionPacks[currentDimension];

  const avatarBg = currentDimension === 'creamy' 
    ? 'bg-stone-900 border-stone-300/40 text-stone-100 shadow-[0_20px_50px_rgba(40,40,40,0.15)]' 
    : 'bg-zinc-900/90 border-zinc-800/80 text-zinc-400 shadow-2xl';

  // ADAPTIVE MAGIC RINGS CONFIGURATIONS:
  // Dynamically feeds palette arrays matching the active workspace portal
  const ringConfig = {
    cosmic: { color: '#10b981', colorTwo: '#34d399', ringCount: 5, speed: 0.6 },
    arctic: { color: '#B069DB', colorTwo: '#22d3ee', ringCount: 6, speed: 1.0 },
    // CREAM DIMENSION: Fires warm pastel yellow loops circling the matte avatar canvas
    creamy: { color: '#FFEE8C', colorTwo: '#f43f5e', ringCount: 4, speed: 0.8 }
  }[currentDimension] || { color: '#10b981', colorTwo: '#34d399', ringCount: 5, speed: 0.6 };

    return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 min-h-[65vh] py-12">
      
      {/* LEFT COLUMN: Content Blocks */}
      <div className="flex-1 flex flex-col items-start justify-center">
        <span className="text-xs font-bold tracking-widest text-emerald-500 uppercase font-mono mb-4">
          Bachelor of Science in Information Systems
        </span>
        
        <h1 className={`text-4xl md:text-6xl font-extrabold tracking-tight mb-6 ${pack.textPrimary}`}>
          Christian John K. Lague
        </h1>
        
        <p className={`text-lg md:text-xl max-w-2xl font-normal leading-relaxed ${pack.textSecondary}`}>
          Building responsive, modern, and interactive digital ecosystems.
        </p>
      </div>

      {/* RIGHT COLUMN: Profile Picture Circle Wrapper */}
      <div className="flex items-center justify-center relative w-72 h-72 md:w-80 md:h-80 select-none group">
        
        {/* 
          SENIOR DEV FIX: Expanded dimensions from w-full h-full to a massive absolute 
          canvas block width/height (w-[180%] h-[180%]) to eliminate side clipping.
          Added mask-image to smoothly fade out edges before hitting any physical borders.
        */}
        <div 
          className="absolute pointer-events-none z-0 w-[180%] h-[180%] -top-[40%] -left-[40%]"
          style={{
            maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 70%)',
            WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 70%)'
          }}
        >
          <MagicRings
            color={ringConfig.color}
            colorTwo={ringConfig.colorTwo}
            ringCount={ringConfig.ringCount}
            speed={ringConfig.speed}
            attenuation={11}
            lineThickness={1.8}
            baseRadius={0.25}       // PRO FIX: Reduced base radius inside the shader so rings don't pop out too fast
            radiusStep={0.06}       // PRO FIX: Narrowed steps for tighter, more elegant aura clustering
            scaleRate={0.10}
            opacity={0.85}
            blur={0}
            noiseAmount={0.04}
            rotation={25}
            ringGap={1.4}
            fadeIn={0.6}
            fadeOut={0.6}
            followMouse={true}
            mouseInfluence={0.15}
            hoverScale={1.15}
            parallax={0.04}
            clickBurst={true}
          />
        </div>

        {/* Center Profile Picture Frame Placeholder */}
        <div 
          className={`w-64 h-64 md:w-72 md:h-72 rounded-full border flex items-center justify-center text-center p-6 transition-all duration-500 relative z-10 cursor-pointer ${avatarBg}`}
        >
          <span className="font-mono text-xs uppercase tracking-widest opacity-40">
            [ Profile Photo ]
          </span>
        </div>
      </div>

    </section>
  );
}


// src/components/sections/Hero.tsx

import { useThemeStore, dimensionPacks } from '../../store/themeStore';
import { usePortfolioStore } from '../../store/portfolioStore'; 
import { PixelImageTransition } from '../../components/ui/PixelImageTransition'; // 🚀 FIXED: Upgraded to named import structure
import MagicRings from '../ui/MagicRings';

export function Hero() {
  /* ==========================================================================
     1. WORKSPACE STATE & THEME PROPERTY SUBSCRIPTIONS
     ========================================================================== */
  const { currentDimension } = useThemeStore();
  const pack = dimensionPacks[currentDimension];

  // Subscribe dynamically to your global live backend database values matrix
  const { data } = usePortfolioStore();

  const avatarBg = currentDimension === 'creamy' 
    ? 'bg-stone-900 border-stone-300/40 text-stone-100 shadow-[0_20px_50px_rgba(40,40,40,0.15)]' 
    : 'bg-zinc-900/90 border-zinc-800/80 text-zinc-400 shadow-2xl';

  // ADAPTIVE MAGIC RINGS CONFIGURATIONS:
  const ringConfig = {
    cosmic: { color: '#10b981', colorTwo: '#34d399', ringCount: 5, speed: 0.6 },
    arctic: { color: '#B069DB', colorTwo: '#22d3ee', ringCount: 6, speed: 1.0 },
    creamy: { color: '#FFEE8C', colorTwo: '#f43f5e', ringCount: 4, speed: 0.8 }
  }[currentDimension] || { color: '#10b981', colorTwo: '#34d399', ringCount: 5, speed: 0.6 };

  /* ==========================================================================
     2. DYNAMIC CONTENT FAILSAFE BINDINGS
     ========================================================================== */
  const title = data?.hero.title || "Bachelor of Science in Information Systems";
  const name = data?.hero.name || "Christian John K. Lague";
  const tagline = data?.hero.tagline || "Building responsive, modern, and interactive digital ecosystems.";
  const profileImage = data?.hero.profileImage;

  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 min-h-[65vh] py-12">
      
      {/* LEFT COLUMN: LIVE DYNAMIC CONTENT TEXT BLOCKS */}
      <div className="flex-1 flex flex-col items-start justify-center">
        <span className={`text-xs font-bold tracking-widest uppercase font-mono mb-4 ${currentDimension === 'creamy' ? 'text-rose-500' : currentDimension === 'arctic' ? 'text-cyan-400' : 'text-emerald-500'}`}>
          {title}
        </span>
        
        <h1 className={`text-4xl md:text-6xl font-extrabold tracking-tight mb-6 ${pack.textPrimary}`}>
          {name}
        </h1>
        
        <p className={`text-lg md:text-xl max-w-2xl font-normal leading-relaxed ${pack.textSecondary}`}>
          {tagline}
        </p>
      </div>

      {/* RIGHT COLUMN: PROFILE PICTURE CLOUD ASSET CANVAS */}
      <div className="flex items-center justify-center relative w-72 h-72 md:w-80 md:h-80 select-none group">
        
        {/* PARALLAX RINGS CANVAS OVERLAY LAYOUT */}
        <div 
          className="absolute pointer-events-none z-0 w-[180%] h-[180%] top-[40%] left-[40%]"
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
            baseRadius={0.25}       
            radiusStep={0.06}       
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

        {/* PROFILE MAIN MOUNT BOUNDS PANEL CONTAINER */}
        <div 
          className={`w-64 h-64 md:w-72 md:h-72 rounded-full border flex items-center justify-center text-center transition-all duration-500 relative z-10 overflow-hidden ${avatarBg}`}
        >
          {profileImage ? (
            /* 🚀 REFACTORED ELEMENT MOUNT: AUTOMATED DUAL-IMAGE GLITCH CROSSFADER */
            <PixelImageTransition 
              intervalDuration={3000} // 🕒 Glitches and swaps exactly every 3 seconds!
              firstContent={
                <img 
                  src={profileImage} 
                  alt="Primary Profile Avatar" 
                  className="hidden" // Kept hidden, canvas reads the source url tracking references natively
                />
              }
              secondContent={
                data?.hero?.profileImageSecondary ? (
                  <img 
                    src={data.hero.profileImageSecondary} 
                    alt="Secondary Profile Avatar" 
                    className="hidden"
                  />
                ) : undefined
              }
            />
          ) : (
            <span className="font-mono text-xs uppercase tracking-widest opacity-40 p-6">
              [ No Photo Loaded ]
            </span>
          )}
        </div>
      </div>

    </section>
  );
}

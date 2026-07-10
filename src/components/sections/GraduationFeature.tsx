import { useThemeStore, dimensionPacks } from '../../store/themeStore';
import { usePortfolioStore } from '../../store/portfolioStore'; 
import { FiAward, FiHeart } from 'react-icons/fi';

// Utility to clean up double-escaped JSON strings
const decodeMessage = (msg: string) =>
  msg
    .replace(/\\\\/g, '\\')   // turn \\ into \
    .replace(/\\"/g, '"')     // turn \" into "
    .replace(/âœ¨/g, '✨');   // fix broken star character

export function GraduationFeature() {
  const { currentDimension } = useThemeStore();
  const pack = dimensionPacks[currentDimension];
  const { data } = usePortfolioStore();

  const graduation = data?.graduation || {
    isEnabled: true,
    badgeText: "Class of 2026 Launch Pad",
    title: "Welcome to My Digital Portal! 👋",
    subtitle: "BS in Information Systems — Graduating Tomorrow!",
    message: "\"Information Systems is about engineering solutions that connect human intent with computing potential.\"",
    gcashUrl: "" // Displays your uploaded picture base64 string
  };

  if (!graduation.isEnabled) return null;

  const cardStyles = {
    cosmic: { accentText: 'text-emerald-400', badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    arctic: { accentText: 'text-cyan-400', badgeBg: 'bg-[#B069DB]/10 text-fuchsia-300 border-[#B069DB]/30' },
    creamy: { accentText: 'text-rose-500', badgeBg: 'bg-[#FFEE8C] text-stone-900 border-stone-300' }
  }[currentDimension] || { accentText: 'text-emerald-400', badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };

  return (
    <div className={`w-full border rounded-2xl p-6 md:p-10 transition-all duration-300 relative overflow-hidden ${pack.cardClass}`}>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* TEXT COLUMN */}
        <div className="flex-1 flex flex-col items-start justify-center">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono mb-6 font-bold tracking-wider uppercase ${cardStyles.badgeBg}`}>
            <FiAward className="text-sm" />
            <span>{graduation.badgeText}</span>
          </div>

          <h2 className={`text-2xl md:text-4xl font-extrabold tracking-tight mb-4 ${pack.textPrimary}`}>
            {graduation.title}
          </h2>
          
          <h3 className={`text-lg md:text-xl font-medium mb-6 ${cardStyles.accentText}`}>
            {graduation.subtitle}
          </h3>

          <div className="space-y-4 max-w-2xl">
            {/* Use <pre> for proper indentation */}
            <pre
              className={`text-base leading-relaxed whitespace-pre-wrap break-words font-mono ${pack.textSecondary}`}
            >
              {decodeMessage(graduation.message)}
            </pre>
            <p className={`text-sm italic font-medium flex items-center gap-1.5 ${pack.textSecondary}`}>
              <FiHeart className="inline text-rose-500" /> Congratulations on Graduation!
            </p>
          </div>
        </div>

        {/* NATIVE CELEBRATION PICTURE DISPLAY SLOT */}
        {graduation.gcashUrl && (
          <div className="w-full lg:w-72 h-48 md:h-64 rounded-xl overflow-hidden border border-white/10 shadow-2xl shrink-0">
            <img 
              src={graduation.gcashUrl} 
              alt="Celebration Feature" 
              className="w-full h-full object-cover animate-fadeIn" 
            />
          </div>
        )}

      </div>
    </div>
  );
}

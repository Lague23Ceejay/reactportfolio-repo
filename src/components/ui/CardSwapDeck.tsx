import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SkillItem {
  name: string;
  iconCode: string;
}

interface CardSwapDeckProps {
  skills: SkillItem[];
}

export function CardSwapDeck({ skills }: CardSwapDeckProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (skills.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % skills.length);
    }, 3200); // Automatically cycles card frames every 3.2 seconds
    return () => clearInterval(interval);
  }, [skills.length]);

  if (!skills || skills.length === 0) return null;

  // Helper engine to fetch matching vector classes
  const getIconClass = (code: string) => {
    const clean = (code || '').toLowerCase().trim();
    if (clean === 'react') return 'devicon-react-original colored';
    if (clean === 'ts' || clean === 'typescript') return 'devicon-typescript-plain colored';
    if (clean === 'tailwind' || clean === 'tailwindcss') return 'devicon-tailwindcss-original colored';
    if (clean === 'js' || clean === 'javascript') return 'devicon-javascript-plain colored';
    if (clean === 'node' || clean === 'nodejs') return 'devicon-nodejs-plain colored';
    if (clean === 'html' || clean === 'html5') return 'devicon-html5-plain colored';
    if (clean === 'css' || clean === 'css3') return 'devicon-css3-plain colored';
    return 'devicon-code-plain text-zinc-500';
  };

  const currentSkill = skills[index];

  return (
    <div className="relative w-full h-48 flex items-center justify-center perspective-1000 select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.82, rotateY: -15, z: -40 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0, z: 0 }}
          exit={{ opacity: 0, scale: 0.9, rotateY: 15, z: -20 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          className="absolute w-full max-w-[240px] h-40 bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 shadow-2xl shadow-black/50 preserve-3d"
        >
          {/* Circular Icon Container */}
          <div className="w-16 h-16 bg-zinc-950 border border-zinc-800/60 rounded-xl flex items-center justify-center shadow-inner">
            <i className={`${getIconClass(currentSkill.iconCode)} text-3xl block`} />
          </div>
          <div className="text-center space-y-1">
            <h4 className="text-sm font-mono font-bold text-zinc-100 tracking-tight">{currentSkill.name}</h4>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Toolkit Module</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useThemeStore, dimensionPacks } from '../../store/themeStore';
import { FiLayers } from 'react-icons/fi';
import type { DimensionType } from '../../types/theme';

export const CircularSwitcher: React.FC = () => {
  const { currentDimension, setHoveredDimension, triggerHop } = useThemeStore();
  const [isActivated, setIsActivated] = useState(false);

  const dimensions = Object.keys(dimensionPacks) as DimensionType[];

  const switcherColorMap = {
    cosmic: { mainBg: '#ffffff', iconColor: '#000000', label: 'Cosmic' },
    arctic: { mainBg: '#B069DB', iconColor: '#ff6b35', label: 'Neon' },
    creamy: { mainBg: '#FFEE8C', iconColor: '#22d3ee', label: 'Creamy' }
  };

  const currentThemeColors = switcherColorMap[currentDimension];

  return (
    /* 
      SENIOR LAYOUT MATRIX:
      - Desktop view: Stays locked in the bottom-right corner to prevent mouse tracking glitches.
      - Mobile view: Centered layout activates ONLY when open to keep smartphone targets comfortable.
    */
    <div 
      onClick={() => setIsActivated(false)}
      className={`fixed flex items-center justify-center select-none touch-none transition-all duration-500 ease-out ${
        isActivated 
          ? 'inset-0 w-screen h-screen bg-black/55 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none md:inset-auto md:bottom-8 md:right-8 md:w-24 md:h-24' 
          : 'bottom-8 right-8 w-20 h-20'
      }`}
      style={{
        zIndex: 99999,
        pointerEvents: 'auto',
        WebkitTapHighlightColor: 'transparent',
        outline: 'none'
      }}
      onMouseEnter={() => setIsActivated(true)}
      onMouseLeave={() => {
        setIsActivated(false);
        setHoveredDimension(null);
      }}
    >
      {/* RADIALLY DISTRIBUTED SWITCHER DOTS */}
      <AnimatePresence>
        {isActivated && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto md:w-full md:h-full">
            {dimensions.map((dim, i) => {
              const angle = (i * 2 * Math.PI) / dimensions.length - Math.PI / 2;
              
              // CROSS-DEVICE RADIAL TUNING:
              // Gives mobile buttons room in the center, and clusters tightly on desktop corners
              const radius = typeof window !== 'undefined' && window.innerWidth < 768 ? 115 : 68;
              
              const targetColors = switcherColorMap[dim];

              return (
                <motion.button
                  key={`hop-${dim}`}
                  type="button"
                  initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1, 
                    x: Math.cos(angle) * radius, 
                    y: Math.sin(angle) * radius 
                  }}
                  exit={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 250, damping: 22 }}
                  
                  onMouseEnter={() => setHoveredDimension(dim)}
                  onMouseLeave={() => setHoveredDimension(null)}

                  onTouchStart={(e) => {
                    e.stopPropagation();
                    setHoveredDimension(dim);
                  }}

                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHop(dim);
                    setIsActivated(false);
                  }}
                  className="absolute w-16 h-16 md:w-14 md:h-14 rounded-full flex flex-col items-center justify-center shadow-2xl border border-white/10 overflow-hidden group select-none cursor-pointer transition-transform duration-200 outline-none"
                  style={{ 
                    backgroundColor: targetColors.mainBg,
                    WebkitTapHighlightColor: 'transparent',
                    outline: 'none'
                  }}
                >
                  <FiLayers className="text-lg md:text-sm mb-0.5" style={{ color: targetColors.iconColor }} />
                  <span className="text-[9px] md:text-[8px] font-extrabold tracking-wider uppercase font-sans" style={{ color: targetColors.iconColor }}>
                    {targetColors.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* CORE TRIGGER ACTUATOR HEAD */}
      <motion.button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsActivated(!isActivated);
        }}
        /*
          CROSS-DEVICE ANIMATION MATRIX:
          Framer-motion spring dynamics stay perfectly still on desktop view, 
          but glide gracefully to the center on mobile screens.
        */
        animate={{ 
          scale: isActivated ? 1.15 : 1.0,
          rotate: isActivated ? 45 : 0,
          x: isActivated && typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 0,
          y: isActivated && typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 0
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        style={{ 
          backgroundColor: currentThemeColors.mainBg, 
          boxShadow: isActivated 
            ? `0 15px 45px rgba(0,0,0,0.4), 0 0 30px ${currentThemeColors.mainBg}20` 
            : '0 6px 20px rgba(0,0,0,0.15)',
          WebkitTapHighlightColor: 'transparent',
          outline: 'none'
        }}
        className="w-16 h-16 md:w-14 md:h-14 rounded-full flex flex-col items-center justify-center shadow-2xl cursor-pointer relative z-10 border border-white/10 outline-none select-none"
      >
        <FiLayers className="text-xl md:text-lg" style={{ color: currentThemeColors.iconColor }} />
      </motion.button>
    </div>
  );
};

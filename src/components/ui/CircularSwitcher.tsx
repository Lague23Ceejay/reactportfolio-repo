// src/components/ui/CircularSwitcher.tsx
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
    creamy: { mainBg: '#FFEE8C', iconColor: '#22d3ee', label: 'Creamy' },
  };

  const currentThemeColors = switcherColorMap[currentDimension];

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      // Configures drag boundaries to measure inwards from the right and bottom walls
      dragConstraints={{
        left: -window.innerWidth + 96,
        right: -16,
        top: -window.innerHeight + 96,
        bottom: -16
      }}
      // CRITICAL FIX: Negative values push the button away from the bottom-right edge
      initial={{ x: -28, y: -28 }}
      className="fixed w-20 h-20 flex items-center justify-center select-none"
      style={{
        zIndex: 99999,
        pointerEvents: 'auto',
        touchAction: 'none',
        WebkitTapHighlightColor: 'transparent',
        outline: 'none',
        // ANCHOR SWITCH: Lock baseline zero positions to the bottom-right
        right: 0,
        bottom: 0,
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
          <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-auto">
            {dimensions.map((dim, i) => {
              const angle = (i * 2 * Math.PI) / dimensions.length - Math.PI / 2;
              const radius = 68; 
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
                  className="absolute w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-2xl border border-white/10 overflow-hidden group select-none cursor-pointer transition-transform duration-200 outline-none"
                  style={{ 
                    backgroundColor: targetColors.mainBg,
                    WebkitTapHighlightColor: 'transparent',
                    outline: 'none'
                  }}
                >
                  <FiLayers className="text-sm mb-0.5" style={{ color: targetColors.iconColor }} />
                  <span className="text-[8px] font-extrabold tracking-wider uppercase font-sans" style={{ color: targetColors.iconColor }}>
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
        animate={{ 
          scale: isActivated ? 1.12 : 1.0,
          rotate: isActivated ? 45 : 0 
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        style={{ 
          backgroundColor: currentThemeColors.mainBg, 
          boxShadow: isActivated 
            ? `0 12px 35px rgba(0,0,0,0.35), 0 0 25px ${currentThemeColors.mainBg}20` 
            : '0 6px 20px rgba(0,0,0,0.15)',
          WebkitTapHighlightColor: 'transparent',
          outline: 'none'
        }}
        onClick={(e) => {
          e.stopPropagation();
          setIsActivated(!isActivated);
        }}
        className="w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-2xl cursor-pointer relative z-10 border border-white/10 outline-none select-none"
      >
        <FiLayers className="text-lg" style={{ color: currentThemeColors.iconColor }} />
      </motion.button>
    </motion.div>
  );
};

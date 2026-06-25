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
      - Forced an ultra-high fixed z-[99999] layer to completely bypass post-hop context stacking traps.
      - Added a clean onClick dismiss anchor directly onto the full-screen backdrop overlay.
        If a smartphone user changes their mind, tapping anywhere on the darkened empty screen safely collapses the menu back into the corner!
    */
    <div 
      onClick={() => setIsActivated(false)} // MOBILE DISMISS FIX: Tap anywhere outside to close if you change your mind
      className={`fixed transition-all duration-500 ease-out flex items-center justify-center`}
      style={{
        zIndex: 99999, // FIX: Prevents underlying pages or layout transitions from clipping touch inputs
        inset: isActivated ? '0px' : 'auto',
        width: isActivated ? '100vw' : '80px',
        height: isActivated ? '100vh' : '80px',
        bottom: isActivated ? '0px' : '32px',
        right: isActivated ? '0px' : '32px',
        backgroundColor: isActivated ? 'rgba(0,0,0,0.55)' : 'transparent',
        backdropFilter: isActivated ? 'blur(4px)' : 'none',
        pointerEvents: 'auto'
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
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            {dimensions.map((dim, i) => {
              const angle = (i * 2 * Math.PI) / dimensions.length - Math.PI / 2;
              const radius = 115;
              const targetColors = switcherColorMap[dim];

              return (
                <motion.button
                  key={`hop-${dim}`}
                  initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1, 
                    x: Math.cos(angle) * radius, 
                    y: Math.sin(angle) * radius 
                  }}
                  exit={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                  onMouseEnter={() => setHoveredDimension(dim)}
                  onMouseLeave={() => setHoveredDimension(null)}
                  onClick={(e) => {
                    e.stopPropagation(); // Stop click from propagating up to the backdrop dismiss handler
                    triggerHop(dim);
                    setIsActivated(false);
                  }}
                  className="absolute w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-[0_12px_35px_rgba(0,0,0,0.4)] border border-white/10 overflow-hidden group select-none cursor-pointer transition-transform duration-200"
                  style={{ backgroundColor: targetColors.mainBg }}
                >
                  <div 
                    className="absolute inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-2 border-dashed"
                    style={{ borderColor: targetColors.iconColor }}
                  />
                  <FiLayers className="text-xl mb-1 transition-transform group-hover:scale-110 duration-200" style={{ color: targetColors.iconColor }} />
                  <span className="text-[10px] font-extrabold tracking-wider uppercase font-sans" style={{ color: targetColors.iconColor }}>
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
          // On mobile screens, tapping the local corner button opens the portal menu context cleanly
          setIsActivated(!isActivated);
        }}
        animate={{ 
          scale: isActivated ? 1.25 : 1.0,
          rotate: isActivated ? 45 : 0 
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        style={{ 
          backgroundColor: currentThemeColors.mainBg, 
          boxShadow: isActivated 
            ? `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${currentThemeColors.mainBg}30` 
            : '0 8px 24px rgba(0,0,0,0.2)' 
        }}
        className="w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-2xl cursor-pointer relative z-10 border border-white/10 outline-none select-none"
      >
        <FiLayers className="text-2xl" style={{ color: currentThemeColors.iconColor }} />
      </motion.button>
    </div>
  );
};

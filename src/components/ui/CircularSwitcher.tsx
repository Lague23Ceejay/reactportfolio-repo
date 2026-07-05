import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useThemeStore, dimensionPacks } from '../../store/themeStore';
import { FiLayers } from 'react-icons/fi';
import type { DimensionType } from '../../types/theme';

export const CircularSwitcher: React.FC = () => {
  const { currentDimension, setHoveredDimension, triggerHop } = useThemeStore();
  const [isActivated, setIsActivated] = useState(false);
  const [position, setPosition] = useState({ x: 28, y: 28 });
  const dragRef = useRef<HTMLDivElement>(null);

  const dimensions = Object.keys(dimensionPacks) as DimensionType[];

  const switcherColorMap = {
    cosmic: { mainBg: '#ffffff', iconColor: '#000000', label: 'Cosmic' },
    arctic: { mainBg: '#B069DB', iconColor: '#ff6b35', label: 'Neon' },
    creamy: { mainBg: '#FFEE8C', iconColor: '#22d3ee', label: 'Creamy' }
  };

  const currentThemeColors = switcherColorMap[currentDimension];
  const switcherStyle = useMemo(() => ({
    left: position.x,
    top: position.y,
  }), [position.x, position.y]);

  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.min(window.innerWidth - 84, Math.max(16, prev.x)),
        y: Math.min(window.innerHeight - 84, Math.max(16, prev.y)),
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const rect = dragRef.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const onMove = (moveEvent: PointerEvent) => {
      const nextX = moveEvent.clientX - offsetX;
      const nextY = moveEvent.clientY - offsetY;
      setPosition({
        x: Math.min(window.innerWidth - 84, Math.max(16, nextX)),
        y: Math.min(window.innerHeight - 84, Math.max(16, nextY)),
      });
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div
      ref={dragRef}
      className="fixed w-20 h-20 flex items-center justify-center select-none"
      style={{
        zIndex: 99999,
        pointerEvents: 'auto',
        left: switcherStyle.left,
        top: switcherStyle.top,
        WebkitTapHighlightColor: 'transparent',
        outline: 'none',
      }}
      onMouseEnter={() => setIsActivated(true)}
      onMouseLeave={() => {
        setIsActivated(false);
        setHoveredDimension(null);
      }}
      onPointerDown={handlePointerDown}
      // Mobile tap toggle helper ensures the menu functions reliably on phone screens
      onClick={(e) => {
        e.stopPropagation();
        setIsActivated(!isActivated);
      }}
    >
      {/* RADIALLY DISTRIBUTED SWITCHER DOTS */}
      <AnimatePresence>
        {isActivated && (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-auto">
            {dimensions.map((dim, i) => {
              // Calculate tight, clustered corner spacing angles
              const angle = (i * 2 * Math.PI) / dimensions.length - Math.PI / 2;
              const radius = 68; // Compact radial sweep optimized for the corner anchor
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
        className="w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-2xl cursor-pointer relative z-10 border border-white/10 outline-none select-none"
      >
        <FiLayers className="text-lg" style={{ color: currentThemeColors.iconColor }} />
      </motion.button>
    </div>
  );
};

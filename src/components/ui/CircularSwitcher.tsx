import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useThemeStore, dimensionPacks } from '../../store/themeStore';
import { FiLayers } from 'react-icons/fi';

// SENIOR DEV FIX: Explicit type-only import for verbatimModuleSyntax compliance
import type { DimensionType } from '../../types/theme';

export const CircularSwitcher: React.FC = () => {
  const { currentDimension, setHoveredDimension, triggerHop } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const activeColor = dimensionPacks[currentDimension].cursor.color;
  const dimensions = Object.keys(dimensionPacks) as DimensionType[];
  return (
    <div 
      className="fixed bottom-8 right-8 z-[999] flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredDimension(null);
      }}
    >
      {/* Background Subtle Preview Teaser Dots */}
      <AnimatePresence>
        {isHovered && !isOpen && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {dimensions.map((dim, i) => {
              const angle = (i * 2 * Math.PI) / dimensions.length;
              const radius = 34; 
              return (
                <motion.div
                  key={`teaser-${dim}`}
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  animate={{ 
                    opacity: 0.6, 
                    x: Math.cos(angle) * radius, 
                    y: Math.sin(angle) * radius 
                  }}
                  exit={{ opacity: 0, x: 0, y: 0 }}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ backgroundColor: dimensionPacks[dim].cursor.color }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>
      {/* Bursting Dimension Hop Rings */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute inset-0 flex items-center justify-center">
            {dimensions.map((dim, i) => {
              // Calculate perfect spacing coordinates inside a radial unit-circle 
              const angle = (i * 2 * Math.PI) / dimensions.length - Math.PI / 2;
              const radius = 75; 
              const pack = dimensionPacks[dim];

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
                  whileHover={{ scale: 1.2 }}
                  onMouseEnter={() => setHoveredDimension(dim)}
                  onMouseLeave={() => setHoveredDimension(null)}
                  onClick={() => {
                    triggerHop(dim);
                    setIsOpen(false);
                  }}
                  className="theme-dot absolute w-12 h-12 rounded-full flex flex-col items-center justify-center border text-[9px] font-bold shadow-xl overflow-hidden group bg-zinc-950 border-zinc-800"
                >
                  <div 
                    className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity" 
                    style={{ backgroundColor: pack.cursor.color }}
                  />
                  <span style={{ color: pack.cursor.color }}>{pack.name.split(' ')[0]}</span>
                </motion.button>
              );
            })}
          </div>
        )}
      </AnimatePresence>
      {/* Core Trigger Button Layout */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        animate={{ scale: isHovered || isOpen ? 1.15 : 1, rotate: isOpen ? 135 : 0 }}
        style={{ borderColor: activeColor, boxShadow: isHovered ? `0 0 20px ${activeColor}40` : 'none' }}
        className="w-14 h-14 bg-zinc-950 border-2 rounded-full flex items-center justify-center text-xl text-zinc-100 shadow-2xl transition-shadow cursor-none relative z-10"
      >
        <FiLayers style={{ color: activeColor }} />
      </motion.button>
    </div>
  );
};
